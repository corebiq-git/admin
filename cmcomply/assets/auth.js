import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id), err=$("loginError");
let confirmationResult=null, verifier=null;
const showError=m=>{err.textContent=m;err.classList.add("show")};
const normalizePhone=v=>{let x=v.trim().replace(/[^\d+]/g,""); if(x.startsWith("0")) x="+91"+x.slice(1); if(/^\d{10}$/.test(x)) x="+91"+x; return x};
async function findClient(identifier){
 const raw=identifier.trim(), phone=normalizePhone(raw);
 const fields = raw.includes("@") ? ["email"] : ["phone"];
 for(const field of fields){
  const q=query(collection(db,"clients"),where(field,"==",field==="phone"?phone:raw.toLowerCase()));
  const snap=await getDocs(q); if(!snap.empty) return {id:snap.docs[0].id,data:snap.docs[0].data()};
 }
 return null;
}
$("loginForm").addEventListener("submit",async e=>{
 e.preventDefault();err.classList.remove("show");
 const identifier=$("identifier").value;
 try{
  const client=await findClient(identifier);
  if(!client) throw new Error("No active CM Comply client record was found for this email or mobile number.");
  sessionStorage.setItem("cmClientId",client.id);
  sessionStorage.setItem("cmClient",JSON.stringify(client.data));
  if(identifier.includes("@")){
    $("emailPasswordField").classList.remove("hidden");
    if(!$("password").value){ $("password").focus(); return; }
    await signInWithEmailAndPassword(auth,identifier.toLowerCase(),$("password").value);
    location.href="index.html";
  }else{
    verifier ||= new RecaptchaVerifier(auth,"recaptcha-container",{size:"invisible"});
    confirmationResult=await signInWithPhoneNumber(auth,normalizePhone(identifier),verifier);
    $("otpBox").classList.remove("hidden");$("continueBtn").disabled=true;
  }
 }catch(e){showError(e.message||"Unable to sign in.");}
});
$("otpForm").addEventListener("submit",async e=>{
 e.preventDefault();try{await confirmationResult.confirm($("otp").value);location.href="index.html"}catch(e){showError("Invalid or expired OTP.");}
});
onAuthStateChanged(auth,user=>{if(user && location.pathname.endsWith("login.html")) location.href="index.html"});

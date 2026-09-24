import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const clientId=sessionStorage.getItem("cmClientId"),client=JSON.parse(sessionStorage.getItem("cmClient")||"{}");
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function requireClient(){if(!clientId){location.href="login.html";return false}return true}
if(!requireClient()) throw new Error("No client session");
$("clientId")&&($("clientId").textContent=client.clientId||clientId);
$("clientName")&&($("clientName").textContent=client.name?`, ${client.name.split(" ")[0]}`:"");
$("logoutBtn")?.addEventListener("click",async()=>{await signOut(auth);sessionStorage.clear();location.href="login.html"});
async function loadDashboard(){
 try{
  const q=query(collection(db,"compliance"),where("clientId","==",clientId),orderBy("dueDate","asc"),limit(10));
  const snap=await getDocs(q), rows=snap.docs.map(d=>({id:d.id,...d.data()}));
  const pending=rows.filter(x=>["Pending","In Progress","Overdue"].includes(x.status));
  const month=new Date().toISOString().slice(0,7);
  $("pendingCount")&&($("pendingCount").textContent=pending.length);
  $("dueCount")&&($("dueCount").textContent=rows.filter(x=>String(x.dueDate||"").startsWith(month)).length);
  $("docCount")&&($("docCount").textContent="—");
  $("paymentCount")&&($("paymentCount").textContent="—");
  const body=$("recentCompliance"); if(body) body.innerHTML=rows.slice(0,5).map(x=>`<tr><td><strong>${esc(x.name)}</strong></td><td>${esc(x.period||"—")}</td><td>${esc(x.dueDate||"—")}</td><td><span class="status ${String(x.status).toLowerCase().replace(" ","-")}">${esc(x.status||"Pending")}</span></td></tr>`).join("")||`<tr><td colspan="4" class="empty">No compliance records found.</td></tr>`;
 }catch(e){console.error(e)}
}
onAuthStateChanged(auth,user=>{if(!user)location.href="login.html";else loadDashboard()});
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");

import { firebaseConfig } from "./firebase-config.js";
let app, auth, db, authApi, fsApi;
export async function firebaseServices(){
  if(auth && db) return {app,auth,db,authApi,fsApi};
  const appMod=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
  authApi=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js");
  fsApi=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js");
  app=appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
  auth=authApi.getAuth(app); db=fsApi.getFirestore(app);
  return {app,auth,db,authApi,fsApi};
}
export async function signIn(email,password){const s=await firebaseServices();return (await s.authApi.signInWithEmailAndPassword(s.auth,email,password)).user}
export async function signUp(email,password,displayName,branchId){
 const s=await firebaseServices();
 const credential=await s.authApi.createUserWithEmailAndPassword(s.auth,email,password);
 const profile={uid:credential.user.uid,email:credential.user.email,displayName,role:"pending",branchId:branchId||"INDIA",createdAt:new Date().toISOString()};
 await s.fsApi.setDoc(s.fsApi.doc(s.db,"users",credential.user.uid),profile);
 return credential.user;
}
export async function getProfile(user){
 const s=await firebaseServices();
 const snap=await s.fsApi.getDoc(s.fsApi.doc(s.db,"users",user.uid));
 if(snap.exists()) return {uid:user.uid,...snap.data()};
 const profile={uid:user.uid,email:user.email,displayName:user.displayName||"",role:"pending",branchId:"INDIA",createdAt:new Date().toISOString()};
 await s.fsApi.setDoc(s.fsApi.doc(s.db,"users",user.uid),profile);
 return profile;
}
export async function signOut(){const s=await firebaseServices();return s.authApi.signOut(s.auth)}
export async function observeAuth(callback){const s=await firebaseServices();return s.authApi.onAuthStateChanged(s.auth,callback)}

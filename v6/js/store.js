import { seedData } from "./data.js";
import { useFirebase } from "./firebase-config.js";
import { firebaseServices } from "./auth.js";
let db=null,fb=null,userProfile=null;
const STORAGE_KEY="voyage-travel-management-v1";
function deepCopy(x){return JSON.parse(JSON.stringify(x))}
function readLocal(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));if(x&&x.collections)return x.collections}catch(e){}return deepCopy(seedData)}
function writeLocal(){localStorage.setItem(STORAGE_KEY,JSON.stringify({collections:data}))}
let data=readLocal();
export async function initStore(profile){
 userProfile=profile||null;
 if(useFirebase){
  const s=await firebaseServices(); db=s.db; fb=s.fsApi;
  if(!s.auth.currentUser)throw new Error("Please sign in to use Voyage.");
  if(!userProfile||!userProfile.role||userProfile.role==="pending")throw new Error("Your account is awaiting admin approval. Ask the Voyage administrator to assign your role.");
  data={};
  const {moduleConfig}=await import("./data.js");
  for(const key of Object.keys(moduleConfig)){
   const base=fb.collection(db,key);
   const query=userProfile.role==="admin"?base:fb.query(base,fb.where("branchId","in",[userProfile.branchId||"INDIA","BOTH"]));
   const snap=await fb.getDocs(query);
   data[key]=snap.docs.map(d=>({id:d.id,...d.data()}));
  }
  return {mode:"firebase",profile:userProfile};
 }
 return {mode:"local",profile:userProfile};
}
export function getProfile(){return userProfile}
export function getMode(){return db?"firebase":"local"}
export function all(collection){return deepCopy(data[collection]||[])}
export function get(collection,id){return deepCopy((data[collection]||[]).find(x=>x.id===id)||null)}
export function label(collection,id,field="name"){const r=(data[collection]||[]).find(x=>x.id===id);return r?(r[field]||r.name||r.id):"—"}
export async function save(collection,record){
 if(!data[collection])data[collection]=[];
 const now=new Date().toISOString();
 let saved={...record,updatedAt:now};
 if(record.id){const idx=data[collection].findIndex(x=>x.id===record.id);saved={...(idx>=0?data[collection][idx]:{}),...saved};if(idx>=0)data[collection][idx]=saved;else data[collection].push(saved)}
 else{saved.id=(globalThis.crypto?.randomUUID?.()||("rec"+Date.now()+Math.random().toString(16).slice(2)));saved.createdAt=now;data[collection].push(saved)}
 if(db&&fb){const {id,...payload}=saved;await fb.setDoc(fb.doc(db,collection,id),payload,{merge:true})}else writeLocal();
 return deepCopy(saved);
}
export async function remove(collection,id){
 if(db&&fb)await fb.deleteDoc(fb.doc(db,collection,id));
 data[collection]=(data[collection]||[]).filter(x=>x.id!==id);
 if(!db)writeLocal();
}
export function resetDemo(){data=deepCopy(seedData);writeLocal()}
export function totalsForBranch(branch){const bookings=(data.bookings||[]).filter(x=>branch==="ALL"||x.branchId===branch);const invoices=(data.invoices||[]).filter(x=>branch==="ALL"||x.branchId===branch);const expenses=(data.expenses||[]).filter(x=>branch==="ALL"||x.branchId===branch);return {bookings,invoices,expenses}}

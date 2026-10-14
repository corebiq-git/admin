import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY0eJ0iAVxP2tn2RLe7wVNB8Q15Vnjd-g",
  authDomain: "cmb-40001.firebaseapp.com",
  projectId: "cmb-40001",
  storageBucket: "cmb-40001.firebasestorage.app",
  messagingSenderId: "294144253040",
  appId: "1:294144253040:web:852b7c378ee8049f4268b5",
  measurementId: "G-RX05KNR8Y3"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const $ = (id) => document.getElementById(id);
const state = { user: null, clients: [], compliance: [], credentials: [], documents: [], loaded: false, view: "overview", admin: false };
const pageInfo = {
  overview: ["ADMINISTRATION", "Overview", "A clear view of clients, compliance work and documents."],
  clients: ["CLIENT MANAGEMENT", "Clients", "Client data synchronized from your Google Sheets workflow."],
  compliance: ["WORK MANAGEMENT", "Compliance", "Track task status, due dates, periods and task folders."],
  documents: ["GOOGLE DRIVE", "Drive documents", "Open existing client and task folders without moving files."],
  credentials: ["RESTRICTED AREA", "Credentials", "Admin-only inventory of portal access records."],
  sync: ["INTEGRATIONS", "Sync status", "Check the Firestore connection and Google Sheets sync workflow."]
};

function esc(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function norm(v) { return String(v ?? "").trim(); }
function first(obj, keys, fallback="") { for (const k of keys) if (obj?.[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") return obj[k]; return fallback; }
function prettyDate(value) {
  const s = norm(value);
  if (!s) return "—";
  // Support ISO dates, Google Sheets date strings (e.g. 01-Feb-2026), and dd-MM-yyyy.
  let d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    const m = s.match(/^(\d{1,2})[-/ ]([A-Za-z]{3,}|\d{1,2})[-/ ](\d{4})$/);
    if (m) {
      const months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
      const month = /^[A-Za-z]/.test(m[2]) ? months[m[2].slice(0,3).toLowerCase()] : Number(m[2])-1;
      d = new Date(Number(m[3]), month, Number(m[1]));
    }
  }
  if (!Number.isNaN(d.getTime()) && d.getFullYear() > 1900) {
    return d.toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"});
  }
  return s;
}
function parseDateMillis(value) {
  const pretty = prettyDate(value);
  if (pretty === "—") return 0;
  const d = new Date(norm(value));
  if (!Number.isNaN(d.getTime())) return d.getTime();
  const p = pretty.match(/^(\d{2}) ([A-Za-z]{3}) (\d{4})$/);
  if (p) return new Date(Number(p[3]), ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(p[2]), Number(p[1])).getTime();
  return 0;
}
function dateMillis(value) { return parseDateMillis(value); }
function statusClass(status) {
  const s = norm(status).toLowerCase();
  if (s.includes("overdue") || s.includes("reject") || s.includes("failed")) return "danger";
  if (s.includes("complete") || s.includes("filed") || s.includes("paid") || s.includes("active")) return "success";
  if (s.includes("pending") || s.includes("progress") || s.includes("unpaid")) return "pending";
  if (s.includes("due") || s.includes("review")) return "info";
  return "";
}
function badge(value, extra="") { const v = norm(value) || "Not set"; return `<span class="status-badge ${statusClass(v)} ${extra}">${esc(v)}</span>`; }
function driveUrl(record, type) {
  const raw = type === "client"
    ? first(record, ["documentFolderUrl","documentFolder","clientFolderLink","clientFolderUrl","folderUrl","driveUrl"])
    : first(record, ["taskFolderLink","complianceFolderLink","documentFolderUrl","driveUrl","fileUrl"]);
  const value = norm(raw);
  return /^https:\/\/(drive\.google\.com|docs\.google\.com)\//i.test(value) ? value : "";
}
function showToast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 3200); }
function setNotice(message="") { const el = $("globalNotice"); el.textContent = message; el.classList.toggle("show", !!message); }
function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }
function setLoginMessage(message, isError=true) { const el = $("loginMessage"); el.textContent = message; el.style.color = isError ? "#b3261e" : "#137333"; }

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); setLoginMessage("Signing in…", false);
  try { await signInWithEmailAndPassword(auth, $("loginEmail").value.trim(), $("loginPassword").value); }
  catch (err) { setLoginMessage(authError(err)); }
});
$("forgotPassword").addEventListener("click", async () => {
  const email = $("loginEmail").value.trim();
  if (!email) return setLoginMessage("Enter your administrator email first.");
  try { await sendPasswordResetEmail(auth, email); setLoginMessage("Password reset email sent if the account exists.", false); }
  catch (err) { setLoginMessage(authError(err)); }
});
$("signOut").addEventListener("click", () => signOut(auth));
$("refreshBtn").addEventListener("click", () => loadData(true));
$("syncRefreshBtn").addEventListener("click", () => loadData(true));
$("openSidebar").addEventListener("click", openSidebar);
$("closeSidebar").addEventListener("click", closeSidebar);
$("sidebarOverlay").addEventListener("click", closeSidebar);

document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.view)));
document.querySelectorAll("[data-goto]").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.goto)));
["clientSearch","complianceSearch","documentSearch","credentialSearch"].forEach(id => $(id).addEventListener("input", renderCurrentTables));
$("complianceFilter").addEventListener("change", renderCompliance);
$("exportClients").addEventListener("click", exportClients);

onAuthStateChanged(auth, async (user) => {
  state.user = user;
  if (!user) { state.admin = false; $("loginScreen").hidden = false; $("app").hidden = true; return; }
  try {
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (!adminDoc.exists() || adminDoc.data()?.active === false) {
      state.admin = false;
      await signOut(auth);
      $("loginScreen").hidden = false;
      setLoginMessage("This account is not authorized as an administrator. Add its UID to the admins collection using Firebase Console.");
      return;
    }
    state.admin = true;
    $("loginScreen").hidden = true; $("app").hidden = false;
    $("profileEmail").textContent = user.email || "Admin";
    $("profileName").textContent = first(adminDoc.data(), ["displayName","name"], "Administrator");
    $("profileAvatar").textContent = ($("profileName").textContent || "A").trim().charAt(0).toUpperCase();
    $("syncAuth").textContent = "Signed in"; $("syncAdmin").textContent = "Authorized"; $("year").textContent = new Date().getFullYear();
    await loadData(false);
  } catch (err) {
    console.error(err); await signOut(auth);
    $("loginScreen").hidden = false;
    setLoginMessage("Could not verify admin access. Check Firestore rules and the admins/UID document.");
  }
  refreshIcons();
});

function authError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "Email or password is incorrect.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait and try again.";
  if (code.includes("network-request-failed")) return "Network error. Check your internet connection.";
  return err?.message || "Unable to sign in.";
}
async function loadCollection(name) {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function loadData(showMessage) {
  if (!state.user || !state.admin) return;
  setNotice("");
  try {
    const [clients, compliance, credentials, documents] = await Promise.all([
      loadCollection("clients"), loadCollection("compliance"), loadCollection("credentials"), loadCollection("documents")
    ]);
    state.clients = clients; state.compliance = compliance; state.credentials = credentials; state.documents = documents; state.loaded = true;
    const now = new Date();
    $("statClients").textContent = clients.length.toLocaleString("en-IN");
    $("statCompliance").textContent = compliance.length.toLocaleString("en-IN");
    $("statPending").textContent = compliance.filter(c => /pending|progress|unpaid/i.test(norm(first(c,["complianceStatus","status"],"")))).length.toLocaleString("en-IN");
    $("statFolders").textContent = clients.filter(c => driveUrl(c,"client")).length.toLocaleString("en-IN");
    $("clientNavCount").textContent = clients.length; $("complianceNavCount").textContent = compliance.length;
    const stamp = now.toLocaleString("en-IN", { dateStyle:"medium", timeStyle:"short" });
    $("lastUpdated").textContent = `Refreshed ${stamp}`; $("syncRefresh").textContent = stamp;
    $("syncClients").textContent = clients.length; $("syncCompliance").textContent = compliance.length;
    renderCurrentTables();
    if (showMessage) showToast("Data refreshed from Firestore.");
  } catch (err) {
    console.error(err); setNotice(`Could not load all records: ${err.message || err}. Check Firestore rules for this administrator.`);
    if (showMessage) showToast("Refresh failed. See the notice above.");
  }
  refreshIcons();
}
function navigate(view) {
  if (!pageInfo[view]) return;
  state.view = view;
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === `view-${view}`));
  document.querySelectorAll(".side-link[data-view]").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  $("breadcrumbCurrent").textContent = pageInfo[view][1]; $("pageKicker").textContent = pageInfo[view][0]; $("pageTitle").textContent = pageInfo[view][1]; $("pageSubtitle").textContent = pageInfo[view][2];
  closeSidebar(); renderCurrentTables(); refreshIcons();
}
function openSidebar() { $("sidebar").classList.add("open"); $("sidebarOverlay").classList.add("show"); document.body.classList.add("menu-open"); }
function closeSidebar() { $("sidebar").classList.remove("open"); $("sidebarOverlay").classList.remove("show"); document.body.classList.remove("menu-open"); }
function renderCurrentTables() { renderRecent(); renderClients(); renderCompliance(); renderDocuments(); renderCredentials(); refreshIcons(); }
function renderRecent() {
  const rows = [...state.compliance].sort((a,b) => dateMillis(first(b,["updatedAt","complianceDate","dueDate"])) - dateMillis(first(a,["updatedAt","complianceDate","dueDate"]))).slice(0,7);
  if (!rows.length) { $("recentCompliance").innerHTML = `<div class="empty-state">No compliance records found.</div>`; return; }
  $("recentCompliance").innerHTML = `<table class="data-table"><thead><tr><th>Task / client</th><th>Due date</th><th>Status</th></tr></thead><tbody>${rows.map(c=>`<tr><td><div class="primary-cell">${esc(first(c,["complianceName","taskName"],"Compliance task"))}</div><div class="secondary-cell">${esc(first(c,["clientName","clientId"],"—"))} · ${esc(c.id)}</div></td><td>${esc(prettyDate(first(c,["dueDate","DueDate"])))}</td><td>${badge(first(c,["complianceStatus","status"],"Not set"))}</td></tr>`).join("")}</tbody></table>`;
}
function renderClients() {
  const q = norm($("clientSearch").value).toLowerCase();
  const rows = state.clients.filter(c => [c.id,c.clientId,c.clientName,c.legalName,c.personalName,c.clientEmail,c.clientMobile,c.gstin,c.pan].some(v=>norm(v).toLowerCase().includes(q)));
  $("clientsFoot").textContent = `${rows.length} of ${state.clients.length} client records`;
  if (!rows.length) { $("clientsTable").innerHTML = `<div class="empty-state">${state.loaded ? "No matching clients." : "Loading clients…"}</div>`; return; }
  $("clientsTable").innerHTML = `<table class="data-table"><thead><tr><th>Client</th><th>Contact</th><th>Constitution</th><th>Status</th><th>Drive folder</th></tr></thead><tbody>${rows.map(c=>{const url=driveUrl(c,"client");return `<tr><td><div class="primary-cell">${esc(first(c,["clientName","legalName","personalName"],"Unnamed client"))}</div><div class="secondary-cell">${esc(c.id)}${c.gstin?` · GSTIN ${esc(c.gstin)}`:""}</div></td><td><div>${esc(first(c,["clientEmail"],"—"))}</div><div class="secondary-cell">${esc(first(c,["clientMobile"],""))}</div></td><td>${esc(first(c,["constitution"],"—"))}</td><td>${badge(first(c,["clientStatus","status"],"Not set"))}</td><td>${url?`<a class="table-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open folder <i data-lucide="external-link"></i></a>`:"—"}</td></tr>`}).join("")}</tbody></table>`;
}
function renderCompliance() {
  const q = norm($("complianceSearch").value).toLowerCase();
  const filter = $("complianceFilter").value;
  const rows = state.compliance.filter(c => {
    const status = norm(first(c, ["complianceStatus","status"], "")).toLowerCase();
    const due = first(c, ["dueDate","DueDate","complianceDate"], "");
    const overdue = dateMillis(due) > 0 && dateMillis(due) < Date.now() && !/filed|complete/i.test(status);
    const matchesFilter = filter === "all" || (filter === "overdue" ? overdue : status.includes(filter));
    const matchesQuery = [c.id,c.complianceId,c.clientId,c.clientName,c.complianceName,c.CompliancePeriod,c.compliancePeriod,c.period,due,c.complianceStatus].some(v => norm(v).toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  }).sort((a,b) => dateMillis(first(a,["dueDate","DueDate","complianceDate"])) - dateMillis(first(b,["dueDate","DueDate","complianceDate"])));

  $("complianceFoot").textContent = `${rows.length} of ${state.compliance.length} compliance records`;
  if (!rows.length) {
    $("complianceTable").innerHTML = `<div class="empty-state">${state.loaded ? "No matching compliance tasks." : "Loading compliance…"}</div>`;
    return;
  }

  const renderRow = c => {
    const due = first(c, ["dueDate","DueDate","complianceDate"], "");
    const st = first(c, ["complianceStatus","status"], "Not set");
    const payment = first(c, ["paymentStatus"], "Not set");
    const taskName = first(c, ["complianceName","taskName","complianceType"], "Compliance");
    const clientId = first(c, ["clientId"], "");
    const clientName = first(c, ["clientName"], clientId || "—");
    const period = first(c, ["CompliancePeriod","compliancePeriod","period"], "—");
    const fee = first(c, ["complianceFee","fee"], "");
    const url = driveUrl(c, "task");
    const overdue = dateMillis(due) > 0 && dateMillis(due) < Date.now() && !/filed|complete/i.test(norm(st));
    return {c,due,st,payment,taskName,clientId,clientName,period,fee,url,overdue};
  };

  if (window.matchMedia("(max-width: 680px)").matches) {
    $("complianceTable").innerHTML = `<div class="compliance-cards">${rows.map(raw => {
      const x = renderRow(raw);
      return `<article class="compliance-card">
        <div class="compliance-card-head"><div><div class="compliance-card-title">${esc(x.taskName)}</div><div class="secondary-cell">${esc(x.c.id)}${x.clientId ? ` · ${esc(x.clientId)}` : ""}</div></div>${badge(x.st)}</div>
        <div class="compliance-card-client">${esc(x.clientName)}</div>
        <div class="compliance-card-grid">
          <div><span>Period</span><strong>${esc(x.period)}</strong></div>
          <div><span>Due date</span><strong>${x.overdue ? `<em class="overdue-label">Overdue</em> ` : ""}${esc(prettyDate(x.due))}</strong></div>
          <div><span>Fee</span><strong>${esc(formatMoney(x.fee))}</strong></div>
          <div><span>Payment</span><strong>${badge(x.payment)}</strong></div>
        </div>
        ${x.url ? `<a class="cta light compliance-folder-link" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><i data-lucide="folder-open"></i> Open task folder</a>` : `<div class="compliance-folder-missing">No task folder link</div>`}
      </article>`;
    }).join("")}</div>`;
  } else {
    $("complianceTable").innerHTML = `<table class="data-table"><thead><tr><th>Task</th><th>Client</th><th>Period</th><th>Due date</th><th>Fee</th><th>Status</th><th>Payment</th><th>Task folder</th></tr></thead><tbody>${rows.map(raw => {
      const x = renderRow(raw);
      return `<tr><td><div class="primary-cell">${esc(x.taskName)}</div><div class="secondary-cell">${esc(x.c.id)}</div></td><td><div class="primary-cell">${esc(x.clientName)}</div><div class="secondary-cell">${esc(x.clientId)}</div></td><td>${esc(x.period)}</td><td>${x.overdue ? `<span class="status-badge danger">Overdue · ${esc(prettyDate(x.due))}</span>` : esc(prettyDate(x.due))}</td><td>${esc(formatMoney(x.fee))}</td><td>${badge(x.st)}</td><td>${badge(x.payment)}</td><td>${x.url ? `<a class="table-link" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Open <i data-lucide="external-link"></i></a>` : "—"}</td></tr>`;
    }).join("")}</tbody></table>`;
  }
}
function formatMoney(v) { const s=norm(v); if (!s) return "—"; const n=Number(s.replace(/[,₹\s]/g,"")); return Number.isFinite(n) ? n.toLocaleString("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}) : s; }
function renderDocuments() {
  const q=norm($("documentSearch").value).toLowerCase(); const docs=[];
  state.clients.forEach(c=>{const url=driveUrl(c,"client");if(url) docs.push({id:c.id,name:first(c,["clientName","legalName","personalName"],"Client folder"),type:"Client folder",clientId:first(c,["clientId"],c.id),period:"",url});});
  state.compliance.forEach(c=>{const url=driveUrl(c,"task");if(url) docs.push({id:c.id,name:first(c,["complianceName"],"Task folder"),type:"Task folder",clientId:first(c,["clientId"],""),clientName:first(c,["clientName"],""),period:first(c,["CompliancePeriod","compliancePeriod","period"],""),url});});
  state.documents.forEach(d=>{const fileId=first(d,["driveFileId","fileId","id"]);const url=first(d,["webViewLink","driveUrl","fileUrl"],fileId?`https://drive.google.com/open?id=${encodeURIComponent(fileId)}`:"");if(/^https:\/\/(drive\.google\.com|docs\.google\.com)\//i.test(url))docs.push({id:d.id,name:first(d,["name","fileName","title"],d.id),type:first(d,["mimeType","type"],"Drive file"),clientId:first(d,["clientId"],""),period:first(d,["period"],""),url});});
  const rows=docs.filter(d=>[d.id,d.name,d.type,d.clientId,d.clientName,d.period].some(v=>norm(v).toLowerCase().includes(q)));
  if(!rows.length){$("documentsTable").innerHTML=`<div class="empty-state">No Drive folder links or indexed file metadata found. Add Drive file metadata to the Firestore documents collection to list individual files.</div>`;return;}
  $("documentsTable").innerHTML=`<table class="data-table"><thead><tr><th>Folder / document</th><th>Type</th><th>Client ID</th><th>Period</th><th>Location</th></tr></thead><tbody>${rows.map(d=>`<tr><td><div class="primary-cell">${esc(d.name)}</div><div class="secondary-cell">${esc(d.id)}</div></td><td>${badge(d.type,"info")}</td><td>${esc(d.clientId||"—")}</td><td>${esc(d.period||"—")}</td><td><a class="table-link" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">Open Drive <i data-lucide="external-link"></i></a></td></tr>`).join("")}</tbody></table>`;
}
function renderCredentials() {
  const q=norm($("credentialSearch").value).toLowerCase();
  const rows=state.credentials.filter(c=>[c.id,c.credentialId,c.clientId,c.clientName,c.PortalName,c.UserName,c.credentialStatus].some(v=>norm(v).toLowerCase().includes(q)));
  if(!rows.length){$("credentialsTable").innerHTML=`<div class="empty-state">No matching credential records.</div>`;return;}
  $("credentialsTable").innerHTML=`<table class="data-table"><thead><tr><th>Credential ID</th><th>Client</th><th>Portal</th><th>Username</th><th>Password</th><th>Status</th></tr></thead><tbody>${rows.map(c=>`<tr><td class="primary-cell">${esc(c.id)}</td><td><div class="primary-cell">${esc(first(c,["clientName","clientId"],"—"))}</div><div class="secondary-cell">${esc(first(c,["clientId"],""))}</div></td><td>${esc(first(c,["PortalName","portalName"],"—"))}</td><td>${esc(first(c,["UserName","username"],"—"))}</td><td><span class="status-badge danger"><i data-lucide="lock-keyhole"></i> Hidden</span></td><td>${badge(first(c,["credentialStatus","status"],"Not set"))}</td></tr>`).join("")}</tbody></table>`;
}
function exportClients() {
  const q=norm($("clientSearch").value).toLowerCase(); const rows=state.clients.filter(c=>[c.id,c.clientId,c.clientName,c.legalName,c.personalName,c.clientEmail,c.clientMobile,c.gstin,c.pan].some(v=>norm(v).toLowerCase().includes(q)));
  const cols=["id","clientId","clientName","legalName","constitution","clientEmail","clientMobile","clientStatus","pan","gstin","branchName"];
  const csv=[cols.join(","),...rows.map(r=>cols.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\r\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="cm-filings-clients.csv";a.click();URL.revokeObjectURL(url);showToast("Client CSV exported.");
}

refreshIcons();

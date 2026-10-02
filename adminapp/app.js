const state={view:"dashboard",clients:[
{id:"C10001",name:"ABC Traders",mobile:"+91 9876543210",pan:"ABCDE1234F",status:"Active"},
{id:"C10002",name:"Demo Enterprises",mobile:"+91 9123456780",pan:"AAAAA1234A",status:"Active"},
{id:"C10003",name:"Sample Foods",mobile:"+91 9000000000",pan:"BBBBB1234B",status:"Active"}],
payments:[
{id:"PAY-0001",client:"ABC Traders",amount:2500,date:"02-10-2026",status:"Pending"},
{id:"PAY-0002",client:"Demo Enterprises",amount:5000,date:"01-10-2026",status:"Paid"}],
filings:[
{id:"FIL-0001",client:"ABC Traders",type:"GSTR-3B",period:"09-2026",due:"20-10-2026",status:"Pending"},
{id:"FIL-0002",client:"Demo Enterprises",type:"ITR",period:"FY 2025-26",due:"31-12-2026",status:"Completed"}],
compliance:[
{id:"CMP-0001",client:"ABC Traders",item:"GSTR-3B",due:"20-10-2026",status:"Upcoming"},
{id:"CMP-0002",client:"Sample Foods",item:"TDS Return",due:"31-10-2026",status:"Upcoming"}]};

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:2})}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function status(s){let c=s==="Paid"||s==="Completed"||s==="Active"?"success":s==="Pending"||s==="Upcoming"?"warning":"info";return `<span class="badge ${c}">${esc(s)}</span>`}
function shell(title,sub,body){$("#crumb").textContent=title;$("#content").innerHTML=`<div><h1>${title}</h1><div class="muted">${sub}</div></div>${body}`}
function dashboard(){
 shell("Dashboard","CM Filings administration at a glance",`
 <div class="grid stats" style="margin-top:18px">
  <div class="card stat"><div class="label">Total Clients</div><div class="value">${state.clients.length}</div><div class="trend">Active client master</div></div>
  <div class="card stat"><div class="label">Pending Filings</div><div class="value">${state.filings.filter(x=>x.status==="Pending").length}</div><div class="trend">Needs attention</div></div>
  <div class="card stat"><div class="label">Pending Payments</div><div class="value">${money(state.payments.filter(x=>x.status==="Pending").reduce((a,x)=>a+x.amount,0))}</div><div class="trend">Payment follow-up</div></div>
  <div class="card stat"><div class="label">Upcoming Compliance</div><div class="value">${state.compliance.length}</div><div class="trend">Reminder ready</div></div>
 </div>
 <div class="card hero" style="margin-top:14px"><h1>Welcome to CM Filings Admin</h1><div class="muted">Manage clients, filings, payments, reminders and acknowledgements from one place.</div><div class="actions"><button class="btn" style="background:#fff;color:#0B57D0" onclick="go('clients')">Add Client</button><button class="btn" style="background:rgba(255,255,255,.16);color:#fff" onclick="go('payments')">Create Payment</button></div></div>
 <div class="section-head"><div><h2>Quick Actions</h2><div class="muted">Common admin tasks</div></div></div>
 <div class="quick">
  <button onclick="go('payments')"><span>₹</span><b>Payment Request</b></button>
  <button onclick="sendPaymentReminder()"><span>↗</span><b>Payment Reminder</b></button>
  <button onclick="go('compliance')"><span>◷</span><b>Compliance Reminder</b></button>
  <button onclick="go('ack')"><span>✓</span><b>Send ACK</b></button>
 </div>
 <div class="section-head"><div><h2>Recent Activity</h2><div class="muted">Latest records</div></div></div>
 <div class="card table-wrap"><table class="table"><thead><tr><th>Client</th><th>Item</th><th>Date/Due</th><th>Status</th></tr></thead><tbody>
 ${state.filings.slice(0,5).map(x=>`<tr><td>${esc(x.client)}</td><td>${esc(x.type)}</td><td>${esc(x.due)}</td><td>${status(x.status)}</td></tr>`).join("")}</tbody></table></div>`);
}
function clients(){
 shell("Clients","Client master and service relationships",`
 <div class="section-head"><button class="btn primary" onclick="newClient()">+ New Client</button><input id="clientSearch" placeholder="Search clients..." style="max-width:260px;padding:9px;border:1px solid #dfe4ea;border-radius:9px" oninput="renderClientRows()"></div>
 <div class="card table-wrap"><table class="table"><thead><tr><th>Client ID</th><th>Name</th><th>Mobile</th><th>PAN</th><th>Status</th><th>Action</th></tr></thead><tbody id="clientRows"></tbody></table></div>`);
 renderClientRows();
}
function renderClientRows(){const q=($("#clientSearch")?.value||"").toLowerCase();$("#clientRows").innerHTML=state.clients.filter(x=>(x.name+x.id+x.mobile+x.pan).toLowerCase().includes(q)).map(x=>`<tr><td>${esc(x.id)}</td><td><b>${esc(x.name)}</b></td><td>${esc(x.mobile)}</td><td>${esc(x.pan)}</td><td>${status(x.status)}</td><td><button class="btn secondary" onclick="toast('Client opened')">Open</button></td></tr>`).join("")}
function newClient(){shell("New Client","Create a client master record",`<div class="card"><div class="form-grid">
${field("Client ID","C10004","clientId")}${field("Client Name","","clientName")}${field("Mobile","","clientMobile")}${field("PAN","","clientPan")}${field("Email","","clientEmail")}${field("GSTIN","","clientGstin")}
</div><div class="actions"><button class="btn primary" onclick="saveClient()">Save Client</button><button class="btn light" onclick="go('clients')">Cancel</button></div></div>`)}
function field(label,placeholder,id){return `<div class="field"><label>${label}</label><input id="${id}" placeholder="${placeholder}"></div>`}
function saveClient(){const name=$("#clientName").value.trim();if(!name)return toast("Client name is required");state.clients.push({id:$("#clientId").value||"C"+(10000+state.clients.length+1),name,mobile:$("#clientMobile").value,pan:$("#clientPan").value,status:"Active"});toast("Client saved");go("clients")}
function payments(){
 shell("Payments","Transactions, payment requests, links and QR",`
 <div class="grid three" style="margin-top:18px">
  <div class="card stat"><div class="label">Collected</div><div class="value">${money(state.payments.filter(x=>x.status==="Paid").reduce((a,x)=>a+x.amount,0))}</div></div>
  <div class="card stat"><div class="label">Pending</div><div class="value">${money(state.payments.filter(x=>x.status==="Pending").reduce((a,x)=>a+x.amount,0))}</div></div>
  <div class="card stat"><div class="label">Gateway</div><div class="value" style="font-size:18px">Ready</div><div class="trend">Connect securely in Settings</div></div>
 </div>
 <div class="actions" style="margin:15px 0"><button class="btn primary" onclick="paymentRequest()">+ Payment Request</button><button class="btn secondary" onclick="qrTool()">QR Payment</button><button class="btn light" onclick="sendPaymentReminder()">Payment Reminder</button></div>
 <div class="card table-wrap"><table class="table"><thead><tr><th>ID</th><th>Client</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>${state.payments.map(x=>`<tr><td>${x.id}</td><td>${esc(x.client)}</td><td>${money(x.amount)}</td><td>${x.date}</td><td>${status(x.status)}</td><td><button class="btn secondary" onclick="toast('Payment details opened')">Open</button></td></tr>`).join("")}</tbody></table></div>`);
}
function paymentRequest(){shell("Payment Request","Create a payment request or gateway link",`<div class="card"><div class="form-grid">${selectField("Client","clientSel",state.clients.map(x=>x.name))}${field("Amount","2500","payAmount")}${field("Description","ITR Filing","payDesc")}${selectField("Method","payMethod",["Payment Link","UPI QR","Gateway QR"])} </div><div class="actions"><button class="btn primary" onclick="createPayment()">Create Request</button><button class="btn light" onclick="go('payments')">Cancel</button></div></div>`)}
function selectField(label,id,opts){return `<div class="field"><label>${label}</label><select id="${id}">${opts.map(x=>`<option>${esc(x)}</option>`).join("")}</select></div>`}
function createPayment(){const client=$("#clientSel").value,amount=Number($("#payAmount").value||0);state.payments.unshift({id:"PAY-"+String(state.payments.length+1).padStart(4,"0"),client,amount,date:new Date().toLocaleDateString("en-GB"),status:"Pending"});toast("Payment request created");go("payments")}
function filings(){shell("Filings","Track ITR, GST, TDS and other filing work",`<div class="actions" style="margin:16px 0"><button class="btn primary" onclick="toast('New filing form ready')">+ New Filing</button></div><div class="card table-wrap"><table class="table"><thead><tr><th>ID</th><th>Client</th><th>Type</th><th>Period</th><th>Due</th><th>Status</th></tr></thead><tbody>${state.filings.map(x=>`<tr><td>${x.id}</td><td>${esc(x.client)}</td><td>${esc(x.type)}</td><td>${esc(x.period)}</td><td>${x.due}</td><td>${status(x.status)}</td></tr>`).join("")}</tbody></table></div>`)}
function compliance(){shell("Compliance","Due dates and compliance reminders",`<div class="actions" style="margin:16px 0"><button class="btn primary" onclick="sendComplianceReminder()">Send Compliance Reminder</button></div><div class="card table-wrap"><table class="table"><thead><tr><th>Client</th><th>Compliance</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead><tbody>${state.compliance.map(x=>`<tr><td>${esc(x.client)}</td><td>${esc(x.item)}</td><td>${x.due}</td><td>${status(x.status)}</td><td><button class="btn secondary" onclick="sendComplianceReminder()">Send Reminder</button></td></tr>`).join("")}</tbody></table></div>`)}
function ack(){shell("Acknowledgements","Upload and send filing acknowledgements",`<div class="card"><div class="form-grid">${selectField("Client","ackClient",state.clients.map(x=>x.name))}${field("ACK Number","ACK123456","ackNo")}<div class="field"><label>ACK File</label><input type="file" id="ackFile" accept=".pdf,.jpg,.jpeg,.png"></div>${selectField("Send Via","ackVia",["WhatsApp","Email","Both"])}</div><div class="actions"><button class="btn primary" onclick="sendAck()">Upload & Send ACK</button></div></div><div class="section-head"><h2>ACK History</h2></div><div class="card empty">No ACK records in this demo workspace.</div>`)}
function simple(title,sub,icon){shell(title,sub,`<div class="grid three" style="margin-top:18px"><div class="card tool-card"><div class="tool-icon">${icon}</div><h3>${title}</h3><div class="muted" style="margin-top:6px">Module ready for Firebase data connection.</div></div></div>`)}
function tools(){shell("Tools","Business utilities and quick actions",`<div class="grid four" style="margin-top:18px">${[
["₹","QR Generator","Generate UPI / payment QR"],["▤","Invoice Generator","Create invoices and receipts"],["◷","Due Date Tools","Calculate compliance dates"],["✓","Tax Tools","Quick tax and GST utilities"],
].map(x=>`<button class="card tool-card" style="text-align:left" onclick="${x[1].startsWith("QR")?"qrTool()":"toast('Tool opened')"}"><div class="tool-icon">${x[0]}</div><h3>${x[1]}</h3><div class="muted" style="margin-top:6px">${x[2]}</div></button>`).join("")}</div>`)}
function qrTool(){shell("QR Payment","Create a UPI QR payment request",`<div class="card"><div class="form-grid">${field("UPI ID","yourupi@bank","upiId")}${field("Payee Name","CM Filings","upiName")}${field("Amount","2500","upiAmount")}${field("Reference","INV-00001","upiRef")}</div><div class="actions"><button class="btn primary" onclick="generateQR()">Generate QR</button></div><div id="qrResult" style="margin-top:18px"></div></div>`)}
function generateQR(){const u=$("#upiId").value||"example@upi",n=$("#upiName").value||"CM Filings",a=$("#upiAmount").value||"",r=$("#upiRef").value||"PAY";const data=encodeURIComponent(`upi://pay?pa=${u}&pn=${n}&am=${a}&cu=INR&tn=${r}`);$("#qrResult").innerHTML=`<div style="text-align:center;padding:20px;background:#f8fafc;border-radius:12px"><img alt="UPI QR" width="220" height="220" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}"><div class="muted" style="margin-top:10px">Demo QR generator. Connect your preferred gateway/QR provider for production.</div></div>`}
function sendPaymentReminder(){toast("Payment reminder prepared — connect WhatsApp/Email provider in production")}
function sendComplianceReminder(){toast("Compliance reminder prepared — connect WhatsApp/Email provider in production")}
function sendAck(){toast("ACK prepared — connect storage + WhatsApp/Email provider in production")}
function reports(){simple("Reports","Collections, filings, compliance and client reports","▥")}
function company(){simple("Company","Company profile, branches and configuration","▣")}
function invoices(){simple("Invoices","Invoices, proforma invoices and receipts","▤")}
function documents(){simple("Documents","Client documents and filing records","▧")}
function settings(){shell("Settings","Admin, Firebase, payment gateway and communication settings",`<div class="grid two" style="margin-top:18px"><div class="card"><h2>Firebase</h2><div class="muted" style="margin:6px 0 14px">Keep credentials outside source control. Replace placeholders in firebase-config.js when connecting.</div><span class="badge warning">Not connected</span></div><div class="card"><h2>Payment Gateway</h2><div class="muted" style="margin:6px 0 14px">Use a secure server/Cloud Function for secret keys and webhooks.</div><span class="badge warning">Not connected</span></div><div class="card"><h2>WhatsApp / Email</h2><div class="muted" style="margin:6px 0 14px">Configure approved messaging provider for reminders and ACK sending.</div><span class="badge warning">Not connected</span></div><div class="card"><h2>App</h2><div class="muted" style="margin:6px 0 14px">CM Filings Admin • Android-ready Capacitor shell</div><span class="badge success">UI Ready</span></div></div>`)}
function go(v){state.view=v;$$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));({dashboard,clients,company,filings,payments,compliance,ack,invoices,documents,tools,reports,settings}[v]||dashboard)();$("#sidebar").classList.remove("open");window.scrollTo(0,0)}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#today").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
setTimeout(()=>$("#splash").classList.add("hide"),500);go("dashboard");

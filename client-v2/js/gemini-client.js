import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FIREBASE PROJECT CONFIGURATION ---
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "cmb-40001.firebaseapp.com",
  projectId: "cmb-40001",
  storageBucket: "cmb-40001.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global client state for Copilot Context
let currentClientData = null;
let currentCompliances = [];
let confirmationResult = null;

// Initialize Lucide Icons
lucide.createIcons();

// --- DOM REFERENCES ---
const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("app");
const loginMessage = document.getElementById("loginMessage");
const phoneStep = document.getElementById("phoneStep");
const otpStep = document.getElementById("otpStep");
const clientMobileInput = document.getElementById("clientMobile");
const clientOtpInput = document.getElementById("clientOtp");
const copilotModal = document.getElementById("copilotModal");
const copilotMessages = document.getElementById("copilotMessages");
const copilotPromptInput = document.getElementById("copilotPromptInput");

// --- AUTHENTICATION OBSERVER ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginMessage.style.color = "#0A56D1";
    loginMessage.textContent = "Verifying client authorization…";

    const clientsRef = collection(db, "clients");
    let q;

    if (user.phoneNumber) {
      q = query(clientsRef, where("clientMobile", "==", user.phoneNumber));
    } else if (user.email) {
      q = query(clientsRef, where("clientEmail", "==", user.email));
    }

    try {
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        currentClientData = { id: docSnap.id, ...docSnap.data() };
        
        await initializeDashboard(currentClientData);
        loginScreen.hidden = true;
        appScreen.hidden = false;
      } else {
        await signOut(auth);
        showAuthError("Access Restricted: No active client record matches this login.");
      }
    } catch (e) {
      console.error(e);
      showAuthError("Database connection failed. Please retry.");
    }
  } else {
    loginScreen.hidden = false;
    appScreen.hidden = true;
    currentClientData = null;
    currentCompliances = [];
  }
});

// --- GOOGLE SIGN IN ---
document.getElementById("googleSignInBtn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch(err => showAuthError(err.message));
});

// --- PHONE OTP SIGN IN ---
function initRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    });
  }
}

document.getElementById("phoneAuthForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const phone = clientMobileInput.value.trim();
  if (!phone) return;

  const formatted = phone.startsWith("+") ? phone : `+91${phone}`;
  loginMessage.textContent = "Requesting SMS code…";
  initRecaptcha();

  signInWithPhoneNumber(auth, formatted, window.recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      loginMessage.textContent = "";
      phoneStep.hidden = true;
      otpStep.hidden = false;
    })
    .catch(err => {
      console.error(err);
      showAuthError("Failed to deliver SMS. Check number formatting.");
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    });
});

document.getElementById("verifyOtpBtn").addEventListener("click", () => {
  const otp = clientOtpInput.value.trim();
  if (otp.length !== 6) return showAuthError("Enter the full 6-digit code.");

  confirmationResult.confirm(otp).catch(() => showAuthError("Incorrect or expired code."));
});

document.getElementById("changePhoneBtn").addEventListener("click", () => {
  phoneStep.hidden = false;
  otpStep.hidden = true;
  loginMessage.textContent = "";
});

document.getElementById("signOutBtn").addEventListener("click", () => signOut(auth));

function showAuthError(msg) {
  loginMessage.style.color = "#C5221F";
  loginMessage.textContent = msg;
}

// --- DASHBOARD LOADER ---
async function initializeDashboard(client) {
  // Populate Personal Details
  document.getElementById("headerClientName").textContent = client.clientName || "Client";
  document.getElementById("headerClientId").textContent = client.id;
  document.getElementById("welcomeUserTitle").textContent = `Hello, ${client.personalName || client.clientName}.`;

  // Drive Folder Binding
  const driveBtn = document.getElementById("driveFolderLink");
  if (client.documentFolderLink) {
    driveBtn.href = client.documentFolderLink;
  } else {
    driveBtn.style.opacity = "0.45";
    driveBtn.style.pointerEvents = "none";
  }

  // Load Client Compliances
  const compRef = collection(db, "compliance");
  const qComp = query(compRef, where("clientId", "==", client.id));

  try {
    const snap = await getDocs(qComp);
    currentCompliances = [];
    let totalDues = 0;
    let ongoingCount = 0;
    let nextDeadlines = [];

    const container = document.getElementById("complianceContainer");
    container.innerHTML = "";

    snap.forEach(d => {
      const item = { id: d.id, ...d.data() };
      currentCompliances.push(item);

      // Total Dues Calculation
      if (item.paymentStatus === "Pending" || item.paymentStatus === "Unpaid") {
        totalDues += Number(item.complianceFee || 0) + Number(item.complianceGovtFee || 0);
      }

      // Ongoing Task Check
      if (item.complianceStatus !== "Filed" && item.complianceStatus !== "Completed") {
        ongoingCount++;
        if (item.dueDate) nextDeadlines.push(new Date(item.dueDate));
      }

      // Render Item Card
      container.appendChild(createComplianceFeedCard(item));
    });

    if (currentCompliances.length === 0) {
      container.innerHTML = `<div class="loading-state"><span>No active records found under your account.</span></div>`;
    }

    // Refresh KPI metrics
    document.getElementById("statAmountDue").textContent = `₹${totalDues.toLocaleString('en-IN')}`;
    document.getElementById("statOngoingTasks").textContent = ongoingCount;
    document.getElementById("activeTaskBadge").textContent = `${ongoingCount} active`;

    if (nextDeadlines.length > 0) {
      nextDeadlines.sort((a,b) => a - b);
      const nextDate = nextDeadlines[0];
      document.getElementById("statNextCompliance").textContent = nextDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      document.getElementById("statNextSub").textContent = `Target: ${nextDate.getFullYear()}`;
    } else {
      document.getElementById("statNextCompliance").textContent = "All caught up!";
      document.getElementById("statNextSub").textContent = "No urgent deadlines pending";
    }

    lucide.createIcons();
  } catch (err) {
    console.error("Compliance query failure:", err);
  }
}

function createComplianceFeedCard(item) {
  const card = document.createElement("div");
  card.className = "compliance-feed-item";

  let statusClass = "pending";
  if (item.complianceStatus === "Filed" || item.complianceStatus === "Completed") statusClass = "success";

  card.innerHTML = `
    <div class="feed-header">
      <div class="feed-title">
        <strong>${item.complianceName || 'Compliance Task'}</strong>
        <span>Period: ${item.CompliancePeriod || 'General'}</span>
      </div>
      <span class="status-chip ${statusClass}">${item.complianceStatus || 'Pending'}</span>
    </div>
    <div class="feed-meta-row">
      <div class="feed-due-date">
        <i data-lucide="clock"></i>
        <span>Due: ${item.dueDate || 'Flexible'}</span>
      </div>
      <span style="font-weight: 500; color: ${item.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)'}">
        ${item.paymentStatus === 'Paid' ? 'Paid' : 'Fee Pending'}
      </span>
    </div>
  `;
  return card;
}

// --- CM COPILOT (GEMINI AI ASSISTANT LOGIC) ---
const openCopilot = () => { copilotModal.hidden = false; lucide.createIcons(); };
const closeCopilot = () => { copilotModal.hidden = true; };

document.getElementById("openCopilotBtn").addEventListener("click", openCopilot);
document.getElementById("copilotSearchBar").addEventListener("click", openCopilot);
document.getElementById("openAdvisoryChat").addEventListener("click", openCopilot);
document.getElementById("mobileCopilotBtn").addEventListener("click", openCopilot);
document.getElementById("closeCopilotBtn").addEventListener("click", closeCopilot);

// Quick Prompt Chips
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const prompt = chip.getAttribute("data-prompt");
    sendCopilotMessage(prompt);
  });
});

document.getElementById("sendCopilotPromptBtn").addEventListener("click", () => {
  const val = copilotPromptInput.value.trim();
  if (val) {
    sendCopilotMessage(val);
    copilotPromptInput.value = "";
  }
});

copilotPromptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = copilotPromptInput.value.trim();
    if (val) {
      sendCopilotMessage(val);
      copilotPromptInput.value = "";
    }
  }
});

function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-bubble" : "ai-bubble";
  bubble.innerHTML = text;
  copilotMessages.appendChild(bubble);
  copilotMessages.scrollTop = copilotMessages.scrollHeight;
}

function sendCopilotMessage(promptText) {
  appendMessage("user", promptText);

  // Copilot Contextual Logic Engine (Emulating Gemini Response with live data)
  setTimeout(() => {
    let reply = "";
    const lower = promptText.toLowerCase();

    if (lower.includes("pending") || lower.includes("compliance") || lower.includes("task")) {
      const pendingList = currentCompliances.filter(c => c.complianceStatus !== "Filed" && c.complianceStatus !== "Completed");
      if (pendingList.length > 0) {
        reply = `You currently have <strong>${pendingList.length} ongoing compliances</strong>:<br><br>` + 
          pendingList.map(p => `• <strong>${p.complianceName}</strong> (Due: ${p.dueDate || 'N/A'})`).join("<br>");
      } else {
        reply = "Great news! You have no pending compliance deadlines at the moment. All tasks are filed.";
      }
    } else if (lower.includes("fee") || lower.includes("due") || lower.includes("amount") || lower.includes("pay")) {
      const unpaid = currentCompliances.filter(c => c.paymentStatus === "Pending" || c.paymentStatus === "Unpaid");
      let total = 0;
      unpaid.forEach(u => total += (Number(u.complianceFee || 0) + Number(u.complianceGovtFee || 0)));
      reply = `Your total pending amount is <strong>₹${total.toLocaleString('en-IN')}</strong> across ${unpaid.length} tasks. You can reach out to CM Filings directly to clear invoices.`;
    } else if (lower.includes("drive") || lower.includes("upload") || lower.includes("receipt") || lower.includes("bill")) {
      reply = `All your business documents are securely organized in your personal Drive folder. You can upload purchase bills or view acknowledgments directly via your linked folder.`;
    } else {
      reply = `I'm analyzing your account (${currentClientData?.clientName || 'Client'}). For specific questions on tax planning, GST rules, or notices, our advisory team is reviewing your files in sync with the portal.`;
    }

    appendMessage("ai", reply);
  }, 450);
}

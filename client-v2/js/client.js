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

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAY0eJ0iAVxP2tn2RLe7wVNB8Q15Vnjd-g",
  authDomain: "cmb-40001.firebaseapp.com",
  projectId: "cmb-40001",
  storageBucket: "cmb-40001.firebasestorage.app",
  messagingSenderId: "294144253040",
  appId: "1:294144253040:web:852b7c378ee8049f4268b5",
  measurementId: "G-RX05KNR8Y3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DOM ELEMENTS ---
const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("app");
const loginMessage = document.getElementById("loginMessage");

// Phone Auth Elements
const phoneAuthForm = document.getElementById("phoneAuthForm");
const phoneStep = document.getElementById("phoneStep");
const otpStep = document.getElementById("otpStep");
const clientMobileInput = document.getElementById("clientMobile");
const clientOtpInput = document.getElementById("clientOtp");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const changePhoneBtn = document.getElementById("changePhoneBtn");

// Google Auth Elements
const googleSignInBtn = document.getElementById("googleSignInBtn");

// Global state for Phone Auth
let confirmationResult = null;

// Initialize Lucide Icons
lucide.createIcons();

// --- AUTHENTICATION STATE LISTENER ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User logged into Firebase. Now verify they are a registered client.
    loginMessage.textContent = "Verifying client access...";
    
    // Check clients collection by email (Google) or phone number (OTP)
    const clientsRef = collection(db, "clients");
    let q;
    
    if (user.phoneNumber) {
      q = query(clientsRef, where("clientMobile", "==", user.phoneNumber));
    } else if (user.email) {
      q = query(clientsRef, where("clientEmail", "==", user.email));
    }

    try {
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Client found!
        const clientDoc = querySnapshot.docs[0]; // Assuming 1 match
        const clientData = clientDoc.data();
        
        // Setup UI with client details
        setupDashboard(clientDoc.id, clientData);
        
        // Show App, Hide Login
        loginScreen.hidden = true;
        appScreen.hidden = false;
      } else {
        // Logged in, but no matching client document found in Firestore.
        await signOut(auth);
        showError("Unauthorized: This account is not registered as a client.");
      }
    } catch (error) {
      console.error("Firestore Error:", error);
      showError("Error accessing client records.");
    }
  } else {
    // User is logged out
    loginScreen.hidden = false;
    appScreen.hidden = true;
    resetLoginForm();
  }
});

// --- GOOGLE SIGN IN ---
googleSignInBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch((error) => {
    showError("Google Sign-In failed: " + error.message);
  });
});

// --- PHONE AUTHENTICATION (OTP) ---
function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
  }
}

phoneAuthForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const phoneNumber = clientMobileInput.value.trim();
  
  if (!phoneNumber) return;
  
  // Format for Firebase (requires + country code, assuming India +91 if missing)
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
  
  loginMessage.textContent = "Sending OTP...";
  setupRecaptcha();
  
  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, formattedPhone, appVerifier)
    .then((result) => {
      confirmationResult = result;
      loginMessage.textContent = "";
      // Toggle UI to OTP step
      phoneStep.hidden = true;
      otpStep.hidden = false;
    }).catch((error) => {
      console.error(error);
      showError("Failed to send OTP. Check the number or try again.");
      if (window.recaptchaVerifier) {
         window.recaptchaVerifier.clear();
         window.recaptchaVerifier = null;
      }
    });
});

verifyOtpBtn.addEventListener("click", () => {
  const code = clientOtpInput.value.trim();
  if (code.length !== 6) {
    showError("Please enter a valid 6-digit OTP.");
    return;
  }
  
  loginMessage.textContent = "Verifying...";
  
  confirmationResult.confirm(code).catch((error) => {
    showError("Invalid or expired OTP.");
  });
});

changePhoneBtn.addEventListener("click", () => {
  resetLoginForm();
});

document.getElementById("signOut").addEventListener("click", () => {
  signOut(auth);
});

// --- UI HELPERS ---
function showError(msg) {
  loginMessage.style.color = "#BA1A1A"; // M3 Red
  loginMessage.textContent = msg;
}

function resetLoginForm() {
  phoneStep.hidden = false;
  otpStep.hidden = true;
  clientOtpInput.value = "";
  loginMessage.textContent = "";
}

// --- DASHBOARD DATA LOADING ---
async function setupDashboard(docId, clientData) {
  // Populate UI headers
  document.getElementById("sidebarClientName").textContent = clientData.clientName || "Client";
  document.getElementById("sidebarClientId").textContent = `ID: ${docId}`;
  document.getElementById("headerName").textContent = clientData.clientName || "Client";
  document.getElementById("headerContact").textContent = clientData.clientEmail || clientData.clientMobile || "";
  document.getElementById("welcomeTitle").textContent = `Hello, ${clientData.personalName || clientData.clientName.split(' ')[0]}.`;
  
  // Set Drive Link if available
  const driveBtn = document.getElementById("clientDriveFolder");
  if (clientData.documentFolderLink) {
    driveBtn.href = clientData.documentFolderLink;
  } else {
    driveBtn.style.opacity = "0.5";
    driveBtn.style.pointerEvents = "none";
  }

  // Fetch Compliances for this client
  const complianceRef = collection(db, "compliance");
  const q = query(complianceRef, where("clientId", "==", docId));
  
  try {
    const snapshot = await getDocs(q);
    let totalDue = 0;
    let nextDate = null;
    let ongoingCount = 0;
    const tableBody = document.getElementById("complianceTableBody");
    tableBody.innerHTML = "";

    if (snapshot.empty) {
      tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">No ongoing compliances found.</td></tr>`;
    } else {
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Calculate Total Dues (Sum of complianceFee + complianceGovtFee if unpaid)
        if (data.paymentStatus === "Pending" || data.paymentStatus === "Unpaid") {
          const fee = Number(data.complianceFee || 0);
          const govt = Number(data.complianceGovtFee || 0);
          totalDue += (fee + govt);
        }

        // Calculate next compliance date
        if (data.dueDate && data.complianceStatus !== "Filed" && data.complianceStatus !== "Completed") {
          ongoingCount++;
          const dateObj = new Date(data.dueDate);
          if (!nextDate || dateObj < nextDate) {
            nextDate = dateObj;
          }
        }

        // Render Table Row
        const tr = document.createElement("tr");
        
        // Format Status Badge
        let statusClass = "pending";
        if (data.complianceStatus === "Filed" || data.complianceStatus === "Completed") statusClass = "success";
        
        let payClass = data.paymentStatus === "Paid" ? "success" : "pending";

        tr.innerHTML = `
          <td><strong>${data.complianceName || 'Task'}</strong></td>
          <td>${data.CompliancePeriod || '-'}</td>
          <td>${data.dueDate || '-'}</td>
          <td><span class="status-badge ${statusClass}">${data.complianceStatus || 'Pending'}</span></td>
          <td><span class="status-badge ${payClass}">${data.paymentStatus || 'Unpaid'}</span></td>
        `;
        tableBody.appendChild(tr);
      });
    }

    // Update Stat Cards
    document.getElementById("statAmountDue").textContent = `₹${totalDue.toLocaleString('en-IN')}`;
    document.getElementById("statOngoingTasks").textContent = ongoingCount;
    document.getElementById("statNextCompliance").textContent = nextDate ? nextDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "All caught up!";

  } catch (err) {
    console.error("Error loading compliance data:", err);
  }
}

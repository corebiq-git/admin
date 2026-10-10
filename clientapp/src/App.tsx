import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { getBytes, ref } from "firebase/storage";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { auth, db, firebaseConfigured, storage } from "./firebase";
import type { ClientDownload, ClientProfile, ComplianceItem } from "./types";

type AuthMode = "email" | "phone";
type Page = "Overview" | "Compliance" | "Documents";

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

function parseCompliance(value: unknown): ComplianceItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.name !== "string") return [];
    return [{
      name: record.name,
      status: typeof record.status === "string" ? record.status : "Pending",
      dueDate: typeof record.dueDate === "string" ? record.dueDate : undefined,
      details: typeof record.details === "string" ? record.details : undefined,
    }];
  });
}

function parseDownloads(value: unknown): ClientDownload[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.fileName !== "string" || typeof record.storagePath !== "string") return [];
    return [{
      fileName: record.fileName,
      storagePath: record.storagePath,
      category: typeof record.category === "string" ? record.category : undefined,
      uploadedAt: typeof record.uploadedAt === "string" ? record.uploadedAt : undefined,
    }];
  });
}

async function findClient(user: User): Promise<ClientProfile | null> {
  if (!db) throw new Error("Firebase is not configured.");

  const identities: Array<{ field: "clientEmail" | "clientMobile"; value: string }> = [];
  if (user.email) identities.push({ field: "clientEmail", value: user.email.toLowerCase() });
  if (user.phoneNumber) identities.push({ field: "clientMobile", value: normalizePhone(user.phoneNumber) });

  for (const identity of identities) {
    const result = await getDocs(
      query(collection(db, "clients"), where(identity.field, "==", identity.value), limit(2)),
    );
    if (result.size > 1) {
      throw new Error(`More than one client record matches this ${identity.field === "clientEmail" ? "email" : "mobile number"}. Please contact support.`);
    }
    const match = result.docs[0];
    if (match) {
      const data = match.data();
      return {
        id: match.id,
        clientName: typeof data.clientName === "string" ? data.clientName : undefined,
        clientMobile: typeof data.clientMobile === "string" ? data.clientMobile : undefined,
        clientEmail: typeof data.clientEmail === "string" ? data.clientEmail : undefined,
        compliance: parseCompliance(data.compliance),
        downloads: parseDownloads(data.downloads),
      };
    }
  }
  return null;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkingClient, setCheckingClient] = useState(false);
  const [page, setPage] = useState<Page>("Overview");
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const recaptcha = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setClient(null);
        setAuthLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setCheckingClient(true);
    setAuthLoading(true);
    findClient(user)
      .then(async (record) => {
        if (cancelled) return;
        if (!record) {
          setAuthError("We couldn't find a client record for this account. Please use your registered email or mobile number, or request access.");
          await signOut(auth!);
          return;
        }
        setClient(record);
        setAuthError("");
        setAuthLoading(false);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setAuthError(`Unable to verify your client record: ${errorText(error)}`);
          setAuthLoading(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingClient(false);
          setAuthLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => () => recaptcha.current?.clear(), []);

  const completedCount = useMemo(
    () => client?.compliance.filter((item) => /complete|compliant|done/i.test(item.status)).length ?? 0,
    [client],
  );
  const openCount = (client?.compliance.length ?? 0) - completedCount;

  async function finishSignIn(nextUser: User) {
    setUser(nextUser);
    setAuthError("");
  }

  async function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    setBusy(true);
    setAuthError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      await finishSignIn(result.user);
    } catch (error) {
      setAuthError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    setBusy(true);
    setAuthError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await finishSignIn(result.user);
    } catch (error) {
      setAuthError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!auth) return;
    setBusy(true);
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await finishSignIn(result.user);
    } catch (error) {
      setAuthError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    setBusy(true);
    setAuthError("");
    try {
      recaptcha.current ??= new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, normalizePhone(phone), recaptcha.current);
      setConfirmation(result);
      setNotice(`A verification code was sent to ${normalizePhone(phone)}.`);
    } catch (error) {
      setAuthError(errorText(error));
      recaptcha.current?.clear();
      recaptcha.current = null;
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmation) return;
    setBusy(true);
    setAuthError("");
    try {
      const result = await confirmation.confirm(otp.trim());
      await finishSignIn(result.user);
      setConfirmation(null);
      setOtp("");
    } catch (error) {
      setAuthError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function requestAccess(event: FormEvent<HTMLFormElement>): Promise<boolean> {
    event.preventDefault();
    if (!db) return false;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setAuthError("");
    try {
      await addDoc(collection(db, "signupRequests"), {
        name: String(form.get("requestName")).trim(),
        email: String(form.get("requestEmail")).trim().toLowerCase(),
        mobile: normalizePhone(String(form.get("requestMobile"))),
        message: String(form.get("requestMessage")).trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setNotice("Your access request is in. Our team will be in touch shortly.");
      formElement.reset();
      return true;
    } catch (error) {
      setAuthError(`We couldn't send your request: ${errorText(error)}`);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function downloadFile(file: ClientDownload) {
    if (!storage || !client) return;
    setDownloadBusy(file.storagePath);
    setAuthError("");
    try {
      const bytes = await getBytes(ref(storage, file.storagePath));
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setAuthError(`Unable to download ${file.fileName}: ${errorText(error)}`);
    } finally {
      setDownloadBusy("");
    }
  }

  async function logout() {
    if (!auth) return;
    try {
      await signOut(auth);
      setPage("Overview");
      setAuthError("");
    } catch (error) {
      setAuthError(`Unable to sign out: ${errorText(error)}`);
    }
  }

  if (!firebaseConfigured) return <SetupScreen />;
  if (authLoading || checkingClient) return <LoadingScreen />;
  if (!user || !client) {
    return (
      <AuthScreen
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        phone={phone}
        setPhone={setPhone}
        otp={otp}
        setOtp={setOtp}
        confirmation={confirmation}
        resetPhoneVerification={() => { setConfirmation(null); setOtp(""); }}
        authError={authError}
        notice={notice}
        busy={busy}
        sendOtp={sendOtp}
        verifyOtp={verifyOtp}
        handleEmailSignIn={handleEmailSignIn}
        handleCreateAccount={handleCreateAccount}
        handleGoogleSignIn={handleGoogleSignIn}
        requestAccess={requestAccess}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><Sparkles size={19} strokeWidth={2.2} /></span>
          <span>fin<span className="brand-accent">wise</span></span>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}><X size={19} /></button>
        </div>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav className="nav-links" aria-label="Main navigation">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={page === "Overview"} onClick={() => { setPage("Overview"); setMobileMenuOpen(false); }} />
          <NavItem icon={<BadgeCheck size={18} />} label="Compliance" active={page === "Compliance"} onClick={() => { setPage("Compliance"); setMobileMenuOpen(false); }} badge={openCount > 0 ? String(openCount) : undefined} />
          <NavItem icon={<FileText size={18} />} label="Documents" active={page === "Documents"} onClick={() => { setPage("Documents"); setMobileMenuOpen(false); }} />
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><MessageSquareText size={17} /></span>
            <div><strong>Need a hand?</strong><span>We’re just a message away.</span></div>
            <ArrowUpRight size={15} />
          </div>
          <button className="profile-row" onClick={logout}>
            <span className="avatar">{initials(client.clientName, user.email)}</span>
            <span className="profile-copy"><strong>{client.clientName || user.displayName || "Your account"}</strong><span>{user.email || user.phoneNumber}</span></span>
            <LogOut size={17} className="logout-icon" />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-trigger" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div>
          <div className="topbar-right">
            <span className="secure-label"><ShieldCheck size={15} /> Secure portal</span>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <span className="avatar avatar-small">{initials(client.clientName, user.email)}</span>
          </div>
        </header>
        <div className="page-content">
          {authError && <div className="inline-alert"><CircleHelp size={17} /><span>{authError}</span><button aria-label="Dismiss" onClick={() => setAuthError("")}><X size={16} /></button></div>}
          {page === "Overview" && <Overview client={client} completedCount={completedCount} openCount={openCount} setPage={setPage} downloadFile={downloadFile} downloadBusy={downloadBusy} />}
          {page === "Compliance" && <CompliancePage client={client} />}
          {page === "Documents" && <DocumentsPage client={client} downloadFile={downloadFile} downloadBusy={downloadBusy} />}
          <footer className="page-footer"><LockKeyhole size={13} /> Your information is encrypted and only visible to you. <span>·</span> Privacy & security</footer>
        </div>
      </main>
      {mobileMenuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  );
}

function AuthScreen(props: {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  otp: string;
  setOtp: (value: string) => void;
  confirmation: ConfirmationResult | null;
  resetPhoneVerification: () => void;
  authError: string;
  notice: string;
  busy: boolean;
  sendOtp: (event: FormEvent<HTMLFormElement>) => void;
  verifyOtp: (event: FormEvent<HTMLFormElement>) => void;
  handleEmailSignIn: (event: FormEvent<HTMLFormElement>) => void;
  handleCreateAccount: (event: FormEvent<HTMLFormElement>) => void;
  handleGoogleSignIn: () => void;
  requestAccess: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
}) {
  const [requestOpen, setRequestOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<"login" | "signup">("login");
  const submitEmail = accountMode === "login" ? props.handleEmailSignIn : props.handleCreateAccount;
  return (
    <div className="auth-shell">
      <div className="auth-art">
        <div className="auth-brand brand"><span className="brand-mark"><Sparkles size={19} /></span><span>fin<span className="brand-accent">wise</span></span></div>
        <div className="art-content">
          <span className="eyebrow"><Sparkles size={14} /> YOUR FINANCIAL CLARITY, IN ONE PLACE</span>
          <h1>A clearer view<br />of your <span>finances.</span></h1>
          <p>Stay on top of compliance, keep your important documents close, and move forward with confidence.</p>
          <div className="art-preview">
            <div className="preview-head"><span>Compliance overview</span><span className="preview-live"><i /> LIVE</span></div>
            <div className="preview-score"><span className="score-ring"><Check size={23} /></span><div><strong>Looking good</strong><span>Your compliance is on track</span></div><ArrowUpRight size={18} /></div>
            <div className="preview-line"><span /><span /><span /></div>
          </div>
        </div>
        <div className="art-footer"><LockKeyhole size={14} /> Protected with bank-grade security <span>·</span> Built around you</div>
      </div>
      <div className="auth-panel">
        <div className="auth-panel-top"><span className="mobile-brand brand"><span className="brand-mark"><Sparkles size={18} /></span><span>fin<span className="brand-accent">wise</span></span></span><span className="member-label">CLIENT PORTAL <span>↗</span></span></div>
        <div className="auth-card">
          <div className="auth-heading"><div className="auth-badge"><Fingerprint size={21} /></div><span className="eyebrow muted-eyebrow">WELCOME TO YOUR PORTAL</span><h2>Good to see you.</h2><p>Sign in to your client account to pick up where you left off.</p></div>
          <div className="auth-tabs" role="tablist" aria-label="Sign-in method">
            <button role="tab" aria-selected={props.authMode === "email"} className={props.authMode === "email" ? "selected" : ""} onClick={() => props.setAuthMode("email")}><Mail size={16} /> Email</button>
            <button role="tab" aria-selected={props.authMode === "phone"} className={props.authMode === "phone" ? "selected" : ""} onClick={() => props.setAuthMode("phone")}><MessageSquareText size={16} /> Mobile OTP</button>
          </div>
          {props.authMode === "email" ? (
            <>
              <form className="auth-form" onSubmit={submitEmail}>
                {accountMode === "signup" && <p className="form-hint">Create an account using the email registered to your client profile.</p>}
                <label htmlFor="email">Email address</label>
                <div className="input-wrap"><Mail size={17} /><input id="email" type="email" autoComplete="email" placeholder="you@example.com" required value={props.email} onChange={(event) => props.setEmail(event.target.value)} /></div>
                <div className="label-row"><label htmlFor="password">Password</label>{accountMode === "login" && <button className="text-button" type="button" onClick={() => setRequestOpen(true)}>Need access?</button>}</div>
                <div className="input-wrap"><LockKeyhole size={17} /><input id="password" type="password" autoComplete={accountMode === "login" ? "current-password" : "new-password"} minLength={6} placeholder={accountMode === "login" ? "Enter your password" : "At least 6 characters"} required value={props.password} onChange={(event) => props.setPassword(event.target.value)} /></div>
                <button className="primary-button" disabled={props.busy} type="submit">{props.busy ? <LoaderCircle size={17} className="spin" /> : accountMode === "login" ? "Sign in" : "Create account"} <ArrowRight size={17} /></button>
              </form>
              <div className="divider"><span />or continue with<span /></div>
              <button className="google-button" disabled={props.busy} onClick={props.handleGoogleSignIn}><GoogleGlyph /> Continue with Google</button>
              <p className="switch-account">{accountMode === "login" ? "New to the portal?" : "Already registered?"} <button onClick={() => setAccountMode(accountMode === "login" ? "signup" : "login")}>{accountMode === "login" ? "Create an account" : "Sign in"}</button></p>
            </>
          ) : (
            <form className="auth-form phone-form" onSubmit={props.confirmation ? props.verifyOtp : props.sendOtp}>
              {!props.confirmation ? <><label htmlFor="phone">Mobile number</label><div className="input-wrap"><MessageSquareText size={17} /><input id="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required value={props.phone} onChange={(event) => props.setPhone(event.target.value)} /><span className="country-code">Include country code</span></div><p className="form-hint">Use the mobile number on your client profile. We’ll text you a one-time code.</p><button className="primary-button" disabled={props.busy} type="submit">{props.busy ? <LoaderCircle size={17} className="spin" /> : "Send verification code"} <ArrowRight size={17} /></button></> : <><label htmlFor="otp">6-digit verification code</label><div className="input-wrap"><Fingerprint size={17} /><input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="Enter your code" required value={props.otp} onChange={(event) => props.setOtp(event.target.value)} /></div><p className="form-hint">Check your messages for the code sent to {props.phone}.</p><button className="primary-button" disabled={props.busy} type="submit">{props.busy ? <LoaderCircle size={17} className="spin" /> : "Verify & sign in"} <ArrowRight size={17} /></button><button className="text-button resend-button" type="button" onClick={props.resetPhoneVerification}>Use another number</button></>}
            </form>
          )}
          {props.authError && <div className="auth-alert"><CircleHelp size={16} /><span>{props.authError}</span></div>}
          {props.notice && <div className="success-note"><Check size={15} /> {props.notice}</div>}
          <div id="recaptcha-container" />
          <div className="access-note"><LockKeyhole size={14} /> Access is matched to your registered client profile.</div>
        </div>
        <div className="auth-bottom"><button className="text-button" onClick={() => setRequestOpen(true)}>Request client access</button><span>© 2026 Finwise</span></div>
      </div>
      {requestOpen && <Modal title="Request portal access" onClose={() => setRequestOpen(false)}><p className="modal-copy">Share a few details and our team will connect your client account.</p><form className="request-form" onSubmit={async (event) => { if (await props.requestAccess(event)) setRequestOpen(false); }}><label htmlFor="requestName">Full name</label><input id="requestName" name="requestName" required placeholder="Your name" /><label htmlFor="requestEmail">Email address</label><input id="requestEmail" name="requestEmail" type="email" required placeholder="you@example.com" /><label htmlFor="requestMobile">Mobile number</label><input id="requestMobile" name="requestMobile" type="tel" required placeholder="+91 98765 43210" /><label htmlFor="requestMessage">Anything we should know? <span>Optional</span></label><textarea id="requestMessage" name="requestMessage" rows={3} placeholder="Add a note for our team" /><button className="primary-button" disabled={props.busy} type="submit">{props.busy ? <LoaderCircle size={17} className="spin" /> : "Send request"} <ArrowRight size={17} /></button></form></Modal>}
    </div>
  );
}

function Overview({ client, completedCount, openCount, setPage, downloadFile, downloadBusy }: {
  client: ClientProfile; completedCount: number; openCount: number; setPage: (page: Page) => void;
  downloadFile: (file: ClientDownload) => void; downloadBusy: string;
}) {
  const firstName = (client.clientName || "there").trim().split(/\s+/)[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const completion = client.compliance.length ? Math.round(completedCount / client.compliance.length * 100) : 0;
  const latestFiles = [...client.downloads].slice(0, 3);
  const acknowledgement = client.downloads.find((item) => /acknowledg|itr.?v|return/i.test(`${item.category ?? ""} ${item.fileName}`));
  return (
    <>
      <section className="welcome-row"><div><span className="eyebrow muted-eyebrow">YOUR CLIENT SPACE</span><h1>{greeting}, {firstName}<span className="wave">✳</span></h1><p>Your financial picture, all in one calm place.</p></div><button className="outline-button" onClick={() => setPage("Compliance")}><CalendarDays size={16} /> View compliance <ArrowRight size={15} /></button></section>
      <section className="insight-banner"><div className="insight-symbol"><Sparkles size={21} /></div><div className="insight-copy"><span>YOUR COMPLIANCE SNAPSHOT</span><strong>{openCount === 0 ? "You're all caught up." : `${openCount} ${openCount === 1 ? "item needs" : "items need"} your attention.`}</strong><p>{openCount === 0 ? "Everything on your profile is marked complete. Keep your documents close, just in case." : "Take a moment to review what's coming up. Your next step is right below."}</p></div><div className="insight-score"><div className="score-donut" style={{ "--progress": `${completion}%` } as React.CSSProperties}><span>{completion}<small>%</small></span></div><span>On track</span></div><Sparkles className="banner-sparkle" size={86} /></section>
      <section className="stats-grid">
        <StatCard icon={<ShieldCheck size={17} />} label="Compliance items" value={String(client.compliance.length)} meta={`${completedCount} completed`} tone="lavender" />
        <StatCard icon={<Clock3 size={17} />} label="Needs attention" value={String(openCount)} meta={openCount === 0 ? "Nothing due right now" : "Review your checklist"} tone="peach" />
        <StatCard icon={<FileText size={17} />} label="Your documents" value={String(client.downloads.length)} meta="Ready when you need them" tone="mint" />
      </section>
      <div className="content-grid">
        <section className="surface-card compliance-card">
          <div className="section-heading"><div><span className="eyebrow muted-eyebrow">STAY ON TRACK</span><h2>Compliance checklist</h2></div><button className="link-button" onClick={() => setPage("Compliance")}>View all <ArrowRight size={15} /></button></div>
          {client.compliance.length === 0 ? <EmptyState icon={<BadgeCheck size={21} />} title="Your checklist is clear" text="Compliance items linked to your client profile will show up here." /> : <div className="checklist">{client.compliance.slice(0, 4).map((item, index) => <ComplianceRow key={`${item.name}-${index}`} item={item} />)}</div>}
        </section>
        <section className="surface-card documents-card">
          <div className="section-heading"><div><span className="eyebrow muted-eyebrow">YOUR FILES</span><h2>Recent documents</h2></div><button className="icon-button" aria-label="View all documents" onClick={() => setPage("Documents")}><ArrowUpRight size={18} /></button></div>
          {latestFiles.length === 0 ? <EmptyState icon={<FileText size={21} />} title="Your files live here" text="Documents added to your client profile will be ready to download." /> : <div className="file-list">{latestFiles.map((file, index) => <FileRow key={`${file.storagePath}-${index}`} file={file} onDownload={downloadFile} busy={downloadBusy === file.storagePath} />)}</div>}
        </section>
      </div>
      {acknowledgement && <section className="ack-banner"><div className="ack-icon"><FileCheck2 size={20} /></div><div><strong>Your tax filing acknowledgement is ready</strong><span>{acknowledgement.fileName} · Available in your documents</span></div><button className="outline-button small-button" disabled={downloadBusy === acknowledgement.storagePath} onClick={() => downloadFile(acknowledgement)}>{downloadBusy === acknowledgement.storagePath ? <LoaderCircle size={15} className="spin" /> : <ArrowDownToLine size={15} />} Download</button></section>}
    </>
  );
}

function CompliancePage({ client }: { client: ClientProfile }) {
  return <><section className="page-title"><span className="eyebrow muted-eyebrow">YOUR CHECKLIST</span><h1>Compliance</h1><p>A clear view of the filings and requirements on your client profile.</p></section><section className="surface-card full-list-card"><div className="section-heading"><div><span className="eyebrow muted-eyebrow">CLIENT ID</span><h2>{client.id}</h2></div><span className="client-id-pill"><ShieldCheck size={14} /> Verified account</span></div>{client.compliance.length === 0 ? <EmptyState icon={<BadgeCheck size={21} />} title="You're all caught up" text="There are no compliance items on your profile yet." /> : <div className="checklist expanded-checklist">{client.compliance.map((item, index) => <ComplianceRow key={`${item.name}-${index}`} item={item} detailed />)}</div>}</section></>;
}

function DocumentsPage({ client, downloadFile, downloadBusy }: { client: ClientProfile; downloadFile: (file: ClientDownload) => void; downloadBusy: string }) {
  const acknowledgements = client.downloads.filter((file) => /acknowledg|itr.?v|return/i.test(`${file.category ?? ""} ${file.fileName}`));
  const otherFiles = client.downloads.filter((file) => !acknowledgements.includes(file));
  return <><section className="page-title"><span className="eyebrow muted-eyebrow">YOUR PRIVATE FILES</span><h1>Documents</h1><p>Important tax records and data, ready to download securely.</p></section><section className="surface-card full-list-card"><div className="section-heading"><div><span className="eyebrow muted-eyebrow">TAX RECORDS</span><h2>Filing acknowledgements</h2></div><span className="count-pill">{acknowledgements.length} files</span></div>{acknowledgements.length === 0 ? <EmptyState icon={<FileCheck2 size={21} />} title="No acknowledgements yet" text="Your tax-return filing acknowledgements will appear here when they are added to your profile." /> : <div className="file-list expanded-files">{acknowledgements.map((file, index) => <FileRow key={`${file.storagePath}-${index}`} file={file} onDownload={downloadFile} busy={downloadBusy === file.storagePath} />)}</div>}</section><section className="surface-card full-list-card"><div className="section-heading"><div><span className="eyebrow muted-eyebrow">YOUR DATA</span><h2>Other documents</h2></div><span className="count-pill">{otherFiles.length} files</span></div>{otherFiles.length === 0 ? <EmptyState icon={<FileText size={21} />} title="No other documents yet" text="Client data exports and supporting documents will show up here." /> : <div className="file-list expanded-files">{otherFiles.map((file, index) => <FileRow key={`${file.storagePath}-${index}`} file={file} onDownload={downloadFile} busy={downloadBusy === file.storagePath} />)}</div>}</section></>;
}

function ComplianceRow({ item, detailed = false }: { item: ComplianceItem; detailed?: boolean }) {
  const done = /complete|compliant|done/i.test(item.status);
  return <div className="compliance-row"><span className={`status-icon ${done ? "status-done" : "status-pending"}`}>{done ? <Check size={15} /> : <Clock3 size={15} />}</span><div className="compliance-copy"><strong>{item.name}</strong>{detailed && item.details && <p>{item.details}</p>}{item.dueDate && <span>{detailed ? "Due" : ""} {formatDate(item.dueDate)}</span>}</div><span className={`status-chip ${done ? "chip-done" : "chip-pending"}`}>{item.status}</span></div>;
}

function FileRow({ file, onDownload, busy }: { file: ClientDownload; onDownload: (file: ClientDownload) => void; busy: boolean }) {
  return <div className="file-row"><span className="file-icon"><FileText size={17} /></span><div className="file-copy"><strong>{file.fileName}</strong><span>{file.category || "Client document"}{file.uploadedAt ? ` · ${formatDate(file.uploadedAt)}` : ""}</span></div><button className="download-button" disabled={busy} aria-label={`Download ${file.fileName}`} onClick={() => onDownload(file)}>{busy ? <LoaderCircle size={17} className="spin" /> : <ArrowDownToLine size={17} />}</button></div>;
}

function StatCard({ icon, label, value, meta, tone }: { icon: ReactNode; label: string; value: string; meta: string; tone: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}>{icon}</span></div><div className="stat-value">{value}</div><span className="stat-meta">{meta}</span></div>;
}

function NavItem({ icon, label, active, onClick, badge }: { icon: ReactNode; label: string; active: boolean; onClick: () => void; badge?: string }) {
  return <button className={`nav-item ${active ? "nav-active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</button>;
}

function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><strong>{title}</strong><p>{text}</p></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div>{children}</section></div>;
}

function SetupScreen() {
  return <div className="setup-screen"><span className="brand-mark"><Sparkles size={19} /></span><div><span className="eyebrow muted-eyebrow">ALMOST THERE</span><h1>Connect your Firebase project</h1><p>Add the Firebase web app settings to a <code>.env</code> file in the project root. See <code>README.md</code> for the full setup.</p><pre>{`VITE_FIREBASE_API_KEY=your-api-key\nVITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=your-project-id\nVITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com\nVITE_FIREBASE_APP_ID=your-app-id`}</pre></div></div>;
}

function LoadingScreen() {
  return <div className="loading-screen"><span className="brand-mark"><Sparkles size={19} /></span><LoaderCircle size={22} className="spin" /><span>Opening your client space…</span></div>;
}

function GoogleGlyph() {
  return <svg aria-hidden="true" viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6c4.51-4.17 7.07-10.31 7.07-17.65Z" transform="translate(0 -1)" /><path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.95 23.95 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 2)" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -4)" /></svg>;
}

function initials(name?: string, email?: string | null) {
  const source = name || email || "Client";
  return source.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default App;

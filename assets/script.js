
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("#mobileMenu");
  const overlay = document.querySelector("#mobileOverlay");
  const toggle = document.querySelector("#menuToggle");
  const close = () => {
    if (!menu) return;
    menu.classList.remove("open");
    overlay?.classList.remove("show");
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded","false");
    if (toggle) toggle.innerHTML = '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  };
  const open = () => {
    if (!menu) return;
    menu.classList.add("open");
    overlay?.classList.add("show");
    document.body.classList.add("menu-open");
    toggle?.setAttribute("aria-expanded","true");
    if (toggle) toggle.innerHTML = '<i data-lucide="x"></i>';
    window.lucide?.createIcons();
  };
  toggle?.addEventListener("click", () => menu.classList.contains("open") ? close() : open());
  overlay?.addEventListener("click", close);
  document.querySelectorAll(".mobile-link").forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", e => { if(e.key === "Escape") close(); });

  const cookie = document.querySelector("#cookieBanner");
  const accept = document.querySelector("#cookieAccept");
  const reject = document.querySelector("#cookieReject");
  if(cookie && !localStorage.getItem("cm_cookie_choice")) cookie.classList.add("show");
  accept?.addEventListener("click",()=>{localStorage.setItem("cm_cookie_choice","accepted");cookie.classList.remove("show")});
  reject?.addEventListener("click",()=>{localStorage.setItem("cm_cookie_choice","essential");cookie.classList.remove("show")});

  const form = document.querySelector("#enquiryForm");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = [
      "Hello CM Filings,",
      "",
      "I would like to make an enquiry.",
      "",
      `Name: ${fd.get("name") || ""}`,
      `Mobile: ${fd.get("mobile") || ""}`,
      `Email: ${fd.get("email") || ""}`,
      `Service: ${fd.get("service") || ""}`,
      `Requirement: ${fd.get("message") || ""}`,
      "",
      "CM Filings",
      "Tax Experts & Business Innovators",
      "info@cmfilings.com",
      "+91 9946 151 111",
      "+91 9895 470 148",
      "Shakthi Complex, Mahe, Kannur District, Kerala 670672"
    ].join("\n");
    const subject = `CM Filings enquiry — ${fd.get("service") || "General enquiry"}`;
    window.location.href = `mailto:info@cmfilings.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  window.lucide?.createIcons();
});

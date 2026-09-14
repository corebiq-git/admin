# CM Filings — Gemini-style Responsive Website Kit

Static, responsive website kit with:
- Home
- Services hub
- 6 service pages
- Solutions
- About
- Contact + mailto enquiry
- FAQ
- Privacy Policy
- Terms of Use
- Cookie Policy
- 404 page
- Responsive mobile navigation with solid drawer + overlay
- Lucide icons
- SVG logo + favicon
- Web manifest
- robots.txt
- sitemap.xml
- JSON-LD Organization/WebSite schema
- Accessible skip link, focus states and reduced-motion support

## Structure

index.html
services.html
solutions.html
about.html
contact.html
faq.html
privacy.html
terms.html
cookies.html
404.html
services/*.html
assets/logo.svg
assets/favicon.svg
assets/styles.css
assets/script.js
site.webmanifest
robots.txt
sitemap.xml

## Important production notes

1. Replace placeholder legal wording with the final reviewed legal/privacy text before launch.
2. If analytics, CRM, payments, appointment booking or other third-party services are connected, update privacy/cookie disclosures and consent logic.
3. Replace the sample SVG favicon/logo with the final approved brand assets if required.
4. Update canonical URLs if the final deployment uses a different domain/path.
5. The contact form currently opens the user's email client; connect it to a secure backend/API later if you want server-side enquiry capture.

# CM Filings Admin

A responsive CM Filings compliance-management web app starter with a light-grey ERP canvas and `#B10000` primary brand.

## Included modules

- Dashboard
- Client Master with full client form
- Compliance Management
- Per-compliance status and fee
- Invoice creation and print
- Payment requests and payment status
- Compliance calendar
- Document vault UI
- Credentials vault UI
- Reminders
- Settings
- PWA manifest + service worker
- Mobile navigation
- LocalStorage data engine for immediate testing

## Run

The app is static and can be hosted on GitHub Pages, Hostinger, Firebase Hosting, Netlify, etc.

For local testing, use any static HTTP server rather than opening `index.html` directly.

Example:

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080`

## Important production upgrades

The included LocalStorage engine is intentionally usable for UI and workflow testing. Before using real client/tax data:

1. Connect Firebase Authentication.
2. Connect Firestore with strict security rules.
3. Move document files to Firebase Storage.
4. Never use LocalStorage for real credentials or confidential tax documents.
5. Add server-side/audited payment verification.
6. Connect WhatsApp/email/SMS providers.
7. Add role-based access control.
8. Add audit logs.
9. Configure backups and retention.
10. Replace demo invoice/payment flows with your actual gateway/UPI implementation.

The current forms and module relationships are designed so the data layer can be replaced without rebuilding the UI.

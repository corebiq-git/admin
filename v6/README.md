# Voyage Travel Management

Responsive, Gemini Material 3-inspired travel management app for Dubai and India branches, with Firebase Email/Password authentication and Cloud Firestore integration configured for the supplied Firebase project.

## Run locally

This project uses JavaScript ES modules and Firebase's hosted SDK, so serve it through HTTP/HTTPS rather than opening `index.html` with `file://`.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` and ensure `localhost` is an authorized Firebase Authentication domain.

## Modules

Dashboard, bookings, flights, hotels, visa management, transport, customers, travellers, suppliers, invoices, payments, expenses, employees, reports and settings.

## Authentication and roles

- Email/Password sign-in; anonymous authentication is not used.
- Self-registration creates a `pending` account. An administrator must approve it in Firestore.
- Example rules provide `admin`, `branchManager`, `agent`, `finance` and `readOnly` roles with branch restrictions.
- The first admin must be bootstrapped in the Firebase Console. Follow `FIREBASE_SETUP.md` before use.

## Connected workflows

- Dropdowns link records using stable document IDs.
- Customers link to travellers, bookings and invoices.
- Travellers link to bookings and visa applications.
- Bookings link to flights, hotels, transport, invoices and expenses.
- Invoices link to payments.
- Suppliers link to transport and expenses.
- Branch-wise filtering is available for Dubai and India.
- CSV exports are available for modules.

## Important

The app connects to the exact Firebase project supplied by the user (`corebic--inspirego`). If that project is shared with other apps, review the collections and security rules carefully. Configure and test the rules before entering real customer, passport or financial data. AED and INR remain separate currencies in reports unless an approved exchange rate is applied.

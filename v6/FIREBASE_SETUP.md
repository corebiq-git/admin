# Voyage Travel Management — Firebase setup

This build is configured with the Firebase web-app IDs supplied in the conversation:

- Project ID: `corebic--inspirego`
- Authentication: Email/Password (no anonymous sign-in)
- Database: Cloud Firestore

**Important:** the supplied project ID appears to be named for CoreBIQ/InspireGo. This app will use that exact project because you explicitly asked to use the supplied IDs. If it is also used by other applications, keep their data in separate collections and review the security rules before deploying.

## 1. Enable Firebase services

1. Open the Firebase Console and select project `corebic--inspirego`.
2. In **Build → Authentication → Sign-in method**, enable **Email/Password**.
3. In **Build → Firestore Database**, create a database if one does not already exist.
4. In **Authentication → Settings → Authorized domains**, add the production domain where Voyage will be hosted, plus `localhost` for local development if needed.
5. Publish the rules from `firestore.rules.example` under **Firestore Database → Rules** after reviewing them for your exact company roles.

## 2. Create the first administrator

1. Run/deploy the app over HTTPS (or use a local web server for testing). Do not open `index.html` using `file://`.
2. Use **Need an account? Create one** to register the first account.
3. After signup, the account is deliberately marked `pending` and cannot view business data yet.
4. In Firebase Console, open **Firestore Database → Data → users → [the new account UID]**.
5. Change `role` from `pending` to `admin`. For the admin, set `branchId` to `BOTH` (or leave it as `INDIA`; admins can access both branches regardless).
6. Reload the app and sign in. This console promotion is the bootstrap step; do not let users self-assign the admin role.

The UID is shown in the “Access awaiting approval” screen. Do not promote a user unless you have verified that account belongs to the authorised administrator.

## 3. Add branch staff

Staff can create an account from the app, but new accounts remain pending. An admin must open `/users/{uid}` in Firestore and change:

- `role`: one of `branchManager`, `agent`, `finance`, or `readOnly`
- `branchId`: `DUBAI` or `INDIA`

Roles enforced by the example rules:

- `admin`: all records and both branches; can delete business records and manage user profiles.
- `branchManager`: read/write records for their assigned branch; no delete permission in the example rules.
- `agent`: read/write non-finance records for their assigned branch.
- `finance`: read all records in their assigned branch and write invoices, payments and expenses.
- `readOnly`: read-only access to records in their assigned branch.

The UI branch selector is locked to the assigned branch for non-admin users. Firestore rules—not the UI—enforce the access boundary.

## 4. Data behaviour

- Firebase mode loads records from Firestore collections named after the app modules. It does not upload demo seed records automatically.
- Each record must include `branchId` (`DUBAI`, `INDIA`, or, where appropriate, `BOTH`). The app's forms include branch selection.
- Dropdown links store related document IDs. Keep linked records consistent when editing/deleting data.
- Firestore rules restrict deletion of business records to admins. Review/adjust rules only after testing with Firebase Emulator Suite.
- Never store payment card data or passport scans in these records. If document uploads are later added, secure Cloud Storage separately.

## 5. Currency/reporting note

AED and INR are kept as separate original currencies. Consolidated reports must not add AED and INR as if they were the same currency. Add a controlled exchange-rate source, effective date and accounting policy before producing converted financial reports.

## 6. Deployment and safety checklist

- Use HTTPS hosting.
- Enable Firebase App Check when appropriate.
- Test each role with test accounts and the Firebase Emulator Suite.
- Configure backups, audit logging and recovery procedures.
- Use Cloud Functions or a trusted backend for transaction-safe invoice numbering, privileged operations, payment webhooks and audit events.
- The web config is intended for client apps; never put service-account JSON or private keys in this project.

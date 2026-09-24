# CM Comply — Client PWA

## Purpose
Client-facing portal for CM Filings:
- Compliance tracking
- Payment initiation
- Document uploading
- Acknowledgement downloads
- Compliance calendar
- Client profile

## Client identity
Every client is represented by a stable client ID such as `C40001`.
The portal stores the active client ID in the authenticated session and every Firestore query is expected to be scoped to that ID.

## Suggested Firestore model

`clients/{C40001}`
```json
{
  "clientId": "C40001",
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+919946151111",
  "status": "active"
}
```

`compliance/{autoId}`
```json
{
  "clientId": "C40001",
  "name": "GSTR-3B",
  "period": "Aug 2026",
  "dueDate": "2026-09-20",
  "status": "Pending"
}
```

`payments/{autoId}`
```json
{
  "clientId": "C40001",
  "service": "GST Return",
  "amount": 1500,
  "status": "Pending",
  "createdAt": "server timestamp"
}
```

`documents/{autoId}`
```json
{
  "clientId": "C40001",
  "name": "Sales Register",
  "storagePath": "clients/C40001/documents/...",
  "uploadedAt": "server timestamp"
}
```

`acknowledgements/{autoId}`
```json
{
  "clientId": "C40001",
  "title": "GSTR-3B Acknowledgement",
  "period": "Aug 2026",
  "fileUrl": "...",
  "createdAt": "server timestamp"
}
```

## Authentication
- Email: Firebase Email/Password after checking the client record.
- Mobile: Firebase Phone OTP after checking the client record.
- The client-record lookup is NOT a security boundary. Firestore Security Rules must require authenticated access and enforce `clientId == request.auth.token...` or an equivalent server-controlled claim/mapping.

## Setup
1. Create a Firebase Web App.
2. Put its config into `assets/firebase-config.js`.
3. Enable Email/Password and Phone providers in Firebase Authentication.
4. Add the client records to Firestore.
5. Configure Firestore rules and Firebase Storage rules before production.
6. Deploy this folder to Firebase Hosting, Cloudflare Pages, GitHub Pages, or another HTTPS host.
7. Add the deployed domain to Firebase Authentication authorized domains.

## Important production recommendation
For a stronger identity model, create a server-side mapping from Firebase UID to client ID (custom claims or a protected `userClients/{uid}` document). Do not authorize data merely because the browser submitted `C40001`.

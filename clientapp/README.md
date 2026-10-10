# Finwise client portal

A React + TypeScript client portal with Firebase email/password, Google, and SMS OTP sign-in; client-record matching; compliance summaries; and private document downloads.

## Run locally

1. Create a Firebase project and register a Web app.
2. Copy `.env.example` to `.env` and fill in the Web app values from Firebase project settings.
3. In Firebase Authentication, enable **Email/Password**, **Phone**, and **Google** sign-in. Add your development and production hostnames to Authorized domains. Configure an SMS region policy and test phone numbers in the Firebase console as appropriate.
4. Create a Cloud Firestore database and Firebase Storage bucket. Deploy `firestore.rules` and `storage.rules` from this project.
5. Install and start the app:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

The SMS sign-in view uses Firebase's invisible reCAPTCHA verifier. Phone numbers must be stored on client records in E.164 format (for example, `+919876543210`).

## Firestore client records

Create one `clients/{clientId}` document per client. The document ID is the client ID shown in the portal. For example:

```json
{
  "clientName": "Aarav Mehta",
  "clientEmail": "aarav@example.com",
  "clientMobile": "+919876543210",
  "compliance": [
    {
      "name": "Income tax return",
      "status": "Pending",
      "dueDate": "2026-07-31",
      "details": "Review and submit your return."
    }
  ],
  "downloads": [
    {
      "fileName": "ITR-V-acknowledgement.pdf",
      "category": "Tax filing acknowledgement",
      "storagePath": "clients/CLIENT_ID/ITR-V-acknowledgement.pdf",
      "uploadedAt": "2026-10-10"
    },
    {
      "fileName": "client-data.xlsx",
      "category": "Client data",
      "storagePath": "clients/CLIENT_ID/client-data.xlsx"
    }
  ]
}
```

`clientEmail` must be lowercase and `clientMobile` must match the verified Firebase phone number. Each file's `storagePath` must point inside `clients/{clientId}/` in Firebase Storage. The app downloads files with an authenticated Storage SDK request; it does not expose public download URLs.

The security rules allow a signed-in user to read only client documents matching their Firebase email or verified phone number. Client records and files are read-only to portal users. Access requests are written to `signupRequests` and are not readable from the client app.

## Build

```powershell
npm.cmd run build
```

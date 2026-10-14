# CM Filings Admin App

Responsive Firebase admin workspace using the supplied CM Filings / CoreBIQ red-gradient CSS direction.

## Included
- Email/password Firebase Authentication.
- Admin authorization through `admins/{Firebase Auth UID}`.
- Overview dashboard with client/compliance counts and recent tasks.
- Client directory with search and CSV export.
- Compliance register with search/status filter and Drive task-folder links.
- Drive folder index derived from `documentFolderUrl` and `taskFolderLink` stored on synced records.
- Credentials inventory with passwords masked in the UI.
- Sync-status page describing the separate Google Apps Script process.
- Responsive mobile sidebar and Lucide icons.

## Deploy
1. Upload this folder to your GitHub repository or static hosting. Do not open `index.html` with `file://`; use localhost or HTTPS.
2. Firebase config is in `js/app.js` and currently points to project `cmb-40001`.
3. Enable Email/Password sign-in in Firebase Authentication.
4. Create the administrator user in Firebase Authentication.
5. Copy that user's Auth UID. In Firestore, create `admins/{UID}` with fields such as `{ "active": true, "displayName": "CM Filings Admin" }`.
6. Apply and review `firestore.rules` from this package. Test client accounts and admin accounts separately before production.

## Critical security notes
- Never grant public read access to Firestore.
- `credentials` is only queried after an administrator is authorized, and the UI never renders password values. However, Firestore reads return all fields of each credential document to the authorized admin browser. For stronger secret handling, move passwords out of the client-readable collection into a trusted server/secret store and sync only metadata to `credentials`.
- Firestore document access does not grant Google Drive access. Drive folders/files must retain appropriate Drive permissions. Do not make private files public to make links work.
- This UI is a reader for the synced data; it does not run the Apps Script sync. Keep your time-driven trigger configured in Apps Script and review execution logs.
- The supplied sheet schema uses fields such as `clientId`, `complianceId`, `complianceName`, `CompliancePeriod`, `complianceFee`, `complianceStatus`, `taskFolderLink`, `documentFolderUrl`, `credentialId`, `PortalName`, and `UserName`. Rendering tolerates a few common aliases.

## Updated mobile/auth handling
- Explicit `[hidden]` CSS guard prevents the login panel remaining visible after successful sign-in.
- Compliance renders as compact cards on screens up to 680px, and as a table on wider screens.
- Date display accepts ISO, dd-MMM-yyyy and dd-MM-yyyy values.
- Drive link mapping also checks the `documentFolder` field when it contains a valid Drive URL.

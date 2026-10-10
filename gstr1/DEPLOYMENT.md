# COREBIQ GSTR1 TOOL deployment

The existing GSTR return processing remains on the Node server. GitHub Pages cannot run this backend; connect the GitHub repository to Render (or another Node host with persistent disk support) to deploy it.
Use Node.js 22 or later.

## Firebase setup

1. The Firebase Web app config for project `hexa-5d208` is already connected in `public/firebase-config.js`.
2. In the Firebase console for `hexa-5d208`, enable **Authentication → Sign-in method → Email/Password**.
3. Create a Firebase service account and store its JSON securely as the Render environment variable `FIREBASE_SERVICE_ACCOUNT_JSON`. Never commit that JSON file. The Blueprint sets `FIREBASE_PROJECT_ID` to `hexa-5d208`.
4. The Firebase web config and API key are public identifiers, not server credentials. Restrict the API key to the deployed website's HTTP referrers and required Firebase APIs in Google Cloud Console.

## Deploy from GitHub

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint from that repository and apply `render.yaml`.
3. Provide `FIREBASE_SERVICE_ACCOUNT_JSON` when Render requests the secret value.
4. In Firebase Authentication's authorized domains, add the Render service domain.

The Render disk stores generated and working files below `/var/data/corebiq`, separated by Firebase user ID. Authenticated requests must carry a valid Firebase ID token. The health check and public static application assets do not expose taxpayer files.

The old offline data under `public/userData` is not migrated automatically; it remains in place and is not served as public content. Export and import existing returns using the tool's supported workflows after signing in.

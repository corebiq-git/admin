# COREBIQ GSTR1 TOOL deployment

The existing GSTR return processing remains on the Node server. GitHub Pages cannot run this backend; connect the GitHub repository to Render (or another Node host with persistent disk support) to deploy it.
Use Node.js 22 or later.

## Firebase setup

1. The Firebase Web app config for project `hexa-5d208` is already connected in `public/firebase-config.js`.
2. In the Firebase console for `hexa-5d208`, enable **Authentication → Sign-in method → Email/Password**.
3. Create a Firebase service account and store its JSON securely as the Render environment variable `FIREBASE_SERVICE_ACCOUNT_JSON`. Never commit that JSON file. The Blueprint sets `FIREBASE_PROJECT_ID` to `hexa-5d208`.
4. The Firebase web config and API key are public identifiers, not server credentials. Restrict the API key to the deployed website's HTTP referrers and required Firebase APIs in Google Cloud Console.

## Deploy from GitHub

1. Install Git for Windows if `git --version` is not recognized, then open a new terminal.
2. Create an empty GitHub repository and, from this project folder, run:

   ```powershell
   git init
   git branch -M main
   git add -A
   git status --short
   ```

   Review the staged files before committing. Do not force-add ignored files: local taxpayer files, uploads/downloads, spreadsheets, logs, and secrets must stay out of Git. Then run:

   ```powershell
   git commit -m "Prepare COREBIQ GSTR1 web deployment"
   git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. In Render, create a Blueprint from that repository and set the Blueprint file path to `gstr1/render.yaml`. The Blueprint sets the service root to `gstr1`. With `autoDeployTrigger: commit`, later pushes to the linked branch trigger a deployment.
4. Provide `FIREBASE_SERVICE_ACCOUNT_JSON` when Render requests the secret value.
5. Configure the reverse proxy for `/gstr1/*` to forward to the Render service **with the `/gstr1` path preserved**. Do not strip the prefix. The Blueprint sets `BASE_PATH=/gstr1`; the Node app serves the page, assets, and API below that path.
6. In Firebase Authentication's authorized domains, add `admin.corebiq.com`.

The Render disk stores generated and working files below `/var/data/corebiq`, separated by Firebase user ID. Authenticated requests must carry a valid Firebase ID token. The Render health check is at `/health`; the public site health check through the proxy is `/gstr1/health`. Static application assets are served below `/gstr1` and do not expose taxpayer files.

The old offline data under `public/userData` is not migrated automatically; it remains in place and is not served as public content. Export and import existing returns using the tool's supported workflows after signing in.

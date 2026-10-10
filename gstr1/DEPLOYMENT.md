# COREBIQ GSTR-1 local web app

The first online version is a browser-local GSTR-1 B2B invoice tool. It saves returns in IndexedDB in the current browser on the current device, exports a GSTR-1 JSON file, and can be installed as a mobile web app when served over HTTPS. It does not use Firebase, Firestore, or server-side return storage. Other return sections, imports, and the legacy API workflows are not included in this first version.

## Deploy

The Express app serves the tool and its static assets. Use Node.js 22 or later. On Render, create a Blueprint from the repository and set the Blueprint file path to `gstr1/render.yaml`. The Blueprint root directory is `gstr1`. No Firebase service account or persistent server disk is required.

The public URL `https://admin.corebiq.com/gstr1/` must be routed by the `admin.corebiq.com` website host or reverse proxy to this Node service, preserving the `/gstr1` path prefix. A GitHub push alone does not configure that routing. If the URL still shows the CM Filings 404 page, ask the domain/site administrator to configure the route; this cannot be fixed from the app repository.

## Local data and privacy

- Return data is written to the browser's IndexedDB and is not sent to the app server.
- Data is isolated to each browser/device and does not sync between devices.
- Browser storage may be deleted by browser settings or device cleanup. Export JSON backups and store them securely.
- Static app resources are downloaded from the app host. The service worker caches only the app shell/resources, not return data.
- Server-side return API routes are disabled and return `410 Gone`.

The exported JSON contains B2B invoices only. Review and validate the return in the GST portal before filing.

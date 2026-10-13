GSTR-1 JSON Studio — Mobile-responsive browser app

FILES
- index.html: app shell
- styles.css: responsive mobile/desktop styling
- app.js: workbook parsing, summaries, validation and JSON generation
- manifest.json and sw.js: basic PWA installation/offline shell support

RUN LOCALLY
1. Extract the ZIP.
2. Open index.html in a modern browser. Excel parsing uses the SheetJS CDN, so the first load requires internet access.
3. Tap Import Excel and choose GSTR1_Excel_Workbook_Template_V2.2.xlsx.
4. Review Overview, Sheet data, Validation and JSON preview.
5. Tap Save .json to save the generated payload.

HOSTING
Upload the contents of this folder to GitHub Pages, Hostinger static hosting, or another static web host. PWA service worker installation requires HTTPS or localhost.

DATA RULES
- The app includes supported worksheets only when they are visible in the uploaded workbook: b2b,sez,de; b2cs; cdnr; exp; exemp; hsn(b2b); docs; eco.
- Hidden worksheets and Dashboard, README, and Help sheets are excluded.
- Workbook data is processed in the browser; it is not uploaded to a server by this app.
- The JSON schema mapping follows the mapping in the supplied Canvas script. Please verify all generated JSON with the currently approved GST offline utility before filing. It is a draft generator, not an official GST validation service.

# COREBIQ GSTR-1 local web app

This is a no-login GSTR-1 web app. Its entry point is `public/index.html`; Express serves the static app and does not process or store tax returns.

## Enabled sections and spreadsheets

The app supports B2B invoices, B2C small, exempt/nil-rated/non-GST supplies, credit/debit notes for unregistered recipients, e-commerce supplies, e-commerce operator supplies, document ranges, and the B2B HSN summary.

- Download the Excel template from inside the app. It is generated in the browser and uses the official GSTR-1 section column headings.
- Import a GSTN GSTR-1 `.xlsx`, `.xls`, or `.ods` workbook (up to 20 MB). Rows from supported section sheets are validated and imported; disabled sections are ignored.
- To paste one section, open that section, copy its header row and data rows from Excel, and paste them into the section's paste box.
- Imports merge with existing entries. Exact duplicates are skipped. Review the added/skipped counts and validate the exported JSON in the GST portal before filing.

Spreadsheet parsing, template generation, and return storage happen in the browser. The workbook is not uploaded to the server. Browser storage is separate on each device and may be erased by browser cleanup, so keep a secure JSON backup.

## Deploy

Use Node.js 22 or later. On Render, create a Blueprint from the repository and set the Blueprint file path to `gstr1/render.yaml`. The service serves `index.html` at its configured base path. No Firebase credentials, authentication, database, or persistent server disk are needed.

For `https://admin.corebiq.com/gstr1/`, the domain host or reverse proxy must route `/gstr1/` to this service while preserving the path prefix. A GitHub push alone does not configure the domain route.

The server responds `410 Gone` to non-GET/HEAD requests and does not expose return-data APIs.

# Module map

All module views are generated from `js/data.js` field definitions and rendered by `js/app.js`.

To add a simple CRUD module:
1. Add its field definition to `moduleConfig` in `js/data.js`.
2. Add a navigation button in `index.html` using `data-page="yourCollection"`.
3. Add its collection to the `collections` list automatically by ensuring it is part of `moduleConfig`.
4. Add a seed array to `seedData` if sample data is desired.
5. For linked dropdowns, use a field definition such as:
   `{ key: "bookingId", label: "Booking", type: "select", source: "bookings", display: "bookingNo" }`
6. Review branch scoping and reports whenever adding financial fields.

This scaffold uses a single-page shell and shared collection store; modules do not need their own independent HTML files.

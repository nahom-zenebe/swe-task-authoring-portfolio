## Implement barcode and QR-code product identification

Add a fast product-identification workflow to the inventory product module.
Products must have a unique barcode/SKU that can be looked up from stock
receiving and sales screens. Use browser-native scanning support where it is
available and keep manual lookup available on browsers or devices without a
camera.

Do not introduce a scanning package or require a live camera, database, or
external service in the acceptance test.

### Backend

- Add an optional, trimmed `barcode` string to `Productmodel.js`. It must be
  unique for non-empty values while preserving compatibility with existing
  products that do not yet have a code.
- When creating a product, accept a supplied barcode or generate a stable
  non-empty code when one is omitted. Reject a barcode already assigned to a
  different product with a clear `409` response.
- Add an authenticated `GET /lookup/:code` product route. It must return the
  matching product (with its category populated) and return `404` with a
  useful message for an unknown code.
- Keep existing product CRUD routes and response behavior intact.

### Frontend

- Add a Redux thunk that calls the authenticated lookup endpoint.
- Add a product-identification panel to `Productpage.jsx` with a manual code
  input and a lookup action.
- Attempt camera scanning with the browser `BarcodeDetector` API when it is
  available, accepting barcode and QR-code formats. Stop the stream after a
  successful scan or when the panel is closed.
- Display a clear fallback message and keep manual lookup usable when camera
  access is denied, unavailable, or unsupported.
- Show the resolved product or an actionable unknown-code error.

Relevant areas:

- `backend/models/Productmodel.js`
- `backend/Routers/ProductRouter.js`
- `backend/controller/productController.js`
- `frontend/src/features/productSlice.js`
- `frontend/src/pages/Productpage.jsx`

Run the dependency-free acceptance test from this directory with:

```bash
node tests/test_barcode.js
```

Acceptance criteria:

- Product barcodes are trimmed and unique when present, without invalidating
  legacy products with no barcode.
- Product creation assigns a barcode when omitted and rejects duplicates with
  status `409`.
- Authenticated `GET /lookup/:code` returns the populated product or a useful
  `404` response.
- The frontend exposes both manual lookup and camera scanning.
- Camera failure or unsupported browser behavior does not disable manual lookup.
- A successful scan populates the lookup flow and displays the matching product.

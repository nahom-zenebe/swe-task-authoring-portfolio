## Implement supplier management

Fix and complete the supplier management module so that businesses can maintain
supplier records and associate inventory products with their suppliers safely.

The existing `Supplier` model, controller, router, Redux slice, and page
component all have defects that must be corrected. Use the existing schema and
route conventions; do not introduce new dependencies.

### Model

Change `productsSupplied` from a single `ObjectId` reference to an **array** of
`ObjectId` references so that one supplier can be linked to multiple products:

```js
productsSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
```

### Routes

- Move the `GET /searchSupplier` route **before** the `GET /:supplierId`
  parameterised route so that the search path is not swallowed by the ID
  handler.
- Add `authmiddleware` to every supplier route (create, get-all, get-by-id,
  search, update, delete).

### Controller

- In `createSupplier`, validate that every ID in `productsSupplied` exists in
  the Product collection before saving. Return a `400` with a clear message
  listing the unknown IDs if any are not found.
- Keep all other controller behaviour (CRUD, search, populate) intact.

### Frontend slice

Fix the `deleteSupplier` thunk action type from `'supplier/'` to
`'supplier/deleteSupplier'` so that the fulfilled reducer correctly removes the
deleted supplier from `getallSupplier`.

### Frontend page

Add a create/edit form to `Supplierpage.jsx` that collects `name`,
`contactInfo.phone`, `contactInfo.email`, `contactInfo.address`, and
`productsSupplied`. The form must be hidden by default and toggled by an
**Add Supplier** button. Display the supplier table with name, email, phone,
and an **Edit** / **Remove** button per row.

Relevant areas:

- `backend/models/Suppliermodel.js`
- `backend/Routers/supplierrouter.js`
- `backend/controller/suppliercontroller.js`
- `frontend/src/features/SupplierSlice.js`
- `frontend/src/pages/Supplierpage.jsx`

Run the dependency-free acceptance test from this directory with:

```bash
python3 -m pytest tests/test_validation.py
```

Acceptance criteria:

- `productsSupplied` is an array field in the Supplier model.
- The search route is declared before the parameterised ID route.
- All supplier routes require authentication via `authmiddleware`.
- `createSupplier` rejects unknown product IDs with a `400` response.
- The `deleteSupplier` thunk uses the action type `'supplier/deleteSupplier'`.
- `Supplierpage.jsx` contains an **Add Supplier** button, a create/edit form,
  and a table that shows supplier contact details.

## Task 3: Implement Supplier Management

# Description

- Fix and complete the supplier management module so that businesses can
  maintain supplier records and associate inventory products with their
  suppliers.

# Requirements

- Change `productsSupplied` to an array of Product references in the Supplier
  model.

- Protect all supplier routes with authentication middleware.

- Validate that referenced product IDs exist before creating a supplier.

- Fix the route ordering so that the search endpoint is reachable.

- Fix the Redux slice action type for `deleteSupplier`.

- Add a create/edit form and a data table to the supplier page.

# Acceptance Criteria

- Authenticated users can create, view, update, and delete supplier records.

- A supplier can reference multiple products; unknown product IDs are rejected.

- Supplier search works without being intercepted by the ID route.

- The frontend correctly removes a deleted supplier from the list.

- The supplier page displays contact details and exposes add/edit controls.

# Product management has no safe bulk inventory workflow

**Environment:** MERN inventory application, backend Node.js/Express and
frontend React application.

## Problem

Product management currently supports only one-product-at-a-time CRUD. An
administrator preparing a stock import must manually enter every product, and
there is no way to download the filtered inventory for reporting or backup.

## Requested behavior

Add CSV import and export to the product management workflow. An import file
must contain `name`, `description`, `category`, `price`, and `quantity` columns.
The server should accept category names or existing category IDs, validate all
rows before writing, and report invalid row numbers and reasons. A product name
already present in the database or repeated in the same file must not be
inserted twice. Only an authorized administrator may import.

Export should return a downloadable CSV containing the selected products and
should honor the active product search and category filters. Existing
authenticated users should be able to export, but unauthenticated requests
must still be rejected.

## Impact

Without this workflow, large inventory updates are slow and error-prone, and
operations staff cannot reliably archive the inventory view they are working
with. The change should not alter existing single-product CRUD endpoints.

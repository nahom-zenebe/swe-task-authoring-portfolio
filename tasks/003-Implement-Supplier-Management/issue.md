# Supplier management is incomplete and not safely integrated with products

**Environment:** MERN inventory application, backend Node.js/Express and
frontend React application.

## Problem

A Supplier model, controller, and router already exist, but the implementation
has several gaps that make it unsafe and unusable in production:

- The `Supplier` model stores `productsSupplied` as a single ObjectId instead
  of an array, so a supplier that provides more than one product cannot be
  represented correctly.
- The `searchSupplier` route is registered **after** the `/:supplierId`
  parameterised route, so `GET /api/supplier/searchSupplier` is intercepted by
  the ID handler and always returns a cast error.
- None of the supplier routes require authentication, so any unauthenticated
  request can create, edit, or delete supplier records.
- The `createSupplier` controller does not validate that the supplied
  `productsSupplied` IDs actually exist in the Product collection, allowing
  dangling references.
- The frontend `SupplierSlice.js` dispatches `deleteSupplier` to the wrong
  action path (`'supplier/'` instead of `'supplier/deleteSupplier'`), so
  optimistic UI removal never fires.
- The `Supplierpage.jsx` component exists but has no form to create or edit
  suppliers, and it does not display contact details or associated products.

## Impact

Operations staff cannot reliably search for suppliers, the UI provides no way
to add or update supplier records, and unauthenticated callers can mutate
supplier data. Fixing these issues is required before the supplier module can
be used in any environment.

# Inventory movement history is missing fields, unprotected, and displays hardcoded data

**Environment:** MERN inventory application, backend Node.js/Express and
frontend React application.

**Area:** `backend/models/StockTranscationmodel.js`,
`backend/Routers/stocktransactionrouter.js`,
`backend/controller/stocktransaction.js`,
`frontend/src/features/stocktransactionSlice.js`,
`frontend/src/pages/StockTransaction.jsx`.

## Problem

The existing `StockTransaction` module is the closest thing to an inventory
movement history, but it has several gaps that make it unsuitable as an
audit trail:

- The model has no `previousStock`, `resultingStock`, `reason`, or `user`
  fields, so there is no way to reconstruct what the inventory level was
  before or after a movement, why it happened, or who triggered it.
- The `type` enum is limited to `"Stock-in"` and `"Stock-out"`. The task
  requires `"sale"`, `"purchase"`, `"return"`, `"adjustment"`, and
  `"damage"` movement types.
- None of the stock-transaction routes require authentication, so any
  unauthenticated caller can create or read movement records.
- The `getStockTransactionsByProduct` controller calls
  `.populate('Supplier')` (capital S) instead of `.populate('supplier')`
  (lowercase), so the supplier field is never populated.
- The frontend `StockTransaction.jsx` table renders hardcoded strings
  (`"box"` and `"Abebe"`) in the product and supplier columns instead of
  the actual populated values.
- The frontend slice's `createStockTransaction` fulfilled reducer pushes
  `action.payload` (the raw API response object `{ message: "..." }`)
  onto `getallStocks` instead of re-fetching or ignoring, corrupting the
  list.
- There is no date-range or movement-type filter on the history retrieval
  endpoints, making it impossible to query movements for a specific period
  or reason.

## Impact

Operations staff cannot use the stock-transaction list as a reliable audit
trail. The missing fields mean historical records cannot prove what the
stock level was at any point in time, the hardcoded UI values make every
row look identical, and the lack of authentication means the data can be
tampered with by unauthenticated requests.

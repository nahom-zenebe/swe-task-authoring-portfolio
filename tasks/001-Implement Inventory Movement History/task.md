## Implement inventory movement history

Add an audit-friendly inventory movement history to the stock-transaction
module. Every significant stock change must be recorded with enough context
to reconstruct the inventory level at any point in time.

Use the existing `StockTransaction` model and route conventions. Do not
introduce new dependencies.

### Model

Extend `StockTranscationmodel.js` with the following fields:

```js
previousStock: { type: Number, required: true }
resultingStock: { type: Number, required: true }
reason:         { type: String }
user:           { type: mongoose.Schema.Types.ObjectId, ref: "User" }
```

Replace the `type` enum values `"Stock-in"` / `"Stock-out"` with the full
set required for an audit trail:

```js
enum: ["sale", "purchase", "return", "adjustment", "damage"]
```

### Routes

Add `authmiddleware` to every stock-transaction route so that unauthenticated
requests are rejected.

Add a `GET /history/:productId` route that accepts optional `startDate`,
`endDate`, and `type` query parameters and returns movements for that product
filtered by the supplied criteria.

### Controller

- Fix `getStockTransactionsByProduct`: change `.populate('Supplier')` to
  `.populate('supplier')` so the supplier reference is actually resolved.
- Add a `getMovementHistory` handler that queries by `product`, and
  optionally filters by `type`, `transactionDate >= startDate`, and
  `transactionDate <= endDate`. Results must be sorted by `transactionDate`
  descending.
- In `createStockTransaction`, require `previousStock` and `resultingStock`
  in addition to the existing required fields, and persist `user` from
  `req.user._id` when the middleware is present.

### Frontend slice

Fix the `createStockTransaction` fulfilled reducer: instead of pushing the
raw API response onto `getallStocks`, dispatch `getAllStockTransactions` or
leave the list unchanged so it is not corrupted.

### Frontend page

Fix `StockTransaction.jsx` so the product and supplier table columns render
the actual populated values (`Stocks.product?.name` and
`Stocks.supplier?.name`) instead of the hardcoded strings `"box"` and
`"Abebe"`. Add `previousStock` and `resultingStock` columns to the table.

Relevant areas:

- `backend/models/StockTranscationmodel.js`
- `backend/Routers/stocktransactionrouter.js`
- `backend/controller/stocktransaction.js`
- `frontend/src/features/stocktransactionSlice.js`
- `frontend/src/pages/StockTransaction.jsx`

Run the dependency-free acceptance test from this directory with:

```bash
python3 -m pytest tests/test.py
```

Acceptance criteria:

- The model contains `previousStock`, `resultingStock`, `reason`, and `user`
  fields.
- The `type` enum includes `"sale"`, `"purchase"`, `"return"`,
  `"adjustment"`, and `"damage"`.
- All stock-transaction routes require `authmiddleware`.
- A `GET /history/:productId` route exists and supports `startDate`,
  `endDate`, and `type` query filters.
- `getStockTransactionsByProduct` populates `supplier` (lowercase).
- The frontend table renders `Stocks.product?.name` and
  `Stocks.supplier?.name` instead of hardcoded strings.
- The frontend slice fulfilled reducer does not push the raw API response
  onto `getallStocks`.

## Task 1: Implement Inventory Movement History

# Description

- Add an audit-friendly inventory movement module that records every
  significant change in stock quantities.

# Requirements

- Extend the StockTransaction model with previousStock, resultingStock,
  reason, and user fields.

- Expand the movement type enum to include sale, purchase, return,
  adjustment, and damage.

- Protect all stock-transaction routes with authentication middleware.

- Add a filtered movement history endpoint for a product.

- Fix the supplier populate call and the hardcoded frontend table values.

- Fix the Redux slice fulfilled reducer to avoid corrupting the stock list.

# Acceptance Criteria

- Movement records store previous and resulting stock levels, a reason, and
  the acting user.

- All supported movement types are accepted by the model.

- Authenticated users can retrieve filtered movement history by product,
  type, and date range.

- The frontend table displays real product and supplier names.

- The stock list is not corrupted when a new transaction is created.

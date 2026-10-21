## Implement bulk product import and export

Add a safe bulk workflow to the inventory product management area. Administrators
must be able to upload a CSV containing products, receive actionable validation
errors, and avoid creating duplicate products. Authenticated users must be able
to export inventory as CSV while preserving the current search and category
filters.

Use the existing product schema and route conventions. The CSV contract is:

```text
name,description,category,price,quantity
```

Categories may be identified using the existing category ID or category name.
Required values must be validated before any product from the file is inserted.
Import must remain restricted to authorized administrators, while export must
require authentication. Keep existing single-product CRUD behavior intact.

Relevant areas:

- `backend/controller/productController.js`
- `backend/Routers/ProductRouter.js`
- `frontend/src/features/productSlice.js`
- `frontend/src/pages/Productpage.jsx`

Run the dependency-free acceptance test from this directory with:

```bash
python3 -m pytest tests/test_cache.py
```

Acceptance criteria:

- Valid CSV rows create products with the correct description, category, price,
	and quantity.
- Missing columns, blank names/descriptions/categories, invalid prices or
	quantities, unknown categories, duplicate rows, and existing product names
	produce row-specific errors and no partial import.
- Export returns CSV with escaped values and honors query and category filters.
- The import route uses authentication and administrator authorization.
- The product page exposes CSV upload to administrators and filtered export to
	authenticated product users.
## Task 2: Implement Bulk Product Import and Export

# Description

- Add functionality that allows administrators to import multiple products from a CSV file and export existing inventory data for reporting or backup purposes.

# Requirements

- Add a CSV upload interface to the product management page.

- Validate required columns, product names, prices, quantities, and categories.

- Report invalid rows with clear error messages.

- Prevent unintended duplicate product creation.

- Add CSV export with support for the current search and category filters.

- Restrict import operations to authorized users.

# Acceptance Criteria

- Valid CSV files create the expected product records.

- Invalid rows are reported without silently corrupting inventory data.

- Exported data matches the selected inventory records.

- Unauthorized users cannot perform bulk imports.
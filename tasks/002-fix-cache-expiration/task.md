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
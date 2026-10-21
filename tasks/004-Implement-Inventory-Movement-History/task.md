## Task 4: Implement Inventory Movement History

# Description

- Add an audit-friendly inventory movement module that records every significant change in stock quantities.

# Requirements

- Create an InventoryMovement model containing product, movement type, quantity, previous stock, resulting stock, reason, user, and timestamp.

- Support movement types such as sale, purchase, return, adjustment, and damage.

- Record movements when orders are fulfilled, purchases are received, and manual adjustments occur.

- Provide APIs to retrieve movement history by product, user, movement type, and date range.

- Add a frontend history table with filtering and pagination.

- Prevent ordinary users from editing historical movement records.

# Acceptance Criteria

- Each supported stock-changing operation creates an appropriate movement record.

- Movement records accurately reflect the resulting stock quantity.

- Authorized users can search historical inventory changes.

- Historical records cannot be silently modified through ordinary CRUD endpoints.
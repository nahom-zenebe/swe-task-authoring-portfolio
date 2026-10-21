Task 5: Implement Barcode and QR Code Product Identification

Description

Enable users to identify products quickly by scanning barcodes or QR codes during product lookup, stock receiving, and sales processing.

Requirements

Add a unique SKU or barcode field to the Product model.

Generate a QR code for products that do not already have an assigned code.

Add a frontend scanning interface using a browser-compatible scanning library.

Retrieve the matching product through a backend API.

Support manual SKU entry when camera access is unavailable.

Handle duplicate codes and unknown products gracefully.

Acceptance Criteria

Each product has a unique identifier according to the selected uniqueness rules.

Scanning a valid code opens the correct product.

Unknown codes produce a useful error message.

Manual lookup remains available.

Camera permissions and unavailable devices are handled safely.
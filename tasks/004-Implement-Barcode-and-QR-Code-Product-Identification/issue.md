# Product lookup is too slow for barcode and QR-code workflows

**Environment:** MERN inventory application at baseline commit `3869035`,
backend Node.js/Express/Mongoose and frontend React.

**Area:** product model, product router/controller, Redux product state, and
`Productpage.jsx`.

## Reproduction

1. Open the product page and try to identify an item from its packaging.
2. Search by name, or manually inspect the product table.
3. Try to use a product barcode or QR code instead.
4. Create two products with the same code if one is supplied by a client.

## Expected behavior

Each product should have a unique non-empty identifier suitable for a barcode
or QR code. An authenticated user should be able to scan or enter that code
and immediately receive the matching product. Unknown codes should produce a
recoverable error, and browsers without camera support should still allow
manual entry.

## Actual behavior

The Product model has no barcode/SKU field, the API has no code lookup route,
and the product page has no scanner or manual code lookup. Users must search
by product name, and duplicate identifiers cannot be prevented because they
are not stored.

## Impact

Receiving and sales workflows are slow and prone to selecting the wrong item.
The feature must work without requiring a camera or a third-party scanning
service, so desktop users and unsupported browsers retain a reliable fallback.

import os
from pathlib import Path


def source_root():
	configured_root = os.environ.get("SOURCE_REPO")
	if configured_root:
		return Path(configured_root)
	return Path(__file__).resolve().parents[4] / "project" / "Advanced-Inventory-Management-System"


def read_source(relative_path):
	path = source_root() / relative_path
	assert path.exists(), f"Missing expected source file: {path}"
	return path.read_text(encoding="utf-8")


def test_product_routes_expose_authorized_import_and_authenticated_export():
	router = read_source("backend/Routers/ProductRouter.js")

	assert 'router.post("/import",authmiddleware,adminmiddleware,upload.single("file"),importProducts)' in router
	assert 'router.get("/export",authmiddleware,exportProducts)' in router
	assert 'multer.memoryStorage()' in router


def test_csv_utility_validates_rows_and_escapes_export_values():
	csv_utility = read_source("backend/libs/productCsv.js")

	for required_column in ("name", "description", "category", "price", "quantity"):
		assert required_column in csv_utility
	assert "Number.isFinite(price)" in csv_utility
	assert "Number.isInteger(quantity)" in csv_utility
	assert "Unclosed quoted value" in csv_utility
	assert "replace(/\"/g, '\"\"')" in csv_utility


def test_import_is_validated_before_insert_and_rejects_duplicates():
	controller = read_source("backend/controller/productController.js")

	assert "parseProductCsv(req.file.buffer.toString(\"utf8\"))" in controller
	assert "if (errors.length)" in controller
	assert "Product already exists" in controller
	assert "Duplicate product name" in controller
	assert "Product.insertMany(products, { ordered: true })" in controller


def test_export_applies_query_and_category_filters_and_returns_csv():
	controller = read_source("backend/controller/productController.js")

	assert 'req.query.query' in controller
	assert 'req.query.category' in controller
	assert '.populate("Category")' in controller
	assert '"Content-Type": "text/csv; charset=utf-8"' in controller
	assert '"Content-Disposition": "attachment; filename=products.csv"' in controller


def test_product_page_exposes_import_for_admin_and_export_controls():
	product_page = read_source("frontend/src/pages/Productpage.jsx")
	product_slice = read_source("frontend/src/features/productSlice.js")

	assert "ImportProducts" in product_page
	assert 'Authuser?.role === "admin"' in product_page
	assert 'accept=".csv,text/csv"' in product_page
	assert "ExportProducts" in product_page
	assert "responseType: 'blob'" in product_slice

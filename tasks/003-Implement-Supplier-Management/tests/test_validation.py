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


def test_supplier_model_uses_array_for_products_supplied():
	model = read_source("backend/models/Suppliermodel.js")

	# productsSupplied must be an array field (wrapped in [])
	assert "productsSupplied:[{" in model.replace(" ", "") or \
		"productsSupplied: [{" in model


def test_supplier_routes_require_authmiddleware():
	router = read_source("backend/Routers/supplierrouter.js")

	assert "authmiddleware" in router
	# Every mutating and reading route must include authmiddleware
	assert 'authmiddleware, createSupplier' in router or 'authmiddleware,createSupplier' in router
	assert 'authmiddleware, getAllSuppliers' in router or 'authmiddleware,getAllSuppliers' in router
	assert 'authmiddleware, deleteSupplier' in router or 'authmiddleware,deleteSupplier' in router


def test_search_route_declared_before_parameterised_id_route():
	router = read_source("backend/Routers/supplierrouter.js")

	search_pos = router.find("searchSupplier")
	id_route_pos = router.find("/:supplierId")

	assert search_pos != -1, "searchSupplier route not found"
	assert id_route_pos != -1, "/:supplierId route not found"
	assert search_pos < id_route_pos, (
		"searchSupplier route must be declared before /:supplierId "
		"to prevent the parameterised handler from intercepting it"
	)


def test_create_supplier_validates_product_ids():
	controller = read_source("backend/controller/suppliercontroller.js")

	assert "Product" in controller or "Productmodel" in controller
	assert "Unknown product IDs" in controller or "unknown" in controller.lower()
	assert "unknownIds" in controller or "unknown_ids" in controller


def test_delete_supplier_slice_uses_correct_action_type():
	slice_code = read_source("frontend/src/features/SupplierSlice.js")

	assert "'supplier/deleteSupplier'" in slice_code or '"supplier/deleteSupplier"' in slice_code
	# The old broken action type must not be present
	assert "'supplier/'" not in slice_code


def test_delete_supplier_fulfilled_removes_from_state():
	slice_code = read_source("frontend/src/features/SupplierSlice.js")

	assert "getallSupplier" in slice_code
	assert "filter" in slice_code
	assert "action.meta.arg" in slice_code


def test_supplier_page_exposes_add_button_form_and_table():
	page = read_source("frontend/src/pages/Supplierpage.jsx")

	assert "Add Supplier" in page
	assert "isFormVisible" in page
	assert "submitSupplier" in page or "handleEditSubmit" in page
	assert "contactInfo" in page
	assert "Remove" in page
	assert "Edit" in page

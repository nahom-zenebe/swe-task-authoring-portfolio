const assert = require("assert");
const fs = require("fs");
const path = require("path");

function sourceRoot() {
  if (process.env.SOURCE_REPO) {
    return process.env.SOURCE_REPO;
  }
  return path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "project",
    "Advanced-Inventory-Management-System"
  );
}

function readSource(relativePath) {
  const fullPath = path.join(sourceRoot(), relativePath);
  assert.ok(
    fs.existsSync(fullPath),
    `Missing expected source file: ${fullPath}`
  );
  return fs.readFileSync(fullPath, "utf8");
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("supplier model uses array for products supplied", () => {
  const model = readSource("backend/models/Suppliermodel.js");

  assert.ok(
    model.replace(/ /g, "").includes("productsSupplied:[{") ||
      model.includes("productsSupplied: [{"),
    "productsSupplied must be an array field wrapped in []"
  );
});

test("supplier routes require authmiddleware", () => {
  const router = readSource("backend/Routers/supplierrouter.js");

  assert.ok(router.includes("authmiddleware"), "authmiddleware not found in router");
  assert.ok(
    router.includes("authmiddleware, createSupplier") ||
      router.includes("authmiddleware,createSupplier"),
    "createSupplier route missing authmiddleware"
  );
  assert.ok(
    router.includes("authmiddleware, getAllSuppliers") ||
      router.includes("authmiddleware,getAllSuppliers"),
    "getAllSuppliers route missing authmiddleware"
  );
  assert.ok(
    router.includes("authmiddleware, deleteSupplier") ||
      router.includes("authmiddleware,deleteSupplier"),
    "deleteSupplier route missing authmiddleware"
  );
});

test("search route declared before parameterised id route", () => {
  const router = readSource("backend/Routers/supplierrouter.js");

  const searchPos = router.indexOf("searchSupplier");
  const idRoutePos = router.indexOf("/:supplierId");

  assert.ok(searchPos !== -1, "searchSupplier route not found");
  assert.ok(idRoutePos !== -1, "/:supplierId route not found");
  assert.ok(
    searchPos < idRoutePos,
    "searchSupplier route must be declared before /:supplierId to prevent the parameterised handler from intercepting it"
  );
});

test("create supplier validates product ids", () => {
  const controller = readSource("backend/controller/suppliercontroller.js");

  assert.ok(
    controller.includes("Product") || controller.includes("Productmodel"),
    "Product model not referenced in supplier controller"
  );
  assert.ok(
    controller.includes("Unknown product IDs") ||
      controller.toLowerCase().includes("unknown"),
    "unknown product ID error message not found"
  );
  assert.ok(
    controller.includes("unknownIds") || controller.includes("unknown_ids"),
    "unknownIds variable not found"
  );
});

test("delete supplier slice uses correct action type", () => {
  const sliceCode = readSource("frontend/src/features/SupplierSlice.js");

  assert.ok(
    sliceCode.includes("'supplier/deleteSupplier'") ||
      sliceCode.includes('"supplier/deleteSupplier"'),
    "correct action type 'supplier/deleteSupplier' not found"
  );
  assert.ok(
    !sliceCode.includes("'supplier/'"),
    "broken action type 'supplier/' must not be present"
  );
});

test("delete supplier fulfilled removes supplier from state", () => {
  const sliceCode = readSource("frontend/src/features/SupplierSlice.js");

  assert.ok(sliceCode.includes("getallSupplier"), "getallSupplier not found in slice");
  assert.ok(sliceCode.includes("filter"), "filter call not found in slice");
  assert.ok(sliceCode.includes("action.meta.arg"), "action.meta.arg not found in slice");
});

test("supplier page exposes add button form and table", () => {
  const page = readSource("frontend/src/pages/Supplierpage.jsx");

  assert.ok(page.includes("Add Supplier"), "Add Supplier button text not found");
  assert.ok(page.includes("isFormVisible"), "isFormVisible state not found");
  assert.ok(
    page.includes("submitSupplier") || page.includes("handleEditSubmit"),
    "form submit handler not found"
  );
  assert.ok(page.includes("contactInfo"), "contactInfo not found in page");
  assert.ok(page.includes("Remove"), "Remove button not found");
  assert.ok(page.includes("Edit"), "Edit button not found");
});

// Runner
let passed = 0;
let failed = 0;

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

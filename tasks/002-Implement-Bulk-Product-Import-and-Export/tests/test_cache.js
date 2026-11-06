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

test(
  "product routes expose authorized import and authenticated export",
  () => {
    const router = readSource("backend/Routers/ProductRouter.js");

    assert.ok(
      router.includes(
        'router.post("/import",authmiddleware,adminmiddleware,upload.single("file"),importProducts)'
      ),
      "import route with auth and admin middleware not found"
    );
    assert.ok(
      router.includes('router.get("/export",authmiddleware,exportProducts)'),
      "export route with authmiddleware not found"
    );
    assert.ok(
      router.includes("multer.memoryStorage()"),
      "multer memory storage not found"
    );
  }
);

test("csv utility validates rows and escapes export values", () => {
  const csvUtility = readSource("backend/libs/productCsv.js");

  for (const col of ["name", "description", "category", "price", "quantity"]) {
    assert.ok(csvUtility.includes(col), `Required column '${col}' not found`);
  }
  assert.ok(
    csvUtility.includes("Number.isFinite(price)"),
    "price validation not found"
  );
  assert.ok(
    csvUtility.includes("Number.isInteger(quantity)"),
    "quantity validation not found"
  );
  assert.ok(
    csvUtility.includes("Unclosed quoted value"),
    "unclosed quote error not found"
  );
  assert.ok(
    csvUtility.includes('replace(/"/g, \'""\''),
    "csv escape logic not found"
  );
});

test("import is validated before insert and rejects duplicates", () => {
  const controller = readSource("backend/controller/productController.js");

  assert.ok(
    controller.includes('parseProductCsv(req.file.buffer.toString("utf8"))'),
    "parseProductCsv call not found"
  );
  assert.ok(
    controller.includes("if (errors.length)"),
    "errors.length check not found"
  );
  assert.ok(
    controller.includes("Product already exists"),
    "duplicate product check not found"
  );
  assert.ok(
    controller.includes("Duplicate product name"),
    "duplicate name check not found"
  );
  assert.ok(
    controller.includes("Product.insertMany(products, { ordered: true })"),
    "insertMany call not found"
  );
});

test("export applies query and category filters and returns csv", () => {
  const controller = readSource("backend/controller/productController.js");

  assert.ok(
    controller.includes("req.query.query"),
    "query filter not found"
  );
  assert.ok(
    controller.includes("req.query.category"),
    "category filter not found"
  );
  assert.ok(
    controller.includes('.populate("Category")'),
    "Category populate not found"
  );
  assert.ok(
    controller.includes('"Content-Type": "text/csv; charset=utf-8"'),
    "Content-Type header not found"
  );
  assert.ok(
    controller.includes('"Content-Disposition": "attachment; filename=products.csv"'),
    "Content-Disposition header not found"
  );
});

test("product page exposes import for admin and export controls", () => {
  const productPage = readSource("frontend/src/pages/Productpage.jsx");
  const productSlice = readSource("frontend/src/features/productSlice.js");

  assert.ok(
    productPage.includes("ImportProducts"),
    "ImportProducts not found in product page"
  );
  assert.ok(
    productPage.includes('Authuser?.role === "admin"'),
    "admin role check not found"
  );
  assert.ok(
    productPage.includes('accept=".csv,text/csv"'),
    "csv file accept attribute not found"
  );
  assert.ok(
    productPage.includes("ExportProducts"),
    "ExportProducts not found in product page"
  );
  assert.ok(
    productSlice.includes("responseType: 'blob'"),
    "blob responseType not found in product slice"
  );
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

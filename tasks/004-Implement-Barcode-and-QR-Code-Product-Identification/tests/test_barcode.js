const assert = require("assert");
const fs = require("fs");
const path = require("path");

function sourceRoot() {
  return process.env.SOURCE_REPO || path.resolve(
    __dirname, "..", "..", "..", "..", "main_project",
    "Advanced-Inventory-Management-System"
  );
}

function readSource(relativePath) {
  const file = path.join(sourceRoot(), relativePath);
  assert.ok(fs.existsSync(file), `Missing expected source file: ${file}`);
  return fs.readFileSync(file, "utf8");
}

const checks = [
  ["product model defines a sparse unique barcode", () => {
    const model = readSource("backend/models/Productmodel.js");
    assert.match(model, /barcode\s*:\s*\{/);
    assert.match(model, /unique\s*:\s*true/);
    assert.match(model, /sparse\s*:\s*true/);
    assert.match(model, /trim\s*:\s*true/);
  }],
  ["lookup route is authenticated", () => {
    const router = readSource("backend/Routers/ProductRouter.js");
    assert.match(router, /router\.get\(["']\/lookup\/:code["'],\s*authmiddleware/);
    assert.match(router, /lookupProduct/);
  }],
  ["controller assigns and validates codes", () => {
    const controller = readSource("backend/controller/productController.js");
    assert.match(controller, /barcode/);
    assert.match(controller, /crypto|randomUUID|generate.*barcode/i);
    assert.match(controller, /409/);
    assert.match(controller, /lookupProduct/);
    assert.match(controller, /populate\(["']Category["']\)/);
    assert.match(controller, /404/);
  }],
  ["redux exposes authenticated lookup", () => {
    const slice = readSource("frontend/src/features/productSlice.js");
    assert.match(slice, /lookupProduct/);
    assert.match(slice, /product\/lookup/);
    assert.match(slice, /withCredentials:\s*true/);
  }],
  ["product page provides scanner and manual fallback", () => {
    const page = readSource("frontend/src/pages/Productpage.jsx");
    assert.match(page, /BarcodeDetector/);
    assert.match(page, /barcode|QR_CODE|qr_code/i);
    assert.match(page, /getUserMedia/);
    assert.match(page, /manual|Enter.*code|lookup/i);
    assert.match(page, /unsupported|permission|camera/i);
  }],
];

let passed = 0;
for (const [name, check] of checks) {
  try {
    check();
    console.log(`  ✓ ${name}`);
    passed += 1;
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
  }
}

console.log(`\n${passed} passed, ${checks.length - passed} failed`);
if (passed !== checks.length) process.exit(1);

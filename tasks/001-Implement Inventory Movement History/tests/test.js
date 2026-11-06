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

test("model contains audit fields and full type enum", () => {
  const model = readSource("backend/models/StockTranscationmodel.js");

  for (const movementType of ["sale", "purchase", "return", "adjustment", "damage"]) {
    assert.ok(
      model.includes(movementType),
      `Movement type '${movementType}' missing from enum`
    );
  }

  assert.ok(model.includes("previousStock"), "previousStock field not found");
  assert.ok(model.includes("resultingStock"), "resultingStock field not found");
  assert.ok(model.includes("reason"), "reason field not found");
  assert.ok(
    model.replace(/ /g, "").includes('ref:"User"') || model.includes('ref: "User"'),
    "user ref to User model not found"
  );
});

test("all stock transaction routes require authmiddleware", () => {
  const router = readSource("backend/Routers/stocktransactionrouter.js");

  assert.ok(router.includes("authmiddleware"), "authmiddleware not found in router");
  assert.ok(
    router.includes("authmiddleware, createStockTransaction") ||
      router.includes("authmiddleware,createStockTransaction"),
    "createStockTransaction route missing authmiddleware"
  );
  assert.ok(
    router.includes("authmiddleware, getAllStockTransactions") ||
      router.includes("authmiddleware,getAllStockTransactions"),
    "getAllStockTransactions route missing authmiddleware"
  );
  assert.ok(
    router.includes("authmiddleware, searchStocks") ||
      router.includes("authmiddleware,searchStocks"),
    "searchStocks route missing authmiddleware"
  );
});

test("history route exists with product id param", () => {
  const router = readSource("backend/Routers/stocktransactionrouter.js");

  assert.ok(router.includes("/history/:productId"), "/history/:productId route not found");
  assert.ok(router.includes("getMovementHistory"), "getMovementHistory handler not found");
});

test("get movement history filters by type and date range", () => {
  const controller = readSource("backend/controller/stocktransaction.js");

  assert.ok(controller.includes("getMovementHistory"), "getMovementHistory not found");
  assert.ok(controller.includes("startDate"), "startDate filter not found");
  assert.ok(controller.includes("endDate"), "endDate filter not found");
  assert.ok(controller.includes("filter.type"), "filter.type not found");
  assert.ok(controller.includes("transactionDate"), "transactionDate not found");
  assert.ok(controller.includes("$gte"), "$gte operator not found");
  assert.ok(controller.includes("$lte"), "$lte operator not found");
});

test("get transactions by product populates lowercase supplier", () => {
  const controller = readSource("backend/controller/stocktransaction.js");

  assert.ok(
    controller.includes(".populate('supplier')"),
    "lowercase .populate('supplier') not found"
  );
  assert.ok(
    !controller.includes(".populate('Supplier')"),
    "broken uppercase .populate('Supplier') must not be present"
  );
});

test("frontend slice fulfilled does not push raw response", () => {
  const sliceCode = readSource("frontend/src/features/stocktransactionSlice.js");

  assert.ok(
    !sliceCode.includes("state.getallStocks.push(action.payload)"),
    "raw API response must not be pushed onto getallStocks"
  );
});

test("frontend table renders real product and supplier names", () => {
  const page = readSource("frontend/src/pages/StockTransaction.jsx");

  assert.ok(
    page.includes("Stocks.product?.name"),
    "Stocks.product?.name not found in table"
  );
  assert.ok(
    page.includes("Stocks.supplier?.name"),
    "Stocks.supplier?.name not found in table"
  );
  assert.ok(!page.includes(">box<"), "hardcoded 'box' string must be removed");
  assert.ok(!page.includes(">Abebe<"), "hardcoded 'Abebe' string must be removed");
});

test("frontend table includes previous and resulting stock columns", () => {
  const page = readSource("frontend/src/pages/StockTransaction.jsx");

  assert.ok(page.includes("previousStock"), "previousStock column not found");
  assert.ok(page.includes("resultingStock"), "resultingStock column not found");
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

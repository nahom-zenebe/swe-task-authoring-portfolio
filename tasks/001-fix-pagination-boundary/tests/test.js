const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sourceRoot =
  process.env.SOURCE_REPO ||
  path.resolve(
    __dirname,
    "../../../../project/Advanced-Inventory-Management-System",
  );
const routerPath = path.join(
  sourceRoot,
  "backend",
  "Routers",
  "categoryRouter.js",
);
const router = fs.readFileSync(routerPath, "utf8");
const expectedRoute =
  'router.put("/updateCategory/:CategoryId",authmiddleware,updateCategory)';

assert.match(
  router,
  new RegExp(expectedRoute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
);
assert.doesNotMatch(
  router,
  /router\.put\("\/updateCategory",authmiddleware,updateCategory\)/,
);

console.log("Category update route regression test passed.");

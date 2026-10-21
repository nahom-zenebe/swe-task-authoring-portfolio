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
const oldRoute = 'router.put("/updateCategory",authmiddleware,updateCategory)';
const newRoute =
  'router.put("/updateCategory/:CategoryId",authmiddleware,updateCategory)';
const router = fs.readFileSync(routerPath, "utf8");

if (!router.includes(oldRoute)) {
  throw new Error("Expected buggy category update route was not found");
}

fs.writeFileSync(routerPath, router.replace(oldRoute, newRoute));

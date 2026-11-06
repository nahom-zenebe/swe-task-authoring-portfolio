const { execFileSync } = require("child_process");
const path = require("path");

function main() {
  const sourceRoot =
    process.env.SOURCE_REPO ||
    path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "main_project",
      "Advanced-Inventory-Management-System",
    );

  execFileSync(
    "git",
    ["apply", "--whitespace=nowarn", path.resolve(__dirname, "..", "patch.diff")],
    { cwd: sourceRoot, stdio: "inherit" },
  );
}

main();

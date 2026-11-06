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
      "project",
      "Advanced-Inventory-Management-System"
    );

  const patchPath = path.resolve(__dirname, "..", "patch.diff");

  execFileSync("git", ["apply", "--whitespace=nowarn", patchPath], {
    cwd: sourceRoot,
    stdio: "inherit",
  });
}

main();

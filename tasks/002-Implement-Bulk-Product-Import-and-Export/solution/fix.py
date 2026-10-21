import os
import subprocess
from pathlib import Path


def main():
	source_root = Path(
		os.environ.get(
			"SOURCE_REPO",
			Path(__file__).resolve().parents[4]
			/ "project"
			/ "Advanced-Inventory-Management-System",
		)
	)
	patch_path = Path(__file__).resolve().parents[1] / "patch.diff"
	subprocess.run(
		["git", "apply", "--whitespace=nowarn", str(patch_path)],
		cwd=source_root,
		check=True,
	)


if __name__ == "__main__":
	main()

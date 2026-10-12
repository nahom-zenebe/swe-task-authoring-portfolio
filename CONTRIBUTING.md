# Contributing Tasks

Contributions add reproducible JavaScript software engineering tasks to the
portfolio. Keep each change narrow, executable, and understandable without a
conversation with the author.

## Before You Start

1. Clone the upstream application and record the exact commit used as the task
	 baseline.
2. Install backend and frontend dependencies according to the upstream
	 repository instructions.
3. Confirm the defect on the unmodified baseline.
4. Check `task-index.json` and choose the next available task identifier.

Do not commit `.env` files, credentials, database dumps, generated build
artifacts, `node_modules`, or unrelated changes from the upstream application.

## Required Task Files

Every task directory must contain the following files:

### `task.md`

Write the agent-facing assignment. Include:

- the problem and intended behavior;
- relevant application area and file paths;
- constraints and compatibility requirements;
- the exact test or validation command;
- acceptance criteria and any known edge cases.

Do not reveal the reference implementation or require a particular coding
style when multiple correct fixes are possible.

### `issue.md`

Write a realistic issue report with:

- a concise title;
- environment and baseline commit;
- reproduction steps and minimal input;
- expected behavior;
- actual behavior and error output, when available;
- impact and scope.

The report must contain enough information for an engineer to reproduce the
failure locally.

### `tests/`

Add regression tests that fail before the fix and pass after it. Tests should
be deterministic and isolated from live services whenever possible. Mock time,
network requests, authentication providers, and database calls when those
systems are not the behavior under test.

For frontend behavior, follow the existing Create React App/Jest conventions.
For backend behavior, provide the test runner or command in `task.md`, since
the upstream backend test script is currently only a placeholder.

### `solution/`

Store the known-good reference implementation or the files needed to apply it.
The reference solution must satisfy the regression tests and the acceptance
criteria without unrelated refactoring.

### `patch.diff`

Include the reference change as a reviewable diff against the selected
baseline. The diff should be reproducible with standard Git tooling and should
not contain local paths, secrets, generated files, or dependency-lock churn
that is unrelated to the task.

### `evaluation.json`

Use a machine-readable rubric. At minimum, include the task identifier, test
command, required checks, and scoring criteria. Criteria should distinguish the
regression fix from unrelated quality signals such as formatting or scope.

Example shape:

```json
{
	"id": "001",
	"testCommand": "python3 -m pytest tests",
	"checks": [
		{
			"name": "regression",
			"points": 7,
			"description": "The reproduced boundary case is fixed."
		},
		{
			"name": "compatibility",
			"points": 3,
			"description": "Existing behavior remains intact."
		}
	],
	"totalPoints": 10
}
```

Update `task-index.json` with the task ID, title, short description, affected
area, source commit, and test command.

## Reproducibility Rules

- Pin or record versions that affect the result.
- Use stable fixtures and explicit assertions.
- Avoid tests that depend on the current date, timezone, machine-specific
	paths, execution order, or internet availability.
- Make setup and teardown explicit.
- Keep MongoDB, Cloudinary, Socket.IO, and other external integrations behind
	mocks or documented local services unless integration behavior is the subject
	of the task.
- Make failures actionable: an assertion should identify the broken behavior.
- Verify both the buggy baseline and the reference solution.

## Review Checklist

Before submitting a task, confirm:

- [ ] The task has a unique ID and is listed in `task-index.json`.
- [ ] The issue and task statement describe the same behavior.
- [ ] The regression test fails before the fix.
- [ ] The reference solution passes all task tests.
- [ ] The test command works from a clean checkout.
- [ ] No secrets, generated files, or `node_modules` are included.
- [ ] The reference diff is focused and applies to the documented baseline.
- [ ] The rubric is unambiguous and totals the declared score.
- [ ] The task does not require an undocumented live service.

Run the portfolio validator before opening a pull request:

```bash
python3 scripts/validate_task.py
```

## Pull Requests

Use a title that identifies the task, for example `Add task 004 for stock
validation`. The pull request description should summarize the defect, list the
commands run, state whether external services were required, and mention any
known limitations. Keep unrelated formatting or source changes out of the same
pull request.

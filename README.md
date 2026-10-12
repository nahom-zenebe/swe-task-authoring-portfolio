# SWE Task Authoring Portfolio

This repository contains reproducible software engineering tasks for evaluating
AI coding agents. Each task is based on the JavaScript MERN application
[Advanced Inventory Management System](https://github.com/nahom-zenebe/Advanced-Inventory-Management-System).

The tasks are intended to test whether an agent can understand an existing
codebase, reproduce a defect, implement a focused fix, preserve existing
behavior, and pass regression tests. A task should be solvable from the checked
out source repository and the files included in its task directory; hidden
context or undocumented manual steps should not be required.

## Repository Layout

```text
tasks/<task-id>-<short-name>/
	task.md                 Agent-facing task statement
	issue.md                Reproduction-oriented bug report
	patch.diff              Reference patch or expected change
	tests/                  Regression and acceptance tests
	solution/               Reference solution
	evaluation.json         Machine-readable evaluation rubric
scripts/validate_task.py  Task-structure validation helper
task-index.json           Catalog of authored tasks
```

The `tasks/` directory is the source of truth for individual benchmark cases.
The top-level index should make every task discoverable without opening each
directory.

## Source Application

The upstream application is a MERN stack project with separate application
directories:

- `backend/`: Node.js, Express, MongoDB/Mongoose, JWT, and Socket.IO.
- `frontend/`: React, React Router, Redux Toolkit, Axios, Tailwind CSS, and
	Create React App.

The source repository is JavaScript-focused. Task authors should preserve the
project's existing conventions and avoid introducing a new framework merely to
make a test easier to write.

## Getting the Source Repository

Clone the application separately when authoring or manually reproducing a task:

```bash
git clone https://github.com/nahom-zenebe/Advanced-Inventory-Management-System.git
cd Advanced-Inventory-Management-System
```

Install dependencies in each application directory:

```bash
cd backend
npm install

cd ../frontend
npm install
```

The backend requires environment values for its database and authentication
configuration. Do not commit secrets. Use a local `.env` file or a temporary
environment supplied by the test harness.

The upstream scripts currently support `npm start` in the backend and
`npm start`, `npm run build`, and `npm test` in the frontend. The backend's
default `npm test` script is a placeholder that exits with an error, so every
backend task must document and include its own test command or harness.

## What Makes a Good Task

A task should contain one clear, observable engineering problem. Good tasks:

- identify the affected file, function, route, component, or state transition;
- include exact reproduction steps and the expected versus actual behavior;
- use a minimal fixture or mocked dependency where external services are not
	essential to the behavior;
- include a regression test that fails before the fix and passes afterward;
- define acceptance criteria that can be checked automatically;
- avoid relying on network access, wall-clock timing, random data, or a live
	MongoDB instance unless the dependency is explicitly provisioned;
- preserve unrelated behavior and keep the reference patch focused.

Prefer boundary cases that represent realistic inventory workflows, such as
pagination limits, cache expiration, authorization checks, validation of
request bodies, stock changes, or frontend form state. A task must not encode
the reference implementation as the only possible solution.

## Task Lifecycle

1. Select a small defect or missing behavior in the upstream application.
2. Record the source commit, affected area, and required runtime assumptions.
3. Write the issue and agent-facing task statement.
4. Add a deterministic failing regression test.
5. Implement and verify the reference solution.
6. Define the evaluation rubric and update `task-index.json`.
7. Run the repository validation script and review the task from a clean
	 checkout.

The task statement should describe the behavior to change, not prescribe the
reference patch. The issue may contain more diagnostic context, but it should
still be reproducible by another engineer.

## Validation

Run the portfolio validator from the repository root:

```bash
python3 scripts/validate_task.py
```

Also run the task-specific test command documented in `task.md`. A task is
ready only when the regression test fails against the buggy implementation,
passes with the reference solution, and does not depend on files outside the
declared task or source-repository setup.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the required task format and review
checklist.

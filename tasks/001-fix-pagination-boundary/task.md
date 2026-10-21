## Fix category update routing

The category update controller expects the category identifier in
`req.params.CategoryId`, but the Express router currently registers the update
endpoint without a `:CategoryId` path segment. Update the backend route so a
request can reach the controller with the identifier it needs.

Relevant files:

- `backend/Routers/categoryRouter.js`
- `backend/controller/categorycontroller.js`

Keep the existing authentication middleware, handler, method, and route casing
unchanged. Do not add a database dependency or change the controller contract.

Run the regression test from this directory with:

```bash
node tests/test.js
```

Set `SOURCE_REPO` to the source checkout when it is not at the documented local
path.

Acceptance criteria:

- `PUT /api/category/updateCategory/:CategoryId` reaches `updateCategory`.
- The route still requires `authmiddleware`.
- Existing category routes remain unchanged.
- The regression test passes without MongoDB, Cloudinary, or credentials.

# Category updates return 404 for requests with an ID

**Environment:** Node.js backend, Express 4, baseline application checkout.

**Area:** `backend/Routers/categoryRouter.js` and
`backend/controller/categorycontroller.js`.

## Reproduction

1. Start the backend with the normal local configuration.
2. Authenticate as a user allowed to update categories.
3. Send a `PUT` request to `/api/category/updateCategory/65f1c2...` with a
	body such as `{ "updatedCategory": { "name": "Office supplies" } }`.

## Expected behavior

The request reaches `updateCategory`, which reads the ID from
`req.params.CategoryId` and updates that category.

## Actual behavior

The router only registers `/updateCategory`, so the URL containing the
category ID does not match and Express returns 404 before the controller runs.
If the ID is omitted to match the registered route, the controller receives an
undefined `CategoryId` and cannot update the intended record.

## Impact

Authenticated category-management users cannot update categories through the
normal resource URL. The fix is limited to the route declaration; create,
read, search, and delete behavior should remain unchanged.

# BE Northcoders NC Games Portfolio Check List

`This is really great Yi. Well done! Only a couple of comments to add! Your code is beautiful and readable and you are using Express wonderfully. I would split your controller and model functions more so you have a reviews controller, comments controller etc. This is less for a project of this size but is designed to help make an application much more scalable!`

`Overall great job - hats off to you!`

## Readme - Remove the one that was provided and write your own:

`I've left this unchecked but you can use it as a good guide to create your README. Make sure you have one before showing the project to any potential employers.`

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [✔️] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [✔️] .gitignore the `.env` files

## Connection to db

- [✔️] Throw error if `process.env.PGDATABASE` is not set

## Creating tables

- [√] Use `NOT NULL` on required fields
  - `I would probably be a little bit more strict and add NOT NULL to more of the fields`
- [✔️] Default `created_at` in reviews and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`
- [✔️] Delete all comments when the review they are related to is deleted: Add `ON DELETE CASCADE` to `review_id` column in `comments` table.

## Inserting data

- [✔️] Drop tables and create tables in seed function

## Tests

- [✔️] Seeding before each test
- [✔️] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [✔️] Ensure all tests are passing
- [ ] Cover all endpoints and errors
- `take a look at the test-report file to see which tests you still need `

- `GET /api/categories`

  - [✔️] Status 200, array of category objects

- `GET /api/reviews/:review_id`

  - [✔️] Status 200, single review object (including `comment_count`)
  - [✔️] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✔️] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/reviews/:review_id`

  - [✔️] Status 200, updated single review object
  - [✔️] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✔️] Status 404, non existent ID, e.g. 0 or 9999
  - [✔️] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

- `GET /api/reviews`

  - [✔️] Status 200, array of review objects (including `comment_count`, excluding `body`)
  - [✔️] Status 200, default sort & order: `created_at`, `desc`
  - [✔️] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [✔️] Status 200, accepts `order` query, e.g. `?order=desc`
  - [√] Status 200, accepts `category` query, e.g. `?category=dexterity`
    - `You could add an extra assertion inside this test that the category for all the reviews is whatever is passed through the query. Remember this is to filter the reviews by category and not sort!`
  - [✔️] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [✔️] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [✔️] Status 404. non-existent `category` query, e.g. `?category=bananas`
  - [√] Status 200. valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`
    - `You have handled this with a 404. Because the category isn't one found in the database, we could argue that we cannot filter by it and a such, should just ignore the query and send all of the reviews back anyway!`

- `GET /api/reviews/:review_id/comments`

  - [✔️] Status 200, array of comment objects for the specified review
  - [✔️] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✔️] Status 404, non existent ID, e.g. 0 or 9999
  - [√] Status 200, valid ID, but has no comments responds with an empty array of comments
    - `you have chosen to display a message, which is also fine!`

- `POST /api/reviews/:review_id/comments`

  - [✔️] Status 201, created comment object
  - [✔️] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✔️] Status 404, non existent ID, e.g. 0 or 9999
  - [✔️] Status 400, missing required field(s), e.g. no username or body properties
  - [√] Status 404, username does not exist
    - `You have a bad request but you could also handle this a not found error!`
  - [✔️] Status 201, ignores unnecessary properties

- `GET /api`

  - [✔️] Status 200, JSON describing all the available endpoints

## Routing

- [✔️] Split into api, categories, users, comments and reviews routers
- [✔️] Use `.route` for endpoints that share the same path

## Controllers

- [✔️] Name functions and variables well
- [✔️] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- Protected from SQL injection
  - [✔️] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [✔️] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [✔️] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [✔️] Use `LEFT JOIN` for comment counts

## Errors

- [✔️] Use error handling middleware functions in app and extracted to separate directory/file
- [√] Consistently use `Promise.reject` in either models _**OR**_ controllers
  - `for your validation of query keys, I would move that to the model then you can reject the promise there and only have one catch block.`

## Extra Tasks - To be completed after hosting

- `DELETE /api/comments/:comment_id`

- [✔️] Status 204, deletes comment from database
- [✔️] Status 404, non existant ID, e.g 999
- [✔️] Status 400, invalid ID, e.g "not-an-id"

`I've left these to guide you if you choose to do anymore!`

- `GET /api/users`

- [√] Status 200, responds with array of user objects

- `GET /api/users/:username`

- [√] Status 200, responds with single user object
- [√] Status 404, non existant ID, e.g 999
- [√] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [√] Status 200, updated single comment object
  - [√] Status 400, invalid ID, e.g. string of "not-an-id"
  - [√] Status 404, non existent ID, e.g. 0 or 9999
  - [√] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an review body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an review by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get reviews created in last 10 minutes
- [ ] Get: Get all reviews that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for categories

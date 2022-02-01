# NC Board Game Reviews API

## Background

This is a **back end API**. The intention here is to mimick the building of a real world backend service (such as reddit) which provides information to the front end architecture.

The main database is built with PSQL by using [node-postgres](https://node-postgres.com/).

The Live Chat is separate and built with mongoDB cloud database.

### The hosted version of this **backend API** is available at:

- https://nc-games-board.herokuapp.com/api

### This API provide data to the front end app available at:

- Front End Git Repo:
  - https://github.com/cynthiaswill/nc-board-game-reviews
- Front End hosted version:
  - https://quizzical-bohr-776a6e.netlify.app/reviews

#

## Step 1 - Setting up your project

- Tested minimum version of Node v16.13.1.
- Clone the entire repo into a local folder, type 'npm install' in terminal to install all dependencies before running the app.

```
$ git clone https://github.com/cynthiaswill/NC_Games_Board.git
$ cd NC_Games_board
$ npm install

```

- You will need to create _two_ `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are .gitignored.

- You have also been provided with a `db` folder with some data, a [setup.sql](./db/setup.sql) file and a `seeds` folder.

## Step 2 - Creating tables and Seeding

- After installed dependencies, you will need to run the following in terminal to setup database

```
$ npm run setup-dbs
```

### Creating Tables

You need to complete the provided seed function to insert the appropriate data into your database by running following scripts:

```
npm run seed
npm run seed-test
```

This will create tables
`categories`, `reviews`, `users` and `comments`.

Each category have:

- `slug` field which is a unique string that acts as the table's primary key
- `description` field which is a string giving a brief description of a given category

Each user have:

- `username` which is the primary key & unique
- `avatar_url`
- `name`

Each review have:

- `review_id` which is the primary key
- `title`
- `review_body`
- `designer`
- `review_img_url` defaults to `https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg`
- `votes` defaults to 0
- `category` field which references the slug in the categories table
- `owner` field that references a user's primary key (username)
- `created_at` defaults to the current timestamp

Each comment have:

- `comment_id` which is the primary key
- `author` field that references a user's primary key (username)
- `review_id` field that references an review's primary key
- `votes` defaults to 0
- `created_at` defaults to the current timestamp
- `body`

### You can then start the server by running:

```
$ npm start
```

You can also use

```
$ npm run dev
```

to start development server, which will automatically re-seed the data, or typing:

```
$ npm run test
```

to run test by jest, which will re-seed a pool of test data automatically.

---

## Endpoints

**Essential endpoints**

```http
GET /api/categories
GET /api/reviews/:review_id
PATCH /api/reviews/:review_id
GET /api/reviews
GET /api/reviews/:review_id/comments
POST /api/reviews/:review_id/comments
DELETE /api/comments/:comment_id
GET /api
```

```http
GET /api/users
GET /api/users/:username
PATCH /api/comments/:comment_id
```

---

All endpoints send the responses specified below in an **object**, with a **key name** of what it is that being sent. E.g.

```json
{
  "categories": [
    {
      "description": "Abstact games that involve little luck",
      "slug": "Euro games"
    },
    {
      "description": "Players attempt to uncover each other's hidden role",
      "slug": "Social deduction"
    }
  ]
}
```

---

### Essential Routes

---

#### **GET /api**

Responds with an overview of the API:

- JSON describing all the available endpoints on your API

---

#### **GET /api/categories**

Responds with:

- an array of category objects, each of which should have the following properties:
  - `slug`
  - `description`

---

#### **GET /api/reviews/:review_id**

Responds with:

- a review object, which should have the following properties:

  - `owner` which is the `username` from the users table
  - `title`
  - `review_id`
  - `review_body`
  - `designer`
  - `review_img_url`
  - `category`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this

---

#### **PATCH /api/reviews/:review_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current review's vote property by 1

  `{ inc_votes : -100 }` would decrement the current review's vote property by 100

Responds with:

- the updated review

---

#### **GET /api/reviews**

Responds with:

- an `reviews` array of review objects, each of which should have the following properties:
  - `owner` which is the `username` from the users table
  - `title`
  - `review_id`
  - `category`
  - `review_img_url`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this

Should accept queries:

- `sort_by`, which sorts the reviews by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `category`, which filters the reviews by the category value specified in the query

---

#### **GET /api/reviews/:review_id/comments**

Responds with:

- an array of comments for the given `review_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

---

#### **POST /api/reviews/:review_id/comments**

Request body accepts:

- an object with the following properties:
  - `username`
  - `body`

Responds with:

- the posted comment

---

#### **DELETE /api/comments/:comment_id**

Should:

- delete the given comment by `comment_id`

Responds with:

- status 204 and no content

---

#### **GET /api/users**

Responds with:

- an array of objects, each object should have the following property:
  - `username`

---

#### **GET /api/users/:username**

Responds with:

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

---

#### **PATCH /api/comments/:comment_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current comment's vote property by 1

  `{ inc_votes : -1 }` would decrement the current comment's vote property by 1

Responds with:

- the updated comment

---

### Adding pagination to GET /api/reviews

- Should accepts the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
- add a `total_count` property, displaying the total number of reviews (**this should display the total number of reviews with any filters applied, discounting the limit**)

---

#### Adding pagination to GET /api/reviews/:review_id/comments

Should accept the following queries:

- `limit`, which limits the number of responses (defaults to 10)
- `p`, stands for page which specifies the page at which to start (calculated using limit)

---

#### POST /api/reviews

Request body accepts:

- an object with the following properties:

  - `owner` which is the `username` from the users table
  - `title`
  - `review_body`
  - `designer`
  - `category` which is a `category` from the categories table

Responds with:

- the newly added review, with all the above properties as well as:
  - `review_id`
  - `votes`
  - `created_at`
  - `comment_count`

#### POST /api/categories

Request body accepts:

- an object in the form:

```json
{
  "slug": "category name here",
  "description": "description here"
}
```

Responds with:

- a category object containing the newly added category

#### DELETE /api/reviews/:review_id

Should:

- delete the given review by review_id

Respond with:

- status 204 and no content

#

### Extra Routes

- GET /api/users

- PATCH /api/comments/:comment_id

- Patch: Edit an review body

- Patch: Edit a comment body

- Patch: Edit a user's information

- Get: Search for an review by title

- Post: add a new user

#

### Example of requests:

- There is a file in root of this folder called `request.rest` which shows example of all requests can be sent to this API. To see the example of responce, please check overview on API route at `/api`.

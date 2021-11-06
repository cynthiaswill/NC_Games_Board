## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### ESSENTIAL GET `/api/reviews?category=children's games`

Assertion: expected 404 to equal 200

Hints:

- give a 200 status and an empty array when reviews for a category that does exist, but has no reviews is requested
- use a separate model to check whether the category exists


### ESSENTIAL GET `/api/reviews/1/comments`

Assertion: expected 404 to equal 200

Hints:

- return 200: OK when the article exists
- serve an empty array when the article exists but has no comments

### ESSENTIAL POST `/api/reviews/10000/comments`

Assertion: expected 400 to be one of [ 404, 422 ]

Hints:

- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid article ID that does not exist

### ESSENTIAL POST `/api/reviews/1/comments`

Assertion: expected 400 to be one of [ 404, 422 ]

Hints:

- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid username that does not exist

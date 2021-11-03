const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('app', () => {
    test('test status 404 invalid url route', () => {
        return request(app)
            .get('/api/bad_route')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid path');
            });
    });

    describe('GET /api/categories', () => {
        test('status 200 returns all categories correctly', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({ body }) => {
                    expect(body.categories).toHaveLength(4);
                    body.categories.forEach((category) => {
                        expect(category).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    })
                })
        })
    })

    describe('GET /api/reviews/:review_id', () => {
        test('status 200 returns get review by id correctly', () => {
            return request(app)
                .get('/api/reviews/2')
                .expect(200)
                .then(({ body }) => {
                    expect(body.review.review_id).toBe(2);
                    expect(body.review.comment_count).toBe('3');
                    expect(body.review).toEqual({
                            review_id: 2,
                            title: 'Jenga',
                            review_body: 'Fiddly fun for all the family',
                            designer: 'Leslie Scott',
                            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                            votes: 5,
                            category: 'dexterity',
                            owner: 'philippaclaire9',
                            created_at: '2021-01-18T10:01:41.251Z',
                            comment_count: '3'
                    });
                })
        });

        test('status 404 review_id = 9999 does not exist in database', () => {
            return request(app)
                .get('/api/reviews/9999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('This review does not exist!')
                })
        })

        test('status 400 bad request invalid review_id', () => {
            return request(app)
                .get('/api/reviews/not_a_review_id')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request or invalid input')
                })
        })

        test('status 200 get review by id when there is no comment to count', () => {
            return request(app)
                .get('/api/reviews/13')
                .expect(200)
                .then(({ body }) => {
                    expect(body.review.review_id).toBe(13);
                    expect(body.review.comment_count).toBe('0');
                    expect(body.review).toEqual({
                        review_id: 13,
                        title: "Settlers of Catan: Don't Settle For Less",
                        review_body: 'You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.',
                        designer: 'Klaus Teuber',
                        review_img_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
                        votes: 16,
                        category: 'social deduction',
                        owner: 'mallionaire',
                        created_at: '1970-01-10T02:08:38.400Z',
                        comment_count: '0'
                      });
                })
        });
    })
        
    describe(`PATCH /api/reviews/:review_id`, () => {
        test(`status 200 returns patched review with votes correctly`, () => {
            return request(app)
                .patch(`/api/reviews/2`)
                .send({ "inc_votes": -100 })
                .expect(200)
                .then( ({ body }) => {
                    expect(body.review).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                        review_body: 'Fiddly fun for all the family',
                        designer: 'Leslie Scott',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        votes: -95,
                        category: 'dexterity',
                        owner: 'philippaclaire9',
                        created_at: '2021-01-18T10:01:41.251Z'
                      })
                })
        })

        test(`status 400 no inc_votes key on request body in patch request`, () => {
            return request(app)
                .patch(`/api/reviews/2`)
                .send({ })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request or invalid input');
                }) 
        })

        test(`status 400 invalid inc_votes value on request body in patch request`, () => {
            return request(app)
                .patch(`/api/reviews/2`)
                .send({ inc_votes: 'not-valid' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request or invalid input');
                }) 
        })

        test(`status 200 with some extra other property(which will be ignored) appear on request body in patch request`, () => {
            return request(app)
                .patch(`/api/reviews/2`)
                .send({ inc_votes : 1, name: 'Mitch' })
                .expect(200)
                .then( ({ body }) => {
                    expect(body.review).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                        review_body: 'Fiddly fun for all the family',
                        designer: 'Leslie Scott',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        votes: 6,
                        category: 'dexterity',
                        owner: 'philippaclaire9',
                        created_at: '2021-01-18T10:01:41.251Z'
                      })
                })
        })

        test('status 404 review_id = 9999 does not exist in database', () => {
            return request(app)
                .patch('/api/reviews/9999')
                .send({ "inc_votes": 3 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('This review does not exist!')
                })
        })

        test('status 400 bad request invalid review_id', () => {
            return request(app)
                .patch('/api/reviews/not_a_review_id')
                .send({ "inc_votes": 3 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request or invalid input')
                })
        })
    }) 
    
    describe('GET /api/reviews', () => {
        test('status 200 returns all reviews correctly default to desc by date', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({ body }) => {
                    expect(body.reviews).toHaveLength(13);
                    expect(body.reviews).toBeSortedBy('created_at', { descending: true })
                    body.reviews.forEach((review) => {
                        expect(review).toMatchObject({
                            title: expect.any(String),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            review_body: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            review_id: expect.any(Number),
                            comment_count: expect.any(String)
                        })
                    })
                })
        })
    }) 
   

})
    

const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');
const { string } = require('pg-format');

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

    describe('/api/categories', () => {
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

    describe('/api/reviews', () => {
        test('status 200 returns all reviews correctly', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({ body }) => {
                    expect(body.reviews).toHaveLength(13);
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
                            review_id: expect.any(Number)
                        })
                    })
                })
        })
    })

    describe('/api/reviews/:review_id', () => {
        test('status 200 returns get review by id correctly', () => {
            return request(app)
                .get('/api/reviews/2')
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toEqual({
                            review_id: 2,
                            title: 'Jenga',
                            review_body: 'Fiddly fun for all the family',
                            designer: 'Leslie Scott',
                            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                            votes: 5,
                            category: 'dexterity',
                            owner: 'philippaclaire9',
                            created_at: '2021-01-18T10:01:41.251Z'
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
    })
    

})
    

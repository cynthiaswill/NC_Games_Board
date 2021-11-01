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


})
    

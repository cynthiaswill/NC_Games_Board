const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app')

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



})
    

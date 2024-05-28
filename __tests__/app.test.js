
const db = require('../db/connection.js')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index.js')

const {app, countEndpoints} = require('../app')

beforeEach(() => seed(testData))

afterAll(() => db.end())

describe('GET: /api/topics', () => {
    test('should return an array of topics with slug and description properties and 200 status', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
            expect(body.topics).toHaveLength(3)
        })
    });
});

describe('GET /api', () => {
    test('should return an object with the current endpoint data, including a description, queries, example response and format for the request body', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(Object.values(body.endpoints)).toHaveLength(countEndpoints())
            Object.values(body.endpoints).forEach((endpoint) => {
                expect(endpoint).toMatchObject({
                    description: expect.any(String),
                    queries: expect.any(Array),
                    exampleResponse: expect.any(Object),
                    requestBody: expect.any(Object)
                })
            })
        })
    });
});

describe('All Endpoints', () => {
    test('should return a 404 Not Found if given an invalid route', () => {
        return request(app)
        .get('/api/topic')
        .expect(404)
    });
});
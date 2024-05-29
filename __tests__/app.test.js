
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
    test('should return an object with the current endpoint data, including a description, queries, example response and format for the request body and 200 status', () => {
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

describe('GET: /api/articles/:article_id', () => {
    test('should return the article by id with the correct properties and 200 status', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
        })
    });
    test('should return a 400 Invalid Input if given an invalid id', () => {
        return request(app)
        .get('/api/articles/invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return a 404 Not Found if the id can\'t be found', () => {
        return request(app)
        .get('/api/articles/20')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist')
        })
    });
});

describe('GET: /api/articles', () => {
    test('should return an array of articles with the correct properties, comment count and 200 status', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
                expect(article.body).toBe(undefined)
            })
            expect(body.articles).toHaveLength(13)
        })
    });
    test('should be sorted by date, descending', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('should return an array of comments for a given article id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(11)
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    article_id: 1,
                    author: expect.any(String),
                    body: expect.any(String)
                })
            })
        })
    });
    test('should return a 400 Invalid Input if given an invalid id', () => {
        return request(app)
        .get('/api/articles/invalid/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return a 404 Article Does Not Exist if the id can\'t be found', () => {
        return request(app)
        .get('/api/articles/20/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist')
        })
    });
    test('should return a 200 and empty array if the article passed has no comments', () => {
        return request(app)
        .get('/api/articles/4/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([])
        })
    });
    test('should be sorted with most recent comments first, date descending', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeSortedBy('created_at', {descending:true})
        })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('should return a 201 and the posted comment on success', () => {
        const newComment = {
            body: "This morning, I showered for nine minutes.", 
            username: "butter_bridge"}
        return request(app)
        .post('/api/articles/1/comments')
        .expect(201)
        .send(newComment)
        .then(({body}) => {
                expect(body.comment).toMatchObject({
                    comment_id: 19,
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    article_id: 1,
                    author: "butter_bridge",
                    body: "This morning, I showered for nine minutes."
                })
        })
    });
    test('should return a 400 Invalid Input if given an invalid id', () => {
        const newComment = {
            body: "This morning, I showered for nine minutes.", 
            username: "butter_bridge"}
        return request(app)
        .post('/api/articles/invalid/comments')
        .expect(400)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return a 404 Article Does Not Exist if the id can\'t be found', () => {
        const newComment = {
            body: "This morning, I showered for nine minutes.", 
            username: "butter_bridge"}
        return request(app)
        .post('/api/articles/20/comments')
        .expect(404)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist')
        })
    });
    test('should return a 400 Invalid Request Body when the request body is missing the body or username', () => {
        const newComment = {
            username: "butter_bridge"}
        return request(app)
        .post('/api/articles/1/comments')
        .expect(400)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
    test('should return a 201 and the posted article when the request body has extra keys', () => {
        const newComment = {
            body: "This morning, I showered for nine minutes.", 
            username: "butter_bridge",
            extraKey: "extraKey"}
        return request(app)
        .post('/api/articles/1/comments')
        .expect(201)
        .send(newComment)
        .then(({body}) => {
            expect(body.comment).toMatchObject({
                    comment_id: 19,
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    article_id: 1,
                    author: "butter_bridge",
                    body: "This morning, I showered for nine minutes."
                })
        })
    });
    test('should return a 404: User Not Found if the username doesn\'t exist', () => {
        const newComment = {
            body: "This morning, I showered for nine minutes.", 
            username: "butter"}
        return request(app)
        .post('/api/articles/2/comments')
        .expect(404)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('User Not Found')
        })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('should update the article votes with an increase in votes by id and return the updated article', () => {
        const newVotes = { inc_votes: 10 }
        return request(app)
        .patch('/api/articles/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T19:11:00.000Z",
                votes: 110,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    });
    test('should update the article votes with a decrease in votes by id and return the updated article', () => {
        const newVotes = { inc_votes: -20 }
        return request(app)
        .patch('/api/articles/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T19:11:00.000Z",
                votes: 80,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    });
    test('should update the article votes to 0 if the decrease is larger than the amount of votes and return the updated article', () => {
        const newVotes = { inc_votes: -200 }
        return request(app)
        .patch('/api/articles/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T19:11:00.000Z",
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    });
    test('should return a 400 Invalid Input if given an invalid id', () => {
        const newVotes = { inc_votes: 30 }
        return request(app)
        .patch('/api/articles/invalid')
        .expect(400)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return a 404 Article Does Not Exist if the id can\'t be found', () => {
        const newVotes = { inc_votes: 30 }
        return request(app)
        .patch('/api/articles/20')
        .expect(404)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist')
        })
    });
    test('should return a 400 Invalid Request Body when the request body is missing the inc_votes', () => {
        const newVotes = { votes: 30 }
        return request(app)
        .patch('/api/articles/1')
        .expect(400)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
    test('should return a 200 and the updated article when the request body has additional properties', () => {
        const newVotes = { inc_votes: 30, extraKey: "extraKey" }
        return request(app)
        .patch('/api/articles/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T19:11:00.000Z",
                votes: 130,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    });
    test('should return a 400 Invalid Request Body if inc_votes is not a number', () => {
        const newVotes = { votes: 'hello' }
        return request(app)
        .patch('/api/articles/1')
        .expect(400)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
})

describe('DELETE /api/comments/:comment_id', () => {
    test('should delete a comment by its id and return a 204 and no content', () => {
        return request(app)
        .delete('/api/comments/4')
        .expect(204)
    });
    test('should return a 400 Invalid Input if given an invalid comment id', () => {
        return request(app)
        .delete('/api/comments/invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return a 404 Comment Not Found if the comment_id does not exist', () => {
        return request(app)
        .delete('/api/comments/50')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
    });
});

describe('All Endpoints', () => {
    test('should return a 404 Not Found if given an invalid route', () => {
        return request(app)
        .get('/api/invalid')
        .expect(404)
    });
});


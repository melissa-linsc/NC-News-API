
const db = require('../db/connection.js')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')

const {app} = require('../app')
const apiRouter = require('../routes/api-router.js')

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
            const expectedLength = Object.keys(endpoints).length
            const actualLength = Object.keys(body.endpoints).length
            
            expect(actualLength).toBe(expectedLength)
            
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
                    article_img_url: expect.any(String),
                    comment_count: 11
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
            expect(body.articles).toHaveLength(10)
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

describe('GET /api/articles?topic', () => {
    test('topic query should filter for the topic chosen', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(1)
            body.articles.forEach((article) => {
                expect(article.topic).toBe('cats')
            })
        })
    });
    test('should return an empty array if there are no articles for the chosen topic', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([])
        })
    });
    test('should return a 404 Topic Not Found if the topic is not found', () => {
        return request(app)
        .get('/api/articles?topic=sports')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Topic Not Found')
        })
    });
});

describe('GET /api/articles?sort_by', () => {
    test('should return a 200 and sort by the query passed', () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('votes', {descending: true})
        })
    });
    test('should return a 400 Invalid Query if the sortBy query is not valid', () => {
        return request(app)
        .get('/api/articles?sort_by=hello')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Query')
        })
    });
});

describe('GET /api/articles?order', () => {
    test('should return a 200 and order by asc or desc', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {ascending: true})
        })
    });
    test('should return a 400 Invalid Query if the order query is not valid', () => {
        return request(app)
        .get('/api/articles?order=hello')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Query')
        })
    });
});

describe('GET /api/articles?order&sort_by', () => {
    test('should return a 200 with the correct order and sort_by when passed both queries', () => {
        return request(app)
        .get('/api/articles?order=asc&sort_by=title')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('title', {ascending: true})
        })
    });
    test('should return a 400 if either the order or sort by query is not valid', () => {
        return request(app)
        .get('/api/articles?order=asc&sort_by=banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Query')
        })
    });
});

describe('GET /api/articles?limit', () => {
    test('should take a limit query and return the limit number of articles', () => {
        return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(5)
            expect(body.total_count).toBe(5)
        })
    });
    test('should take a limit query and return all the articles if the limit is greater than the number of articles', () => {
        return request(app)
        .get('/api/articles?limit=15')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            expect(body.total_count).toBe(13)
        })
    });
    test('should return a 400 Invalid Input if the limit is an invalid type', () => {
        return request(app)
        .get('/api/articles?limit=banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
});

describe('GET /api/articles?p', () => {
    test('should take a p query and return the correct page of article based on the limit (default 10)', () => {
        return request(app)
        .get('/api/articles?p=2&sort_by=article_id&order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(3)
            expect(body.total_count).toBe(3)
            expect(body.articles[0].article_id).toBe(11)
        })
    });
    test('should take a p query and return the correct page of article based on the limit of 3', () => {
        return request(app)
        .get('/api/articles?p=3&limit=3&sort_by=article_id&order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(3)
            expect(body.total_count).toBe(3)
            expect(body.articles[0].article_id).toBe(7)
        })
    });
    test('should return 400 Invalid Input if the page query if the wrong data type', () => {
        return request(app)
        .get('/api/articles?p=banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should take a p query and return an empty array if the page has no articles', () => {
        return request(app)
        .get('/api/articles?p=5')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([])
            expect(body.total_count).toBe(0)
        })
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('should return an array of comments for a given article id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(10)
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

describe('GET /api/articles/:article_id/comments?limit', () => {
    test('should return the limit number of comments for an article', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=2')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(2)
        })
    });
    test('should return all comments if the limit is greater than the number of comments', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=30')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(11)
        })
    });
    test('should return 400 Invalid Input if the limit query is invalid', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
});

describe('GET /api/articles/:article_id/comments?p', () => {
    test('should return the correct page of comments for an article', () => {
        return request(app)
        .get('/api/articles/1/comments?p=2')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(1)
        })
    });
    test('should return 400 Invalid Input if the page query is invalid', () => {
        return request(app)
        .get('/api/articles/1/comments?p=banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return the correct page of comments for an article with a limit', () => {
        return request(app)
        .get('/api/articles/1/comments?p=3&limit=3')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(3)
            expect(body.comments[0].comment_id).toBe(6)
            expect(body.comments[1].comment_id).toBe(12)
            expect(body.comments[2].comment_id).toBe(3)
        })
    });
    test('should return an empty array if the page has no comments', () => {
        return request(app)
        .get('/api/articles/1/comments?p=10')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([])
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
                created_at: "2020-07-09T20:11:00.000Z",
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
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 80,
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
                created_at: "2020-07-09T20:11:00.000Z",
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

describe('GET /api/users', () => {
    test('should return 200 and an array of all users with their username, name and avatar url', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
            expect(body.users).toHaveLength(4)
        })
    });
});

describe('GET /api/users/:username', () => {
    test('should return a 200 with the user by the username passed', () => {
        return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then(({body})=> {
            expect(body.user).toMatchObject({
                username: 'rogersop',
                name: 'paul',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            })
        })
    });
    test('should return a 404 User Not Found if the username cannot be found', () => {
        return request(app)
        .get('/api/users/banana')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('User Not Found')
        })
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    test('should return a 200 and the updated comment with the increase in votes', () => {
        const newVotes = { inc_votes: 30 }
        return request(app)
        .patch('/api/comments/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedComment).toMatchObject({
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 46,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: '2020-04-06T12:17:00.000Z',
            })
        })
    });
    test('should return a 200 with the decrease in votes', () => {
        const newVotes = { inc_votes: -20 }
        return request(app)
        .patch('/api/comments/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedComment).toMatchObject({
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: -4,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: '2020-04-06T12:17:00.000Z',
            })
        })
    });
    test('should return a 404 Comment Not Found if the comment_id is valid but not found', () => {
        const newVotes = { inc_votes: 20 }
        return request(app)
        .patch('/api/comments/100')
        .expect(404)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
    });
    test('should return a 400 Invalid Input if the comment_id is not valid', () => {
        const newVotes = { inc_votes: 20 }
        return request(app)
        .patch('/api/comments/banana')
        .expect(400)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    });
    test('should return a 400 Invalid Request Body if the inc_votes is missing', () => {
        const newVotes = { votes: 20 }
        return request(app)
        .patch('/api/comments/1')
        .expect(400)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
    test('should return a 400 Invalid Request Body if the inc_votes of wrong data type', () => {
        const newVotes = { inc_votes: 'hello' }
        return request(app)
        .patch('/api/comments/1')
        .expect(400)
        .send(newVotes)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
    test('should return a 200 and the updated comment if there are extra keys', () => {
        const newVotes = { inc_votes: -20,
            extraKey: "extraKey"
         }
        return request(app)
        .patch('/api/comments/1')
        .expect(200)
        .send(newVotes)
        .then(({body}) => {
            expect(body.updatedComment).toMatchObject({
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: -4,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: '2020-04-06T12:17:00.000Z',
            })
        })
    });
});

describe('POST /api/articles', () => {
    test('should return a 200 with the new article and correct properties', () => {
        const newComment = {
            author: 'lurker',
            title: 'CATS!!',
            body: 'I like cats',
            topic: 'cats',
            article_img_url: "url"
        }

        return request(app)
        .post('/api/articles')
        .expect(200)
        .send(newComment)
        .then(({body}) => {
            expect(body.newArticle).toMatchObject({
                article_id: 14,
                author: 'lurker',
                title: 'CATS!!',
                body: 'I like cats',
                topic: 'cats',
                article_img_url: "url",
                comment_count: 0,
                votes: 0,
                created_at: expect.any(String)
            })
        })
    });
    test('article_img_url should default if not provided', () => {
        const newComment = {
            author: 'lurker',
            title: 'CATS!!',
            body: 'I like cats',
            topic: 'cats'
        }

        return request(app)
        .post('/api/articles')
        .expect(200)
        .send(newComment)
        .then(({body}) => {
            expect(body.newArticle).toMatchObject({
                article_id: 14,
                author: 'lurker',
                title: 'CATS!!',
                body: 'I like cats',
                topic: 'cats',
                article_img_url: expect.any(String),
                comment_count: 0,
                votes: 0,
                created_at: expect.any(String)
            })
        })
    });
    test('should return a 200 with the new article and correct properties if extra keys are provided on the request body', () => {
        const newComment = {
            author: 'lurker',
            title: 'CATS!!',
            body: 'I like cats',
            topic: 'cats',
            article_img_url: "url",
            extraKey: "extraKey"
        }

        return request(app)
        .post('/api/articles')
        .expect(200)
        .send(newComment)
        .then(({body}) => {
            expect(body.newArticle).toMatchObject({
                article_id: 14,
                author: 'lurker',
                title: 'CATS!!',
                body: 'I like cats',
                topic: 'cats',
                article_img_url: "url",
                comment_count: 0,
                votes: 0,
                created_at: expect.any(String)
            })
        })
    });
    test('should return a 400 Invalid Request Body if the request body is missing requiredKeys ', () => {
        const newComment = {
            author: 'lurker',
            title: 'CATS!!',
            body: 'I like cats',
        }

        return request(app)
        .post('/api/articles')
        .expect(400)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
    test('should return a 404 User Not Found if the author cannot be found', () => {
        const newComment = {
            author: 'banana',
            title: 'CATS!!',
            body: 'I like cats',
            topic: 'cats',
            article_img_url: "url"
        }

        return request(app)
        .post('/api/articles')
        .expect(404)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('User Not Found')
        })
    });
    test('should return a 404 Topic Not Found if the topic cannot be found', () => {
        const newComment = {
            author: 'lurker',
            title: 'CATS!!',
            body: 'I like cats',
            topic: 'apple',
            article_img_url: "url"
        }

        return request(app)
        .post('/api/articles')
        .expect(404)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe('Topic Not Found')
        })
    });
});

describe('POST /api/topics', () => {
    test('should add a new topic to topics and return the added topic', () => {
        const newTopic = {
            slug: "topic name here",
            description: "description here"
          }
        return request(app)
        .post('/api/topics')
        .expect(200)
        .send(newTopic)
        .then(({body}) => {
            expect(body.newTopic).toEqual({
                slug: "topic name here",
                description: "description here"
            })
        })
    });
    test('should add a new topic to topics and return the added topic if there are extra keys', () => {
        const newTopic = {
            slug: "topic name here",
            description: "description here",
            extraKey: "extraKey"
          }
        return request(app)
        .post('/api/topics')
        .expect(200)
        .send(newTopic)
        .then(({body}) => {
            expect(body.newTopic).toEqual({
                slug: "topic name here",
                description: "description here"
            })
        })
    });
    test('should return a 400 Invalid Request Body when required keys are missing', () => {
        const newTopic = {
            slug: "topic name here"
          }
        return request(app)
        .post('/api/topics')
        .expect(400)
        .send(newTopic)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Request Body')
        })
    });
});

describe('DELETE /api/articles/:article_id', () => {
    test('should delete an article by id and return a 404', () => {
        return request(app)
        .delete('/api/articles/1')
        .expect(204)
    });
    test('should delete the associated comments', () => {
        return request(app)
        .delete('/api/articles/1')
        .expect(204)
        .then(() => {
            return db.query('SELECT * FROM comments;')
        })
        .then((comments) => {
            expect(comments.rows).toHaveLength(7)
            comments.rows.forEach((comment) => {
                expect(comment.article_id).not.toBe(1)
            })
        })
    });
    test('should return a 404 Article Not Found if the article does not exist', () => {
        return request(app)
        .delete('/api/articles/100')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Not Found')
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


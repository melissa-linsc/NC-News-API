const format = require("pg-format");
const db = require("../db/connection");
const {selectUserByUsername} = require('../models/users-model');
const { checkTopicExists } = require('./topics-model')

const selectArticleById = (id) => {

    const sqlQuery = `SELECT 
    articles.*,
    COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id ORDER BY articles.created_at DESC;`

    return db.query(sqlQuery, [id]).then((res) => {
        if(res.rows.length) {
            return res.rows[0]
        }
        else {
            return Promise.reject({status: 404, msg: 'Article Does Not Exist'})
        }
    })
}

const selectArticles = (topic, sortBy = 'created_at', order = 'desc', limit = 10, page = 1) => {

    const validSortBys = ['article_id', 'author', 'title', 'topic', 'created_at', 'votes', 'comment_count']

    const validOrders = ['asc', 'desc']

    let sqlQuery = `SELECT 
    articles.article_id, 
    articles.author, 
    articles.title, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    const queryParams = []

    if (topic) {
        sqlQuery += ` WHERE articles.topic = $1`
        queryParams.push(topic)
    }

    sqlQuery += ` GROUP BY articles.article_id` 

    if (validSortBys.includes(sortBy) && validOrders.includes(order)) {
        sqlQuery += ` ORDER BY articles.${sortBy} ${order}` 
    }
    else {
        return Promise.reject({status: 400, msg: "Invalid Query"})
    }

    const offset = (page - 1) * limit

    if (topic) {
        sqlQuery += ` LIMIT $2 OFFSET $3;`
        queryParams.push(limit, offset)
    }
    else {
        sqlQuery += ` LIMIT $1 OFFSET $2;`
        queryParams.push(limit, offset)
    }
    
    const articlesAndTopics = [db.query(sqlQuery, queryParams), checkTopicExists(topic) ]

    return Promise.all(articlesAndTopics)
    .then(([articles, topic]) => {
        return articles.rows
    })
}

const selectCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
        if (article.rows.length) {
            return db.query(`SELECT * FROM comments WHERE article_id = $1
            ORDER BY created_at DESC`, [id]) 
        }
        else {
            return Promise.reject({status: 404, msg: 'Article Does Not Exist'})
        }
    })
    .then((comments) => {
        return comments.rows
    })
}

const insertCommentByArticleId = (id, values, newComment) => {
    
    if (!newComment.body || !newComment.author) {
        return Promise.reject({status:400, msg: 'Invalid Request Body'})
    }
    
    const articlesAndUsers = [db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]), selectUserByUsername(newComment.author)]

    return Promise.all(articlesAndUsers)
    .then(([article, users]) => {
 
        if (article.rows.length) {
            return db.query(
                format( `INSERT INTO comments  
                (body, votes, article_id, author)
                VALUES %L
                RETURNING *`, values))
        }
        else {
            return Promise.reject({status: 404, msg: 'Article Does Not Exist'})
        }
    })
    .then((res) => {
        return res.rows[0]
    })
}

const updateArticle = (id, newVotes, requestBody) => {
    
    if (!requestBody.inc_votes) {
        return Promise.reject({status:400, msg: 'Invalid Request Body'})
    }

    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
        if (article.rows.length) {
            return db.query(
               `UPDATE articles  
                SET votes = votes + $1
                WHERE article_id = $2
                RETURNING *`, [newVotes, id])
        }
        else {
            return Promise.reject({status: 404, msg: 'Article Does Not Exist'})
        }
    })
    .then((res) => {
        return res.rows[0]
    })
}

const insertArticle = (values, requestBody) => {
    
    const requiredKeys = ['author', 'title', 'body', 'topic']
    
    if (!requiredKeys.every(key => Object.keys(requestBody).includes(key))) {
        return Promise.reject({status: 400, msg: 'Invalid Request Body'})
    }

    const topic = requestBody.topic
    const author = requestBody.author

    const articlesUsersTopics = [
    selectUserByUsername(author),
    checkTopicExists(topic),
    db.query(format( `INSERT INTO articles 
    (author, title, body, topic, article_img_url, votes)
    VALUES %L
    RETURNING *`, values))
    ]

    return Promise.all(articlesUsersTopics)
    .then(([user,topics,article]) => {
        return article.rows[0]
    })
}


module.exports = {
    selectArticleById,
    selectArticles, selectCommentsByArticleId,
    insertCommentByArticleId,
    updateArticle,
    insertArticle
}
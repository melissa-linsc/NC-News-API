const format = require("pg-format");
const db = require("../db/connection");

const selectArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((res) => {
        if(res.rows.length) {
            return res.rows[0]
        }
        else {
            return Promise.reject({status: 404, msg: 'Article Does Not Exist'})
        }
    })
}

const selectArticles = () => {
    return db.query(`SELECT 
    articles.article_id, 
    articles.author, 
    articles.title, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`).then((res) => {
        return res.rows
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

const insertCommentByArticleId = (id, values) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
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

const updateArticle = (id, newVotes) => {
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


module.exports = {
    selectArticleById,
    selectArticles, selectCommentsByArticleId,
    insertCommentByArticleId,
    updateArticle
}
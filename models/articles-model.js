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

module.exports = {selectArticleById, selectArticles}
const format = require("pg-format");
const db = require("../db/connection");

const selectArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((res) => {
        if(res.rows.length) {
            return res.rows[0]
        }
        else {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
    })
}

module.exports = selectArticleById
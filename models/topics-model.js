const format = require("pg-format");
const db = require("../db/connection");

const selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((res) => {
        return res.rows
    })
}

const checkTopicExists = (topic) => {
  
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((res) => {
        if (!res.rows.length && topic) {
            return Promise.reject({status: 404, msg: "Topic Not Found" })
        }
    })
}

const insertTopic = (values, requestBody) => {
    
    if (!requestBody.slug || !requestBody.description) {
        return Promise.reject({status: 400, msg: 'Invalid Request Body'})
    }

    return db.query(format(`INSERT INTO topics
    (slug, description)
    VALUES %L
    RETURNING *`, values)).then((res) => {
        return res.rows[0]
    })
}

module.exports = {selectTopics, checkTopicExists, insertTopic}
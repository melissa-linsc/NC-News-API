const format = require("pg-format");
const db = require("../db/connection");

const selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((res) => {
        return res.rows
    })
}

const checkTopicExists = (topic) => {
  
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]).then((res) => {
        if (topic && !isNaN(topic)) {
            return Promise.reject({status: 400, msg: "Invalid Input" })
        }
        else if (!res.rows.length && topic) {
            return Promise.reject({status: 404, msg: "Topic Not Found" })
        }
    })
}

module.exports = {selectTopics, checkTopicExists}
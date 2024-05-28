const format = require("pg-format");
const db = require("../db/connection");

const selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((res) => {
        return res.rows
    })
}

selectTopics()

module.exports = selectTopics
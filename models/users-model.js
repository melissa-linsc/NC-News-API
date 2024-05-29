const db = require("../db/connection");

const checkUserExists = (user) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [user]).then((res) => {
        if (!res.rows.length) {
            return Promise.reject({status: 404, msg: "User Not Found" })
        }
    })
}

module.exports = checkUserExists
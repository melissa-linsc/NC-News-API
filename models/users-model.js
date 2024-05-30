const db = require("../db/connection");

const selectUsers = () => {
    return db.query('SELECT * FROM users').then((res) => {
        return res.rows
    })
}

const selectUserByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then((res) => {
        if (!res.rows.length) {
            return Promise.reject({status: 404, msg: 'User Not Found'})
        }
        else {
            return res.rows[0]
        }
    })
}

module.exports = {selectUsers, selectUserByUsername}

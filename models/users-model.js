const db = require("../db/connection");
const format = require("pg-format");

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

const insertUsers = (values, requestBody) => {

    const requiredKeys = ['username', 'name']
    
    if (!requiredKeys.every(key => Object.keys(requestBody).includes(key))) {
        return Promise.reject({status: 400, msg: 'Invalid Request Body'})
    }

    return db.query(format( `INSERT INTO users 
        (username, name, avatar_url)
        VALUES %L
        RETURNING *`, [values]))
        .then((res) => {
            return res.rows[0]
        })
}

module.exports = {selectUsers, selectUserByUsername, insertUsers}

const dbPool = require('../config/users-database.js');


const createNewUser = (body) => {
    const SQLQuery =    `INSERT INTO users (fullname, username, email, password) 
                        VALUE (?, ?, ?, ?)`;
    return dbPool.execute(SQLQuery, [body.fullname, body.username, body.email, body.password]);
}

const getAllUsers = () => {
   const SQLQuery = 'SELECT id, fullname, username, email FROM users';
   return dbPool.execute(SQLQuery);
}

const getUser = (id) => {
    const SQLQuery = `SELECT id, fullname, username, email FROM users WHERE id = ?`;
    return dbPool.execute(SQLQuery, [id]);
}

const getUserByName = (username) => {
    const SQLQuery = `SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1`;
    return dbPool.execute(SQLQuery, [username, username]);
}

module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    getUserByName
}
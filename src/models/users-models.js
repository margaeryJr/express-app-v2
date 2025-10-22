const dbPool = require('../config/users-database.js');


const createNewUser = (body) => {
    const SQLQuery =    `INSERT INTO users (fullname, username, email, password, verify_token, is_verified) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
    return dbPool.execute(SQLQuery, [
        body.fullname, 
        body.username, 
        body.email, 
        body.password,
        body.verify_token,
        body.is_verified
    ]);
}

const findUserByVerifyToken = (token) => {
  const SQLQuery = `SELECT * FROM users WHERE verify_token = ?`;
  return dbPool.execute(SQLQuery, [token]);
}

const verifyUser = (id) => {
  const SQLQuery = `
    UPDATE users 
    SET is_verified = 1, verify_token = NULL 
    WHERE id = ?
  `;
  return dbPool.execute(SQLQuery, [id]);
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
    findUserByVerifyToken,
    verifyUser,
    getAllUsers,
    getUser,
    getUserByName
}
const dbPool = require('../config/users-database.js');


const createNewUser = (body) => {
    const SQLQuery =    `INSERT INTO users (fullname, username, email, password) 
                        VALUE (?, ?, ?, ?)`;
    return dbPool.execute(SQLQuery, [body.fullname, body.username, body.email, body.password]);
}

const getAllUsers = () => {
   const SQLQuery = 'SELECT * FROM users';
   return dbPool.execute(SQLQuery);
}

const getUser = (id) => {
    const SQLQuery = `SELECT * FROM users
                        WHERE id=${id}`;
    return dbPool.execute(SQLQuery, [id]);
}

const updateUser = (body, id) => {
    const SQLQuery = `UPDATE users 
                    SET name='${body.name}', email='${body.email}' 
                    WHERE id=${id}`;
    return dbPool.execute(SQLQuery);
}

const deleteUser = (id) => {
    const SQLQuery = `DELETE FROM users
                        WHERE id=${id}`;
    return dbPool.execute(SQLQuery);
}
module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
}
const dbPool = require('../config/movies-database.js');

const getMovies = ({ search, sort, limit, order }) => {
 
  let SQLQuery = `SELECT id, title, genre FROM movies WHERE 1=1`;
  const params = [];

  // search
  if (search) {
    SQLQuery += ` AND (title LIKE ? OR genre LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  // sorting
  const sortColumn = sort && ['title', 'genre'].includes(sort)
    ? sort
    : 'id'; 

  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  SQLQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;

  // limit
  if (limit) {
    SQLQuery += ` LIMIT ?`;
    params.push(parseInt(limit));
  }

  return dbPool.execute(SQLQuery, params);
};

module.exports = {
  getMovies
};

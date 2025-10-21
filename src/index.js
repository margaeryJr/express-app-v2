require('dotenv').config()
const PORT = process.env.PORT;
const express = require('express');
const usersRoutes = require('./routes/users-routes.js');
const movieRoutes = require('./routes/movies-routes.js');
const middlewareLogRequest = require('./middleware/logs.js');
const app = express();

app.use(middlewareLogRequest);

app.use(express.json());

app.use('/users', usersRoutes);

app.use('/movies', movieRoutes);

app.listen(PORT, () => {
    console.log(`Server running in PORT ${PORT}`);
})
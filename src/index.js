require('dotenv').config()
const PORT = process.env.PORT;
const express = require('express');
const usersRoutes = require('./routes/users-routes.js');
const middlewareLogRequest = require('./middleware/logs.js');
const app = express();

app.use(middlewareLogRequest);

app.use(express.json());

app.use('/', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server running in PORT ${PORT}`);
})
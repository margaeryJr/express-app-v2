const express = require('express');
const movieController = require('../controllers/movies-controller.js');
const router = express.Router();

router.get('/', movieController.getMovies);


module.exports = router;
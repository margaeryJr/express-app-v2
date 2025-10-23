const express = require('express');
const movieController = require('../controllers/movies-controller.js');
const authMiddleware = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');
const router = express.Router();

router.get('/', movieController.getMovies);
router.post('/upload', upload.single('image'), movieController.uploadImage);



module.exports = router;
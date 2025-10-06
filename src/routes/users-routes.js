const express = require('express');
const userController = require('../controllers/users-controllers.js');
const router = express.Router();

// CREATE
router.post('/register', userController.createNewUser);

// READ
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);

// UPDATE
router.patch('/:id', userController.updateUser);

// DELETE
router.delete('/:id', userController.deleteUser);

module.exports = router;
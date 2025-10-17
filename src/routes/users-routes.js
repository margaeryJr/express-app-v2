const express = require('express');
const userController = require('../controllers/users-controllers.js');
const authMiddleware = require('../middleware/auth.js');
const adminMiddleware = require('../middleware/admin.js');
const router = express.Router();


router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Ini route proteksi', user: req.user });
});
router.post('/login', userController.loginUser);
router.get('/:id', authMiddleware, userController.getUser);
router.post('/register', userController.createNewUser);



module.exports = router;
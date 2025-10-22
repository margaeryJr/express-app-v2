const express = require('express');
const userController = require('../controllers/users-controllers.js');
const authMiddleware = require('../middleware/auth.js');
const adminMiddleware = require('../middleware/admin.js');
const router = express.Router();


router.post('/register', userController.createNewUser);
router.get('/verify', userController.verifyEmail);
router.post('/login', userController.loginUser);

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Ini route proteksi', user: req.user });
});

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUser);





module.exports = router;
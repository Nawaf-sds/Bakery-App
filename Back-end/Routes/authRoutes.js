


const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyUser, 
  googleLogin 
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', protect, verifyUser); 

router.post('/google', googleLogin); 

module.exports = router;

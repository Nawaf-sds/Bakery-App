// // في ملف Routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, verifyUser } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/verify', protect, verifyUser); // ✅ مسار جديد


// module.exports = router;


const express = require('express');
const router = express.Router();
// 🛠️ التعديل هنا: أضفنا googleLogin داخل الأقواس لتتمكن من استخدامها
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

// ✅ الآن سيعمل هذا المسار بدون أخطاء
router.post('/google', googleLogin); 

module.exports = router;
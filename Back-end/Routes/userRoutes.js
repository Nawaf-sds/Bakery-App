// const express = require('express');
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser
// } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');

// // ✅ تسجيل مستخدم جديد
// router.post('/register', registerUser);

// // ✅ تسجيل الدخول
// router.post('/login', loginUser);

// // ✅ جلب جميع المستخدمين (محمي)
// router.get('/', protect, getAllUsers);

// // ✅ جلب مستخدم محدد (محمي)
// router.get('/:id', protect, getUserById);

// // ✅ تحديث مستخدم (محمي)
// router.put('/:id', protect, updateUser);

// // ✅ حذف مستخدم (محمي)
// router.delete('/:id', protect, deleteUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// ✅ تسجيل مستخدم جديد
router.post('/register', registerUser);

// ✅ تسجيل الدخول
router.post('/login', loginUser);

// ✅ جلب جميع المستخدمين (محمي)
router.get('/', protect, getAllUsers);

// ✅ جلب مستخدم محدد (محمي)
router.get('/:id', protect, getUserById);

// ✅ تحديث مستخدم (محمي)
router.put('/:id', protect, updateUser);

// ✅ حذف مستخدم (محمي)
router.delete('/:id', protect, deleteUser);

module.exports = router;












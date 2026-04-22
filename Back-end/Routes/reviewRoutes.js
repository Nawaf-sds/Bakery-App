// استيراد مكتبة Express لإنشاء الخادم والمسارات
const express = require('express');
// إنشاء كائن router جديد لإدارة المسارات الخاصة بالتقييمات
const router = express.Router();

// استيراد الدوال التي ستنفذ الإجراءات (المنطق) من ملف الـ Controller
const {
    createReview,
    getMyReviews,
    deleteReview // <--- تم إضافة دالة deleteReview إلى الاستيراد، ولكن لم يتم تعريفها في reviewController.js بعد
} = require('../controllers/reviewController');

// ✨ التصحيح: هنا نستورد دالة الحماية `protect` من ملف الوسيط (authMiddleware)
// اسم الدالة هو `protect` وليس `authMiddleware`
const { protect } = require('../middleware/authMiddleware');

// --- تعريف المسارات ---

// تعريف مسار لإنشاء تقييم جديد
// عندما يأتي طلب `POST` إلى `/api/reviews/`
// سيتم تنفيذ الوسيط `protect` أولاً للتأكد من أن المستخدم مسجل دخوله
// ثم سيتم تنفيذ دالة `createReview`
router.route('/').post(protect, createReview);

// تعريف مسار لجلب جميع تقييمات المستخدم المسجل دخوله
// عندما يأتي طلب `GET` إلى `/api/reviews/myreviews`
// سيتم تنفيذ الوسيط `protect` أولاً
// ثم سيتم تنفيذ دالة `getMyReviews`
router.route('/myreviews').get(protect, getMyReviews);

router.route('/:id').delete(protect, deleteReview); // <--- تم إضافة مسار لحذف تقييم بناءً على معرفه (id)، ولكن دالة deleteReview لم يتم تعريفها في reviewController.js بعد

// تصدير الـ router ليتم استخدامه في ملف الخادم الرئيسي (server.js)
module.exports = router;
// Back-end/routes/promotionRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');    // ✨ إضافة: مكتبة للتعامل مع مسارات الملفات
const multer = require('multer');  // ✨ إضافة: مكتبة معالجة رفع الملفات

const {
    getPromotions,
    createPromotion,
} = require('../controllers/promotionController');

// We need the 'protect' and 'isAdmin' middleware for the create route
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- ✨ إضافة: إعدادات Multer لرفع الصور ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // تحديد المجلد الذي سيتم حفظ الصور فيه
        cb(null, 'uploads/images/');
    },
    filename(req, file, cb) {
        // تحديد اسم فريد للملف لتجنب تكرار الأسماء
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage });
// --- نهاية إعدادات Multer ---

// Route to get all promotions (Public)
// and create a new promotion (Admin only)
router
    .route('/')
    .get(getPromotions)
    // ✨ تعديل: أضفنا `upload.single('image')` هنا
    // هذا الوسيط (middleware) سيقوم بمعالجة الصورة قبل `createPromotion`
    .post(protect, isAdmin, upload.single('image'), createPromotion);

module.exports = router;
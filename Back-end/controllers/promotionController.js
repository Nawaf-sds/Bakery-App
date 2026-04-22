// Back-end/controllers/promotionController.js

const asyncHandler = require('express-async-handler');
const Promotion = require('../models/promotionModel');

// @desc    Fetch all promotions
// @route   GET /api/promotions
// @access  Public
const getPromotions = asyncHandler(async (req, res) => {
    const promotions = await Promotion.find({});
    res.json(promotions);
});

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private/Admin
// ✨ تعديل: الكود الجديد للتعامل مع رفع الملفات
const createPromotion = asyncHandler(async (req, res) => {
    // req.body يحتوي الآن على الحقول النصية مثل 'link' أو 'title'
    const { link } = req.body;

    // req.file يحتوي على معلومات الصورة التي تم رفعها بواسطة multer
    // يجب التأكد من وجود ملف قبل المتابعة
    if (!req.file) {
        res.status(400);
        throw new Error('No image file uploaded');
    }

    // `req.file.path` هو المسار الذي تم حفظ الصورة فيه على الخادم
    // يجب أن نحفظ هذا المسار في قاعدة البيانات
    const imagePath = req.file.path;

    const promotion = new Promotion({
        // احفظ المسار الذي حصلت عليه من multer
        image: imagePath, 
        link,
    });

    const createdPromotion = await promotion.save();
    res.status(201).json(createdPromotion);
});

// Export the functions to be used in the routes file
module.exports = {
    getPromotions,
    createPromotion,
};
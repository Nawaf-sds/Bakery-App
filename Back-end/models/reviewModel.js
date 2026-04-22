const mongoose = require('mongoose');

// تعريف مخطط (Schema) للتقييم
const reviewSchema = new mongoose.Schema({
    // ربط التقييم بالمنتج الذي يتم تقييمه
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // اسم النموذج الخاص بالمنتجات
        required: true
    },
    // ربط التقييم بالمستخدم الذي كتبه
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // اسم النموذج الخاص بالمستخدمين
        required: true
    },
    // التقييم الرقمي (مثلاً من 1 إلى 5)
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // التعليق النصي (اختياري)
    comment: {
        type: String,
        trim: true
    }
}, {
    // إضافة حقول createdAt و updatedAt تلقائيًا
    timestamps: true 
});

// لمنع المستخدم من إضافة أكثر من تقييم واحد لنفس المنتج
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
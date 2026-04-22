const Review = require('../models/reviewModel');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    // البيانات تأتي من جسم الطلب (body)
    const { productId, rating, comment } = req.body;

    try {
        // التحقق مما إذا كان المستخدم قد قام بتقييم هذا المنتج من قبل
        const existingReview = await Review.findOne({ product: productId, user: req.user._id });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // إنشاء تقييم جديد في الذاكرة
        const review = new Review({
            product: productId,
            user: req.user._id, // `req.user` يأتي من authMiddleware
            rating,
            comment
        });

        // حفظ التقييم في قاعدة البيانات
        const createdReview = await review.save();
        
        res.status(201).json(createdReview);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}; // <--- هنا كان الخطأ: تم إغلاق دالة createReview في المكان الصحيح

// @desc    Get logged in user reviews
// @route   GET /api/reviews/myreviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    // 👇 التعديل هنا: غيرنا 'productId' إلى 'product' ليطابق الـ Schema
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name imageUrls image') 
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    // @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('التقييم غير موجود');
    }

    // التأكد أن الذي يحذف التقييم هو صاحبه
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('غير مصرح لك بحذف هذا التقييم');
    }

    await review.deleteOne();
    res.status(200).json({ message: 'تم حذف التقييم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// لا تنسَ تصدير الدالة في نهاية الملف
module.exports = {
  createReview,
  getMyReviews,
  deleteReview, // <--- أضف هذا السطر
};

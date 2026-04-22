// Back-end/routes/wishlistRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/wishlistController');

// المسار الرئيسي لجلب وإضافة المنتجات
router.route('/')
    .get(protect, getWishlist)
    .post(protect, addToWishlist);

// مسار لحذف منتج معين
router.route('/:productId').delete(protect, removeFromWishlist);

module.exports = router;

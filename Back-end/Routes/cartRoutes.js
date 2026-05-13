const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addToCart,
    getCart,
    updateCartItemQuantity, 
    deleteItemFromCart
} = require('../controllers/cartController');


router.route('/')
    .get(protect, getCart)       // لجلب وعرض السلة
    .post(protect, addToCart);   // لإضافة منتج جديد للسلة

// PATCH /api/cart/items/:itemId -> تحديث كمية عنصر معين في السلة
router.route('/items/:itemId').patch(protect, updateCartItemQuantity);

// DELETE /api/cart/items/:itemId -> حذف عنصر معين من السلة
router.route('/items/:itemId').delete(protect, deleteItemFromCart);

module.exports = router;

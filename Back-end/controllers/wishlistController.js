// Back-end/controllers/wishlistController.js

const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlistModel');

// @desc    جلب قائمة أمنيات المستخدم
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

    if (wishlist) {
        res.json(wishlist.items);
    } else {
        res.json([]); // إذا لم توجد قائمة، أرجع مصفوفة فارغة
    }
});

// @desc    إضافة منتج إلى قائمة الأمنيات
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        // إذا لم تكن هناك قائمة، أنشئ واحدة جديدة
        wishlist = await Wishlist.create({ user: userId, items: [{ product: productId }] });
    } else {
        // تحقق مما إذا كان المنتج موجودًا بالفعل
        const itemExists = wishlist.items.some(item => item.product.toString() === productId);
        if (!itemExists) {
            wishlist.items.push({ product: productId });
            await wishlist.save();
        }
    }
    res.status(201).json(wishlist);
});

// @desc    حذف منتج من قائمة الأمنيات
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
        wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
        await wishlist.save();
        res.json({ message: 'تم حذف المنتج من قائمة الأمنيات' });
    } else {
        res.status(404).json({ message: 'قائمة الأمنيات غير موجودة' });
    }
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
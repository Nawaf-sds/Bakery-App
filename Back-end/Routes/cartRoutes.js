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
    .get(protect, getCart)        
    .post(protect, addToCart);       

router.route('/items/:itemId').patch(protect, updateCartItemQuantity);

router.route('/items/:itemId').delete(protect, deleteItemFromCart);

module.exports = router;

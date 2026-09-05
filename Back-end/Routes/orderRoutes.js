const express = require('express');
const router = express.Router();

// استدعاء دوال التحكم الخاصة بالطلبات من الكنترولر
const {
    createOrder,
    getAllOrders,
    getMyOrders,
    getReviewableItems 
} = require('../controllers/orderController');


const { protect, isAdmin } = require('../middleware/authMiddleware');


router.post('/', protect, createOrder);


router.get('/myorders', protect, getMyOrders);


router.get('/reviewable', protect, getReviewableItems);


router.get('/', protect, isAdmin, getAllOrders);

module.exports = router;

const express = require('express');
const router = express.Router();

// استدعاء دوال التحكم الخاصة بالطلبات من الكنترولر
const {
    createOrder,
    getAllOrders,
    getMyOrders,
    getReviewableItems 
} = require('../controllers/orderController');

// استدعاء دالة الحماية (للتأكد من أن العميل مسجل دخوله ولديه Token صالح)
const { protect, isAdmin } = require('../middleware/authMiddleware');

// 💡 1. مسار إنشاء طلب جديد (Checkout)
// الطريقة: POST | الرابط: /api/orders
router.post('/', protect, createOrder);

// 💡 2. مسار جلب طلبات المستخدم الحالي فقط (لصفحة "طلباتي" في الجوال)
// الطريقة: GET | الرابط: /api/orders/myorders
router.get('/myorders', protect, getMyOrders);

// 💡 3. مسار جلب المنتجات المكتملة لتقييمها
// الطريقة: GET | الرابط: /api/orders/reviewable
router.get('/reviewable', protect, getReviewableItems);

// 💡 4. مسار جلب جميع الطلبات في قاعدة البيانات
// الطريقة: GET | الرابط: /api/orders
router.get('/', protect, isAdmin, getAllOrders);

module.exports = router;
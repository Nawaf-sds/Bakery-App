// 1. استدعاء الموديلات اللازمة
const Order = require('../models/Order');
const Cart = require('../models/Cart'); 
const asyncHandler = require('express-async-handler');

// ✅ 1. إنشاء طلب جديد (Checkout)
const createOrder = asyncHandler(async (req, res) => {
    // نأخذ العنوان وطريقة الدفع من الجوال
    const { shippingAddress, paymentMethod } = req.body;

    // البحث عن سلة العميل الحالي
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'سلة المشتريات فارغة، لا يمكن إنشاء طلب' });
    }

    // تجهيز المنتجات لنسخها من السلة إلى الطلب (مع حفظ السعر الحالي)
    const orderItems = cart.items.map(cartItem => {
        return {
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            price: cartItem.product.price // حفظ السعر وقت الشراء
        };
    });

    // إنشاء الطلب في قاعدة البيانات
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: cart.totalPrice // السعر يأخذه من السلة الموثوقة
    });

    // تفريغ وتصفير السلة بعد نجاح الطلب
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // إرسال رسالة النجاح للجوال
    res.status(201).json(order);
});

// ✅ 2. الحصول على جميع الطلبات (للوحة التحكم لاحقاً)
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name');
    res.status(200).json(orders);
});

// ✅ 3. جلب طلبات المستخدم الحالي (لصفحة طلباتي في الجوال)
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name price imageUrls');
    res.status(200).json(orders);
});

// ✅ 4. جلب المنتجات المكتملة لتقييمها
const getReviewableItems = asyncHandler(async (req, res) => {
    const orders = await Order.find({ 
        user: req.user._id,
        status: 'مكتمل' 
    }).populate('items.product');

    if (!orders || orders.length === 0) {
        return res.json([]);
    }

    // استخراج المنتجات من الطلبات
    const products = orders.flatMap(order => order.items.map(item => item.product));
    
    // إزالة المنتجات الفارغة
    const validProducts = products.filter(p => p != null);

    res.json(validProducts);
});

// تصدير جميع الدوال
module.exports = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getReviewableItems
};
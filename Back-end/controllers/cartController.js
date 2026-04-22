// 1. استيراد الموديلات اللازمة
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// ✅ دالة جلب السلة
const getCart = asyncHandler(async (req, res) => {
    // جلب سلة المستخدم الحالي مع إرفاق كافة بيانات المنتجات (صورة، اسم، سعر، مخزون)
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price imageUrls dailyStock size');
    
    // إذا لم يكن لديه سلة، نرجع سلة فارغة بصفر ريالات بدلاً من إرسال خطأ
    if (!cart) return res.status(200).json({ user: req.user._id, items: [], totalPrice: 0 });
    
    res.json(cart);
});

// ✅ دالة إضافة منتج للسلة
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body; // استلام رقم المنتج والكمية من الجوال
    const user = req.user._id;

    // التأكد من أن المنتج موجود فعلاً في قاعدة بيانات المخبز
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });

    // البحث عن سلة المستخدم
    let cart = await Cart.findOne({ user });

    if (cart) {
        // إذا كان لديه سلة، نبحث هل المنتج موجود فيها مسبقاً؟
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (itemIndex > -1) {
            // المنتج موجود: نزيد الكمية ونتأكد أنها لا تتجاوز المخزون
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (newQuantity > product.dailyStock) {
                return res.status(400).json({ message: `الكمية تتجاوز المخزون المتوفر (${product.dailyStock})` });
            }
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            // المنتج غير موجود: نضيفه للسلة كعنصر جديد
            if (quantity > product.dailyStock) return res.status(400).json({ message: 'الكمية تتجاوز المتوفر' });
            cart.items.push({ product: productId, quantity: quantity });
        }
    } else {
        // إذا لم يكن لديه سلة أبداً، ننشئ له سلة جديدة
        if (quantity > product.dailyStock) return res.status(400).json({ message: 'الكمية تتجاوز المتوفر' });
        cart = new Cart({ user, items: [{ product: productId, quantity: quantity }] });
    }

    // 💡 مهم جداً: إرفاق بيانات المنتجات (الصور والأسماء) قبل حساب السعر وإرسالها للجوال لكي لا تختفي
    await cart.populate('items.product', 'name price imageUrls dailyStock size');
    
    // حساب السعر الإجمالي
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    // حفظ التعديلات وإرجاع السلة المحدثة
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
});

// ✅ دالة تحديث الكمية (الحل الجذري)
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    // 💡 أصبحنا نستقبل (رقم المنتج نفسه) من الرابط بدلاً من رقم سطر السلة
    const { itemId: productId } = req.params; 
    const { quantity } = req.body; 

    if (quantity <= 0) return res.status(400).json({ message: 'الكمية يجب أن تكون أكبر من صفر' });

    // جلب السلة مع بيانات المنتجات (الصور والأسماء)
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price imageUrls dailyStock size');
    if (!cart) return res.status(404).json({ message: 'السلة غير موجودة' });

    // 💡 البحث عن العنصر باستخدام (رقم المنتج الأساسي) لمطابقته
    const item = cart.items.find(i => i.product && i.product._id.toString() === productId);
    if (!item) return res.status(404).json({ message: 'المنتج غير موجود في السلة' });

    // التحقق من المخزون
    if (quantity > item.product.dailyStock) {
        return res.status(400).json({ message: `عذراً، المتوفر هو ${item.product.dailyStock} فقط` });
    }

    // تحديث الكمية وإعادة حساب السعر
    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, currentItem) => total + (currentItem.product.price * currentItem.quantity), 0);

    await cart.save();
    res.status(200).json(cart); // إرجاع السلة كاملة للجوال
});

// ✅ دالة الحذف (الحل الجذري)
const deleteItemFromCart = asyncHandler(async (req, res) => {
    // 💡 أصبحنا نستقبل (رقم المنتج نفسه) المراد حذفه
    const { itemId: productId } = req.params; 

    // جلب السلة مع بيانات المنتجات
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price imageUrls dailyStock size');
    if (!cart) return res.status(404).json({ message: 'السلة غير موجودة.' });

    // 💡 فلترة السلة لحذف السطر الذي يحتوي على (رقم المنتج) المطابق
    cart.items = cart.items.filter(item => item.product && item.product._id.toString() !== productId);
    
    // إعادة حساب السعر الإجمالي بعد الحذف
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    await cart.save();
    res.json(cart); // إرجاع السلة بعد الحذف
});

module.exports = { getCart, addToCart, updateCartItemQuantity, deleteItemFromCart };
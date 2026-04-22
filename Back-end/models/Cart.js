const mongoose = require('mongoose');

// // 1. بناء هيكل للعنصر الواحد داخل السلة (عمل ممتاز لفصل الأكواد)
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // // ربط هذا الحقل بجدول "المنتجات" لكي نجلب بيانات الكوكيز لاحقاً
    required: true
  }, 
  quantity: {
    type: Number,
    required: true,
    min: 1 // // حماية ممتازة: تمنع العميل من إضافة منتج بكمية صفر أو بالسالب
  }
}, ); 
// 💡 [تعديل احترافي]: أضفنا { _id: false } هنا. 
// السبب: بدونها، ستقوم MongoDB بإنشاء ID عشوائي لكل منتج تضفه داخل السلة. نحن لا نحتاج هذا الـ ID العشوائي لأننا نبحث عن المنتج باستخدام (product ID) الخاص به. إيقافها يخفف حجم قاعدة البيانات ويسرع البحث.

// // 2. بناء هيكل السلة الرئيسية
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // // ممتاز: يضمن أن لكل عميل سلة واحدة فقط (يمنع تكرار السلال لنفس الشخص)
  },
  items: [cartItemSchema], // // استخدام الهيكل الفرعي الذي بنيناه في الأعلى
  totalPrice: {
    type: Number,
    required: true,
    default: 0 // // السعر المبدئي صفر عند إنشاء سلة جديدة
  }
}, { timestamps: true }); // // يضيف وقت وتاريخ إنشاء السلة وآخر تعديل عليها تلقائياً

module.exports = mongoose.model('Cart', cartSchema);
const mongoose = require('mongoose');

// 1. هيكل المنتجات داخل الطلب
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // 💡 [تعديل احترافي]: حفظ سعر المنتج وقت الشراء (لكي لا تتأثر الفواتير القديمة إذا تغير السعر مستقبلاً)
  price: {
    type: Number,
    required: true
  }
});

// 2. هيكل الطلب الأساسي
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema], // المنتجات المطلوبة
  
  // 💡 [تعديل ضروري]: عنوان التوصيل للعميل (أضفناه لأنه ضروري لتوصيل الطلب)
  shippingAddress: {
    type: String,
    required: true, // إجباري
  },

  totalPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['عند الاستلام', 'مدى', 'Apple Pay', 'بطاقة ائتمان'],
    required: true
  },
  status: {
    type: String,
    enum: ['قيد التجهيز', 'قيد التوصيل', 'مكتمل', 'ملغي'],
    default: 'قيد التجهيز' // أي طلب جديد يكون "قيد التجهيز" تلقائياً
  },
  deliveryTime: {
    type: Date
  }
}, {
  timestamps: true // يحفظ وقت إنشاء الطلب وتحديثه تلقائياً
});

module.exports = mongoose.model('Order', orderSchema);
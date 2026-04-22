const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  address: {
    type: String,
    required: true,
     minlength: 5,
  },
  city: {
    type: String,
    default: 'مكة المكرمة'
  },
  deliveryStatus: {
    type: String,
    enum: ['قيد الشحن', 'تم التوصيل', 'ملغي'],
    default: 'قيد الشحن'
  },
  deliveryDate: {
    type: Date
  },
  deliveryNote: {
    type: String
  },
  company: {
    type: String,
    default: 'شركة التوصيل المعتمدة'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);

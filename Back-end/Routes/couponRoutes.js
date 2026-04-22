const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// إنشاء كوبون جديد
router.post('/', async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const saved = await coupon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// جلب جميع الكوبونات
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب كوبون محدد بالـ ID
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تحديث كوبون
// يمكنك إضافة المزيد من المسارات هنا

// تحديث كوبون
// يمكنك إضافة المزيد من المسارات هنا

module.exports = router;

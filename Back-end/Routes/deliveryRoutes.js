const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

// إنشاء عملية توصيل
router.post('/', async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    const saved = await delivery.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// جلب جميع عمليات التوصيل
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب عملية توصيل محددة
router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تحديث عملية توصيل
// يمكنك إضافة المزيد من المسارات هنا

module.exports = router;

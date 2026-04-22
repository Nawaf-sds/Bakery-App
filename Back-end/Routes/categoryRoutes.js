const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// إنشاء تصنيف جديد
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// جلب جميع التصنيفات
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب تصنيف محدد بالـ ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تحديث تصنيف
// يمكنك إضافة المزيد من المسارات هنا

module.exports = router;

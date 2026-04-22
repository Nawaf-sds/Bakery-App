const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// 1. استدعاء أداة رفع الصور (Multer + Cloudinary)
const upload = require('../middleware/uploadMiddleware');

// استيراد protect و isAdmin
const { protect, isAdmin } = require('../middleware/authMiddleware');

// ➕ إنشاء منتج (محمي للمشرف) 
// 💡 أضفنا upload.array لاستقبال مصفوفة الصور ومعالجة بيانات form-data
router.post('/', protect, isAdmin, upload.array('imageUrls', 5), createProduct);

// 📃 عرض كل المنتجات (عام)
router.get('/', getAllProducts);

// 📃 عرض منتج محدد (عام)
router.get('/:id', getProductById);

// 📝 تحديث منتج باستخدام ID (محمي للمشرف)
// 💡 أضفنا upload.array هنا أيضاً للسماح بتغيير الصور عند التعديل
router.put('/:id', protect, isAdmin, upload.array('imageUrls', 5), updateProduct);

// ❌ حذف منتج باستخدام ID (محمي للمشرف)
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
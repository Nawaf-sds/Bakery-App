const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');


const upload = require('../middleware/uploadMiddleware');


const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, isAdmin, upload.array('imageUrls', 5), createProduct);


router.get('/', getAllProducts);


router.get('/:id', getProductById);


router.put('/:id', protect, isAdmin, upload.array('imageUrls', 5), updateProduct);


router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;

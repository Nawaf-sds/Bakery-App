

////////////////////////////////////////////////////


// const Product = require('../models/Product');
// const asyncHandler = require('express-async-handler');

// // ✅ إضافة منتج جديد
// // @route   POST /api/products
// // @access  Private/Admin
// const createProduct = asyncHandler(async (req, res) => {
//   const { name, description, price, category, imageUrls, ingredients, size } = req.body;

//   if (!name || !price || !category || !imageUrls || imageUrls.length === 0) {
//     res.status(400);
//     throw new Error('يرجى إدخال جميع الحقول الأساسية ومصفوفة صور واحدة على الأقل.');
//   }

//   const newProduct = new Product({
//     name,
//     description,
//     price,
//     category,
//     imageUrls,
//     ingredients,
//     size,
//     user: req.user._id,
//   });

//   const savedProduct = await newProduct.save();
//   res.status(201).json(savedProduct);
// });

// // ✅ عرض كل المنتجات
// // @route   GET /api/products
// // @access  Public
// const getAllProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find({});
//   res.json(products);
// });

// // ✅ عرض منتج محدد بالـ ID
// // @route   GET /api/products/:id
// // @access  Public
// const getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404);
//     throw new Error('المنتج غير موجود.');
//   }
// });

// // ✅ تعديل منتج
// // @route   PUT /api/products/:id
// // @access  Private/Admin
// const updateProduct = asyncHandler(async (req, res) => {
//   const { name, description, price, category, imageUrls, ingredients, size } = req.body;
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.category = category || product.category;
//     product.imageUrls = imageUrls || product.imageUrls; // ✅ تعديل: تحديث مصفوفة الصور
//     product.ingredients = ingredients || product.ingredients;
//     product.size = size || product.size;
    
//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404);
//     throw new Error('المنتج غير موجود.');
//   }
// });

// // ✅ حذف منتج
// // @route   DELETE /api/products/:id
// // @access  Private/Admin
// const deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     await product.deleteOne();
//     res.json({ message: 'تم حذف المنتج بنجاح.' });
//   } else {
//     res.status(404);
//     throw new Error('المنتج غير موجود.');
//   }
// });

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };

///////////////////////////////////////////////////////////////////
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// ✅ 1. إضافة منتج جديد
const createProduct = asyncHandler(async (req, res) => {
  console.log("📥 البيانات المستلمة من Postman:", req.body);

  const { name, description, price, category, ingredients, size, dailyStock, maxPurchaseLimit } = req.body;

  let imageUrls = req.body.imageUrls || [];
  if (req.files && req.files.length > 0) {
    imageUrls = req.files.map(file => file.path);
  } else if (typeof imageUrls === 'string') {
    imageUrls = [imageUrls]; 
  } else if (req.file) {
    imageUrls = [req.file.path];
  }

  if (!name || !price || !category || imageUrls.length === 0) {
    res.status(400);
    throw new Error('يرجى إدخال جميع الحقول الأساسية وصورة واحدة على الأقل.');
  }

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    imageUrls,
    ingredients,
    size,
    dailyStock: dailyStock || 0,
    maxPurchaseLimit: maxPurchaseLimit || 5,
    user: req.user._id,
  });

  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
});

// ✅ 2. عرض كل المنتجات
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// ✅ 3. عرض منتج محدد بالـ ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود.');
  }
});

// ✅ 4. تعديل منتج
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, ingredients, size, dailyStock, maxPurchaseLimit } = req.body;
  const product = await Product.findById(req.params.id);

  let imageUrls = req.body.imageUrls;
  if (req.files && req.files.length > 0) {
    imageUrls = req.files.map(file => file.path);
  } else if (req.file) {
    imageUrls = [req.file.path];
  }

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.ingredients = ingredients || product.ingredients;
    product.size = size || product.size;
    
    if (dailyStock !== undefined) product.dailyStock = dailyStock; 
    if (maxPurchaseLimit !== undefined) product.maxPurchaseLimit = maxPurchaseLimit;
    
    if (imageUrls && imageUrls.length > 0) {
      product.imageUrls = imageUrls;
    }
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود.');
  }
});

// ✅ 5. حذف منتج
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'تم حذف المنتج بنجاح.' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود.');
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
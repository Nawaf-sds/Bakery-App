// Back-end/routes/promotionRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');    / 
const multer = require('multer');  

const {
    getPromotions,
    createPromotion,
} = require('../controllers/promotionController');

const { protect, isAdmin } = require('../middleware/authMiddleware');


const storage = multer.diskStorage({
    destination(req, file, cb) {
      
        cb(null, 'uploads/images/');
    },
    filename(req, file, cb) {
       
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage });

router
    .route('/')
    .get(getPromotions)
  
    .post(protect, isAdmin, upload.single('image'), createPromotion);

module.exports = router;

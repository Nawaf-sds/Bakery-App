
const express = require('express');

const router = express.Router();


const {
    createReview,
    getMyReviews,
    deleteReview 
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');


router.route('/').post(protect, createReview);


router.route('/myreviews').get(protect, getMyReviews);

router.route('/:id').delete(protect, deleteReview); 

module.exports = router;

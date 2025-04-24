const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(productController.getAllProducts)
    .post(protect, restrictTo('admin'), productController.createProduct);

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(protect, restrictTo('admin'), productController.updateProduct)
    .delete(protect, restrictTo('admin'), productController.deleteProduct);

router
    .route('/:id/reviews')
    .post(protect, productController.addReview);

module.exports = router; 
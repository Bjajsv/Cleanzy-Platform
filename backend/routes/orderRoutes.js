const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Customer routes
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

// Admin routes
router.use(restrictTo('admin'));
router.patch('/:id/status', orderController.updateOrderStatus);

// Payment webhook routes (public)
router.post(
    '/mpesa/callback',
    orderController.mpesaCallback
);

router.post(
    '/paypal/webhook',
    orderController.paypalWebhook
);

module.exports = router; 
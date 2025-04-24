const Order = require('../models/Order');
const Product = require('../models/Product');
const PaymentService = require('../services/paymentService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return next(new AppError('No order items', 400));
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const taxPrice = itemsPrice * 0.15; // 15% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order
    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    });

    // Initiate payment based on method
    let paymentResult;
    if (paymentMethod === 'mpesa') {
        paymentResult = await PaymentService.initiateSTKPush(
            shippingAddress.phoneNumber,
            totalPrice,
            order._id
        );
    } else if (paymentMethod === 'paypal') {
        paymentResult = await PaymentService.createPayPalOrder(
            orderItems,
            order._id
        );
    }

    res.status(201).json({
        status: 'success',
        data: {
            order,
            paymentResult
        }
    });
});

exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('orderItems.product');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Check if the order belongs to the logged-in user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 401));
    }

    res.status(200).json({
        status: 'success',
        data: order
    });
});

exports.updateOrderToPaid = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Update order status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body;

    const updatedOrder = await order.save();

    // Update product stock
    for (const item of order.items) {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
    }

    res.status(200).json({
        status: 'success',
        data: updatedOrder
    });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders
    });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    order.status = status;
    if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
        status: 'success',
        data: updatedOrder
    });
}); 
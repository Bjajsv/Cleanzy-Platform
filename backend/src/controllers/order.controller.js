import { Order } from '../models/order.model';
import { sendOrderStatusEmail } from '../services/email.service';

export const orderController = {
    async createOrder(req, res) {
        try {
            const {
                items,
                shippingAddress,
                paymentMethod
            } = req.body;

            const order = new Order({
                userId: req.user.id,
                items,
                totalAmount: items.reduce((total, item) => 
                    total + (item.price * item.quantity), 0
                ),
                shippingAddress,
                paymentMethod,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            });

            await order.save();
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOrderStatus(req, res) {
        try {
            const order = await Order.findById(req.params.orderId)
                .populate('items.productId');

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json({
                order,
                trackingHistory: order.trackingHistory
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const { status, location, description } = req.body;
            const order = await Order.findById(req.params.orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            await order.updateTrackingStatus(status, location, description);
            await sendOrderStatusEmail(order);

            res.json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getOrderHistory(req, res) {
        try {
            const orders = await Order.find({ userId: req.user.id })
                .sort({ createdAt: -1 })
                .populate('items.productId');

            res.json(orders);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}; 
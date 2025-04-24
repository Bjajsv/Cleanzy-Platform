import express from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';

const router = express.Router();

// Health check
router.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

export default router; 
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    shippingAddress: {
        firstName: String,
        lastName: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String
    },
    trackingNumber: String,
    trackingHistory: [{
        status: String,
        location: String,
        timestamp: Date,
        description: String
    }],
    estimatedDelivery: Date,
    notes: String
}, {
    timestamps: true
});

orderSchema.methods.updateTrackingStatus = async function(status, location, description) {
    this.trackingHistory.push({
        status,
        location,
        timestamp: new Date(),
        description
    });
    this.status = status;
    return this.save();
};

export const Order = mongoose.model('Order', orderSchema); 
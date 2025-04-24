const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');

exports.mpesaCallback = catchAsync(async (req, res) => {
    const {
        Body: {
            stkCallback: {
                MerchantRequestID,
                CallbackMetadata
            }
        }
    } = req.body;

    if (CallbackMetadata) {
        const amount = CallbackMetadata.Item.find(item => item.Name === 'Amount').Value;
        const mpesaReceiptNumber = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value;
        const transactionDate = CallbackMetadata.Item.find(item => item.Name === 'TransactionDate').Value;
        const phoneNumber = CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber').Value;

        // Update order
        const order = await Order.findOne({ 'paymentResult.id': MerchantRequestID });
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: MerchantRequestID,
                status: 'completed',
                update_time: new Date().toISOString(),
                mpesaReceiptNumber,
                phoneNumber,
                transactionDate: new Date(transactionDate)
            };

            await order.save();
        }
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

exports.paypalWebhook = catchAsync(async (req, res) => {
    const { resource } = req.body;

    if (resource.status === 'COMPLETED') {
        const order = await Order.findOne({ 'paymentResult.id': resource.id });
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: resource.id,
                status: resource.status,
                update_time: resource.update_time,
                email_address: resource.payer.email_address
            };

            await order.save();
        }
    }

    res.status(200).end();
}); 
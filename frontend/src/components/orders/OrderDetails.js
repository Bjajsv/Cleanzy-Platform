import React from 'react';
import OrderReview from './OrderReview';
import OrderCancellation from './OrderCancellation';

const OrderDetails = ({ order }) => {
    const handleReviewSubmitted = (productId) => {
        // Update UI or refresh order details
        console.log(`Review submitted for product ${productId}`);
    };

    const handleCancellationComplete = () => {
        // Update UI or refresh order details
        console.log('Order cancelled successfully');
    };

    return (
        <div>
            {/* Other order details */}
            
            <OrderCancellation
                order={order}
                onCancellationComplete={handleCancellationComplete}
            />
            
            {order.status === 'delivered' && (
                <OrderReview
                    order={order}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </div>
    );
}; 
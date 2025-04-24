import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';
import {
    Paper,
    Typography,
    Grid,
    Divider,
    CircularProgress
} from '@mui/material';
import { orderService } from '../../services/orderService';
import './OrderTracking.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const data = await orderService.getOrderById(orderId);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#ffa726';
            case 'processing':
                return '#29b6f6';
            case 'shipped':
                return '#66bb6a';
            case 'delivered':
                return '#43a047';
            case 'cancelled':
                return '#e53935';
            default:
                return '#757575';
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!order) return <Typography>Order not found</Typography>;

    return (
        <div className="order-tracking-container">
            <Paper className="tracking-paper">
                <Typography variant="h5" gutterBottom>
                    Order Tracking - #{order._id}
                </Typography>
                <Divider />

                <Grid container spacing={3} className="order-info">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Shipping Details</Typography>
                        <Typography>
                            {order.shippingAddress.street}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                            <br />
                            {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Order Summary</Typography>
                        <Typography>
                            Total Items: {order.items.length}
                            <br />
                            Total Amount: ${order.totalPrice}
                            <br />
                            Payment Method: {order.paymentMethod}
                        </Typography>
                    </Grid>
                </Grid>

                <Timeline className="tracking-timeline">
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot style={{ backgroundColor: getStatusColor('pending') }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Order Placed</Typography>
                            <Typography variant="body2">
                                {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot 
                                style={{ 
                                    backgroundColor: getStatusColor(
                                        order.isPaid ? 'processing' : 'pending'
                                    ) 
                                }} 
                            />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Payment {order.isPaid ? 'Completed' : 'Pending'}</Typography>
                            {order.isPaid && (
                                <Typography variant="body2">
                                    {new Date(order.paidAt).toLocaleString()}
                                </Typography>
                            )}
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot 
                                style={{ 
                                    backgroundColor: getStatusColor(
                                        order.status === 'shipped' ? 'shipped' : 'pending'
                                    ) 
                                }} 
                            />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Shipped</Typography>
                            {order.status === 'shipped' && (
                                <Typography variant="body2">
                                    Your order is on the way
                                </Typography>
                            )}
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot 
                                style={{ 
                                    backgroundColor: getStatusColor(
                                        order.isDelivered ? 'delivered' : 'pending'
                                    ) 
                                }} 
                            />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Delivered</Typography>
                            {order.isDelivered && (
                                <Typography variant="body2">
                                    {new Date(order.deliveredAt).toLocaleString()}
                                </Typography>
                            )}
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>

                {order.status === 'cancelled' && (
                    <Paper className="cancelled-notice" elevation={0}>
                        <Typography color="error" variant="h6">
                            Order Cancelled
                        </Typography>
                    </Paper>
                )}
            </Paper>
        </div>
    );
};

export default OrderTracking; 
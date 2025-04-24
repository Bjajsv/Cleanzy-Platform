import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Divider,
    Button,
    Grid,
    Chip
} from '@mui/material';
import {
    CheckCircle,
    LocalShipping,
    Receipt,
    Email
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = ({ orderDetails }) => {
    const navigate = useNavigate();

    const {
        orderId,
        orderDate,
        totalAmount,
        shippingAddress,
        paymentMethod,
        estimatedDelivery
    } = orderDetails;

    return (
        <Paper elevation={2} className="order-confirmation-container">
            <Box className="confirmation-header">
                <CheckCircle color="success" sx={{ fontSize: 48 }} />
                <Typography variant="h4" gutterBottom>
                    Order Confirmed!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Order #{orderId}
                </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Order Summary
                    </Typography>
                    <Box className="summary-details">
                        <Typography variant="body1">
                            Date: {new Date(orderDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                            Total Amount: ${totalAmount}
                        </Typography>
                        <Typography variant="body1">
                            Payment Method: {paymentMethod}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Shipping Details
                    </Typography>
                    <Box className="shipping-details">
                        <Typography variant="body1">
                            {shippingAddress.firstName} {shippingAddress.lastName}
                        </Typography>
                        <Typography variant="body1">
                            {shippingAddress.address1}
                        </Typography>
                        {shippingAddress.address2 && (
                            <Typography variant="body1">
                                {shippingAddress.address2}
                            </Typography>
                        )}
                        <Typography variant="body1">
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                        </Typography>
                        <Typography variant="body1">
                            {shippingAddress.country}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box className="delivery-info" sx={{ my: 3 }}>
                <Chip
                    icon={<LocalShipping />}
                    label={`Estimated Delivery: ${estimatedDelivery}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Box className="action-buttons" sx={{ mt: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<Receipt />}
                    onClick={() => window.print()}
                >
                    Print Receipt
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Email />}
                    onClick={() => {/* Handle email receipt */}}
                >
                    Email Receipt
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate('/orders')}
                >
                    View Orders
                </Button>
            </Box>

            <Box className="continue-shopping" sx={{ mt: 3 }}>
                <Button
                    variant="text"
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </Button>
            </Box>
        </Paper>
    );
};

export default OrderConfirmation; 
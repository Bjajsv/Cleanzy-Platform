import React from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    TextField,
    MenuItem,
    Box
} from '@mui/material';
import './OrderDetails.css';

const OrderDetails = ({ order, onStatusChange, onClose }) => {
    const handleStatusChange = (event) => {
        onStatusChange(order._id, event.target.value);
    };

    return (
        <>
            <DialogTitle>
                Order Details - #{order._id}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Customer Information</Typography>
                        <Typography>
                            Name: {order.user.firstName} {order.user.lastName}
                            <br />
                            Email: {order.user.email}
                            <br />
                            Phone: {order.shippingAddress.phoneNumber}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Shipping Address</Typography>
                        <Typography>
                            {order.shippingAddress.street}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                            <br />
                            {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Order Items</Typography>
                        <Box className="order-items">
                            {order.items.map((item) => (
                                <Grid container key={item._id} className="order-item">
                                    <Grid item xs={2}>
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="item-image"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>{item.product.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Quantity: {item.quantity}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} className="item-price">
                                        <Typography>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Payment Information</Typography>
                        <Typography>
                            Method: {order.paymentMethod}
                            <br />
                            Status: {order.isPaid ? 'Paid' : 'Pending'}
                            {order.isPaid && (
                                <>
                                    <br />
                                    Paid at: {new Date(order.paidAt).toLocaleString()}
                                </>
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Order Summary</Typography>
                        <Typography>
                            Subtotal: ${order.itemsPrice}
                            <br />
                            Shipping: ${order.shippingPrice}
                            <br />
                            Tax: ${order.taxPrice}
                            <br />
                            Total: ${order.totalPrice}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Order Status"
                            value={order.status}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </>
    );
};

export default OrderDetails; 
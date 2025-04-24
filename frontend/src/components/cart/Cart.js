import React from 'react';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    Grid,
    TextField,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal
    } = useCart();

    const handleQuantityChange = (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleManualQuantityChange = (productId, value) => {
        const quantity = parseInt(value);
        if (quantity > 0) {
            updateQuantity(productId, quantity);
        }
    };

    const getTimeRemaining = () => {
        const timeLeft = (cart.lastActive + 30 * 60 * 1000) - Date.now();
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="cart-container">
            <Paper className="cart-paper">
                <div className="cart-header">
                    <Typography variant="h5">Shopping Cart</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        Time remaining: {getTimeRemaining()}
                    </Typography>
                </div>

                {cart.items.length === 0 ? (
                    <Typography className="empty-cart">
                        Your cart is empty
                    </Typography>
                ) : (
                    <>
                        {cart.items.map((item) => (
                            <div key={item.productId} className="cart-item">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={3} sm={2}>
                                        <img
                                            src={item.image.url}
                                            alt={item.name}
                                            className="item-image"
                                        />
                                    </Grid>
                                    <Grid item xs={9} sm={4}>
                                        <Typography variant="subtitle1">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            ${item.price.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <div className="quantity-controls">
                                            <IconButton
                                                onClick={() => handleQuantityChange(
                                                    item.productId,
                                                    item.quantity,
                                                    -1
                                                )}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleManualQuantityChange(
                                                    item.productId,
                                                    e.target.value
                                                )}
                                                className="quantity-input"
                                            />
                                            <IconButton
                                                onClick={() => handleQuantityChange(
                                                    item.productId,
                                                    item.quantity,
                                                    1
                                                )}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <div className="item-actions">
                                            <Typography variant="subtitle1">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                            <IconButton
                                                onClick={() => removeFromCart(item.productId)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}

                        <Divider className="cart-divider" />

                        <div className="cart-summary">
                            <Typography variant="h6">
                                Total: ${getCartTotal().toFixed(2)}
                            </Typography>
                            <div className="cart-actions">
                                <Button
                                    variant="outlined"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="/checkout"
                                >
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Cart; 
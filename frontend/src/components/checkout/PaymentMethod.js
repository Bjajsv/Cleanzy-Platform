import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Paper,
    Typography,
    Divider
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import './PaymentMethod.css';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { updatePaymentMethod } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('mpesa');

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePaymentMethod(paymentMethod);
        navigate('/place-order');
    };

    return (
        <Paper className="payment-method-container">
            <Typography variant="h5" gutterBottom>
                Payment Method
            </Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <FormControlLabel
                        value="mpesa"
                        control={<Radio />}
                        label={
                            <div className="payment-option">
                                <img src="/images/mpesa-logo.png" alt="M-Pesa" />
                                <span>M-Pesa</span>
                            </div>
                        }
                    />
                    <FormControlLabel
                        value="paypal"
                        control={<Radio />}
                        label={
                            <div className="payment-option">
                                <img src="/images/paypal-logo.png" alt="PayPal" />
                                <span>PayPal</span>
                            </div>
                        }
                    />
                </RadioGroup>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="submit-button"
                >
                    Continue to Review
                </Button>
            </form>
        </Paper>
    );
};

export default PaymentMethod; 
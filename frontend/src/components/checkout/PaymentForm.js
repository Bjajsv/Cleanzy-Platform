import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    TextField,
    Alert,
    Collapse
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { paymentService } from '../../services/paymentService';
import './PaymentForm.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentMethodForm = ({ onSubmit, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setProcessing(true);

        try {
            if (paymentMethod === 'card') {
                const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardElement),
                });

                if (error) {
                    throw new Error(error.message);
                }

                // Create payment intent
                const { clientSecret } = await paymentService.createPaymentIntent({
                    amount,
                    paymentMethodId: stripePaymentMethod.id
                });

                // Confirm payment
                const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
                
                if (confirmError) {
                    throw new Error(confirmError.message);
                }

                onSubmit({
                    type: 'card',
                    paymentMethodId: stripePaymentMethod.id
                });
            } else if (paymentMethod === 'mpesa') {
                // Handle M-Pesa payment
                const mpesaPayment = await paymentService.initiateMpesaPayment({
                    amount,
                    phoneNumber: document.getElementById('mpesa-phone').value
                });

                onSubmit({
                    type: 'mpesa',
                    transactionId: mpesaPayment.transactionId
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
            >
                <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Credit/Debit Card"
                />
                <Collapse in={paymentMethod === 'card'}>
                    <Box sx={{ p: 2 }}>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4'
                                        }
                                    },
                                    invalid: {
                                        color: '#9e2146'
                                    }
                                }
                            }}
                        />
                    </Box>
                </Collapse>

                <FormControlLabel
                    value="mpesa"
                    control={<Radio />}
                    label="M-Pesa"
                />
                <Collapse in={paymentMethod === 'mpesa'}>
                    <Box sx={{ p: 2 }}>
                        <TextField
                            id="mpesa-phone"
                            label="M-Pesa Phone Number"
                            fullWidth
                            required={paymentMethod === 'mpesa'}
                            placeholder="254XXXXXXXXX"
                        />
                    </Box>
                </Collapse>
            </RadioGroup>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={processing || !stripe}
                >
                    {processing ? 'Processing...' : 'Pay Now'}
                </Button>
            </Box>
        </form>
    );
};

const PaymentForm = ({ amount, onSubmit }) => {
    return (
        <Elements stripe={stripePromise}>
            <Paper elevation={2} className="payment-form-container">
                <Typography variant="h5" gutterBottom>
                    Payment Method
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Amount to pay: ${amount}
                </Typography>
                <PaymentMethodForm amount={amount} onSubmit={onSubmit} />
            </Paper>
        </Elements>
    );
};

export default PaymentForm; 
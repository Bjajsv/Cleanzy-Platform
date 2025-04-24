import React, { useState } from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Box
} from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';

const steps = ['Shipping', 'Payment', 'Review', 'Confirmation'];

const CheckoutFlow = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const { items, loading, error } = useCart();

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleShippingSubmit = (data) => {
        setShippingData(data);
        handleNext();
    };

    const handlePaymentSubmit = (data) => {
        setPaymentData(data);
        handleNext();
    };

    const handlePlaceOrder = async () => {
        try {
            // Process payment and create order
            const orderData = {
                shipping: shippingData,
                payment: paymentData,
                items
            };
            
            // Submit order
            await cartService.checkout(orderData);
            handleNext();
        } catch (error) {
            console.error('Order placement failed:', error);
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <ShippingForm onSubmit={handleShippingSubmit} />;
            case 1:
                return <PaymentForm onSubmit={handlePaymentSubmit} />;
            case 2:
                return (
                    <OrderSummary
                        items={items}
                        shipping={shippingData}
                        payment={paymentData}
                        onConfirm={handlePlaceOrder}
                    />
                );
            case 3:
                return <OrderConfirmation />;
            default:
                return 'Unknown step';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto', p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 4 }}>
                {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    disabled={activeStep === 0 || activeStep === steps.length - 1}
                    onClick={handleBack}
                >
                    Back
                </Button>
                {activeStep < steps.length - 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                    >
                        {activeStep === steps.length - 2 ? 'Place Order' : 'Next'}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default CheckoutFlow; 
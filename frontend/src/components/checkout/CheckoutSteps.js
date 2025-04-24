import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import './CheckoutSteps.css';

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        'Shopping Cart',
        'Shipping Address',
        'Payment Method',
        'Place Order'
    ];

    return (
        <div className="checkout-stepper">
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
};

export default CheckoutSteps; 
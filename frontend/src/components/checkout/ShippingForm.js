import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Grid,
    Box,
    Typography,
    Autocomplete,
    Button,
    Paper
} from '@mui/material';
import { countries } from '../../utils/countryList';
import './ShippingForm.css';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address1: Yup.string().required('Address is required'),
    address2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State/Province is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    deliveryInstructions: Yup.string()
});

const ShippingForm = ({ onSubmit, initialValues = {} }) => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            deliveryInstructions: '',
            ...initialValues
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    return (
        <Paper elevation={2} className="shipping-form-container">
            <Typography variant="h5" gutterBottom>
                Shipping Information
            </Typography>
            
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="firstName"
                            label="First Name"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="lastName"
                            label="Last Name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="address1"
                            label="Address Line 1"
                            value={formik.values.address1}
                            onChange={formik.handleChange}
                            error={formik.touched.address1 && Boolean(formik.errors.address1)}
                            helperText={formik.touched.address1 && formik.errors.address1}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="address2"
                            label="Address Line 2 (Optional)"
                            value={formik.values.address2}
                            onChange={formik.handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="city"
                            label="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="state"
                            label="State/Province"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                            helperText={formik.touched.state && formik.errors.state}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="postalCode"
                            label="Postal Code"
                            value={formik.values.postalCode}
                            onChange={formik.handleChange}
                            error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                            helperText={formik.touched.postalCode && formik.errors.postalCode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={countries}
                            autoHighlight
                            value={formik.values.country}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('country', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="country"
                                    label="Country"
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={formik.touched.country && formik.errors.country}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="deliveryInstructions"
                            label="Delivery Instructions (Optional)"
                            multiline
                            rows={3}
                            value={formik.values.deliveryInstructions}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Continue to Payment
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default ShippingForm; 
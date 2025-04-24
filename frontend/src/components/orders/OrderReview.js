import React, { useState } from 'react';
import {
    Box,
    Rating,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { Star, Image as ImageIcon } from '@mui/icons-material';
import { reviewService } from '../../services/reviewService';
import './OrderReview.css';

const OrderReview = ({ order, onReviewSubmitted }) => {
    const [reviews, setReviews] = useState({});
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const handleRatingChange = (productId, value) => {
        setReviews(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                rating: value
            }
        }));
    };

    const handleReviewChange = (productId, value) => {
        setReviews(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                comment: value
            }
        }));
    };

    const handleImageUpload = (productId, event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
        );

        setImages(prev => ({
            ...prev,
            [productId]: validFiles
        }));
    };

    const handleReviewSubmit = async (productId) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('orderId', order._id);
            formData.append('productId', productId);
            formData.append('rating', reviews[productId]?.rating || 0);
            formData.append('comment', reviews[productId]?.comment || '');

            if (images[productId]) {
                images[productId].forEach(image => {
                    formData.append('images', image);
                });
            }

            await reviewService.submitReview(formData);
            onReviewSubmitted?.(productId);
            setOpenDialog(false);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openReviewDialog = (product) => {
        setCurrentProduct(product);
        setOpenDialog(true);
    };

    return (
        <>
            <Paper elevation={3} className="order-reviews-container">
                <Typography variant="h6" gutterBottom>
                    Review Your Purchase
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Share your thoughts about the products you purchased
                </Typography>

                <Grid container spacing={2}>
                    {order.items.map((item) => (
                        <Grid item xs={12} key={item.productId}>
                            <Paper elevation={1} className="product-review-card">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Avatar
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            variant="rounded"
                                            sx={{ width: 60, height: 60 }}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1">
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Purchased: {new Date(order.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            onClick={() => openReviewDialog(item.product)}
                                        >
                                            Write Review
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Review {currentProduct?.name}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Box className="review-form">
                        <Typography component="legend">Overall Rating</Typography>
                        <Rating
                            name="product-rating"
                            value={reviews[currentProduct?._id]?.rating || 0}
                            onChange={(_, value) => handleRatingChange(currentProduct?._id, value)}
                            precision={0.5}
                            size="large"
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Your Review"
                            value={reviews[currentProduct?._id]?.comment || ''}
                            onChange={(e) => handleReviewChange(currentProduct?._id, e.target.value)}
                            margin="normal"
                        />

                        <Box className="image-upload-section">
                            <Typography variant="subtitle2" gutterBottom>
                                Add Photos (optional)
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<ImageIcon />}
                            >
                                Upload Images
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(currentProduct?._id, e)}
                                />
                            </Button>
                            {images[currentProduct?._id] && (
                                <Box className="image-previews">
                                    {images[currentProduct?._id].map((file, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleReviewSubmit(currentProduct?._id)}
                        disabled={loading}
                    >
                        Submit Review
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderReview; 
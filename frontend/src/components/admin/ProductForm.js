import React, { useState, useEffect } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { uploadImage } from '../../services/uploadService';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
        featured: false,
        discount: 0
    });

    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                const result = await uploadImage(formData);
                return {
                    url: result.url,
                    alt: file.name
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedImages]
            }));
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <>
            <DialogTitle>
                {product ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} className="product-form">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                error={!!errors.price}
                                helperText={errors.price}
                                InputProps={{
                                    startAdornment: '$'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                error={!!errors.stock}
                                helperText={errors.stock}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                error={!!errors.category}
                                helperText={errors.category}
                            >
                                <MenuItem value="Cleaning Supplies">Cleaning Supplies</MenuItem>
                                <MenuItem value="Tools">Tools</MenuItem>
                                <MenuItem value="Equipment">Equipment</MenuItem>
                                <MenuItem value="Chemicals">Chemicals</MenuItem>
                                <MenuItem value="Accessories">Accessories</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Discount (%)"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                InputProps={{
                                    inputProps: { min: 0, max: 100 }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Product Images</Typography>
                            <Box className="image-upload-container">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={image.url} alt={image.alt} />
                                        <IconButton
                                            className="remove-image"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                ))}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<AddIcon />}
                                    disabled={uploading}
                                >
                                    Add Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Save Product'}
                </Button>
            </DialogActions>
        </>
    );
};

export default ProductForm; 
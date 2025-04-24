import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Box,
    Typography,
    IconButton,
    LinearProgress,
    ImageList,
    ImageListItem,
    Alert,
    Button
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Star as MainImageIcon
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import './ProductImageUpload.css';

const ProductImageUpload = ({ productId, existingImages = [], onImagesUpdate }) => {
    const [uploadProgress, setUploadProgress] = useState({});
    const [images, setImages] = useState(existingImages);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length !== acceptedFiles.length) {
            setError('Some files were rejected. Please only upload images under 5MB.');
        }

        for (const file of validFiles) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('productId', productId);

            try {
                setUploadProgress(prev => ({
                    ...prev,
                    [file.name]: 0
                }));

                const response = await productService.uploadProductImage(
                    formData,
                    (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(prev => ({
                            ...prev,
                            [file.name]: progress
                        }));
                    }
                );

                setImages(prev => [...prev, response.data]);
                onImagesUpdate([...images, response.data]);

                // Clear progress after successful upload
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            } catch (err) {
                setError(`Failed to upload ${file.name}: ${err.message}`);
            }
        }
    }, [productId, images, onImagesUpdate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxSize: 5 * 1024 * 1024 // 5MB
    });

    const handleDeleteImage = async (imageId) => {
        try {
            await productService.deleteProductImage(productId, imageId);
            const updatedImages = images.filter(img => img.id !== imageId);
            setImages(updatedImages);
            onImagesUpdate(updatedImages);
        } catch (err) {
            setError(`Failed to delete image: ${err.message}`);
        }
    };

    const handleSetMainImage = async (imageId) => {
        try {
            await productService.setMainProductImage(productId, imageId);
            const updatedImages = images.map(img => ({
                ...img,
                isMain: img.id === imageId
            }));
            setImages(updatedImages);
            onImagesUpdate(updatedImages);
        } catch (err) {
            setError(`Failed to set main image: ${err.message}`);
        }
    };

    return (
        <Box className="product-image-upload">
            {error && (
                <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{ marginBottom: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Box
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
                <input {...getInputProps()} />
                <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="body1">
                    {isDragActive
                        ? 'Drop the images here...'
                        : 'Drag & drop images here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Supported formats: JPEG, PNG, WebP (max 5MB)
                </Typography>
            </Box>

            {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <Box key={fileName} sx={{ mt: 2 }}>
                    <Typography variant="body2">{fileName}</Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            ))}

            <ImageList cols={4} gap={16} sx={{ mt: 2 }}>
                {images.map((image) => (
                    <ImageListItem key={image.id} className="image-list-item">
                        <img
                            src={image.url}
                            alt={`Product ${productId}`}
                            loading="lazy"
                        />
                        <Box className="image-actions">
                            <IconButton
                                onClick={() => handleSetMainImage(image.id)}
                                className={image.isMain ? 'main-image' : ''}
                                title={image.isMain ? 'Main image' : 'Set as main image'}
                            >
                                <MainImageIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleDeleteImage(image.id)}
                                title="Delete image"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
};

export default ProductImageUpload; 
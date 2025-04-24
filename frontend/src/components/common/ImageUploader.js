import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Alert,
    IconButton
} from '@mui/material';
import { 
    CloudUpload as UploadIcon,
    Close as CloseIcon 
} from '@mui/icons-material';
import { imageHandlingService } from '../../services/imageHandlingService';
import './ImageUploader.css';

const ImageUploader = ({ 
    onUploadComplete, 
    maxFiles = 5,
    productId,
    showPreviews = true 
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});

    const handleUpload = async (files) => {
        setUploading(true);
        setError(null);

        const uploadPromises = files.map(async (file) => {
            try {
                // Create preview
                const previewUrl = URL.createObjectURL(file);
                setPreviews(prev => [...prev, { id: file.name, url: previewUrl }]);

                // Upload file
                const result = await imageHandlingService.uploadImage(file, productId);
                
                // Cleanup preview
                URL.revokeObjectURL(previewUrl);
                setPreviews(prev => prev.filter(p => p.id !== file.name));

                return result;
            } catch (err) {
                setError(`Failed to upload ${file.name}: ${err.message}`);
                return null;
            }
        });

        try {
            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(Boolean);
            onUploadComplete?.(successfulUploads);
        } finally {
            setUploading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length) {
            handleUpload(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles,
        maxSize: 5 * 1024 * 1024,
    });

    const removePreview = (previewId) => {
        setPreviews(prev => prev.filter(p => p.id !== previewId));
    };

    return (
        <Box className="image-uploader">
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
                className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Typography variant="body1">
                            {isDragActive
                                ? 'Drop the images here...'
                                : 'Drag & drop images here, or click to select'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Maximum {maxFiles} files (JPEG, PNG, WebP, max 5MB each)
                        </Typography>
                    </>
                )}
            </Box>

            {showPreviews && previews.length > 0 && (
                <Box className="preview-container">
                    {previews.map((preview) => (
                        <Box key={preview.id} className="preview-item">
                            <img src={preview.url} alt="Upload preview" />
                            <IconButton
                                className="remove-preview"
                                onClick={() => removePreview(preview.id)}
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>
                            {uploadProgress[preview.id] && (
                                <CircularProgress
                                    variant="determinate"
                                    value={uploadProgress[preview.id]}
                                    size={24}
                                    className="upload-progress"
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageUploader; 
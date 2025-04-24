import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Modal,
    Fade,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Typography
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    Close,
    ZoomIn,
    ZoomOut,
    RotateLeft,
    RotateRight
} from '@mui/icons-material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './ProductGallery.css';

const ProductGallery = ({ 
    images, 
    initialIndex = 0,
    onImageChange,
    aspectRatio = '1:1'
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        onImageChange?.(currentIndex);
    }, [currentIndex, onImageChange]);

    const handlePrevious = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setRotation(0);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setRotation(0);
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
        setRotation(0);
    };

    const handleRotate = (direction) => {
        setRotation(prev => prev + (direction === 'left' ? -90 : 90));
    };

    const handleImageLoad = () => {
        setLoading(false);
    };

    const renderThumbnails = () => (
        <Box className="thumbnails-container">
            {images.map((image, index) => (
                <Box
                    key={image.id}
                    className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                >
                    <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.alt || `Product thumbnail ${index + 1}`}
                        loading="lazy"
                    />
                </Box>
            ))}
        </Box>
    );

    const renderLightbox = () => (
        <Modal
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            closeAfterTransition
            className="gallery-lightbox"
        >
            <Fade in={lightboxOpen}>
                <Box className="lightbox-content">
                    <IconButton
                        className="close-button"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <Close />
                    </IconButton>
                    
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                        centerOnInit={true}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <Box className="zoom-controls">
                                    <IconButton onClick={() => zoomIn()}>
                                        <ZoomIn />
                                    </IconButton>
                                    <IconButton onClick={() => zoomOut()}>
                                        <ZoomOut />
                                    </IconButton>
                                    <IconButton onClick={() => handleRotate('left')}>
                                        <RotateLeft />
                                    </IconButton>
                                    <IconButton onClick={() => handleRotate('right')}>
                                        <RotateRight />
                                    </IconButton>
                                    <IconButton onClick={() => resetTransform()}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Box>
                                
                                <TransformComponent>
                                    <img
                                        src={images[currentIndex].url}
                                        alt={images[currentIndex].alt || `Product image ${currentIndex + 1}`}
                                        style={{ 
                                            transform: `rotate(${rotation}deg)`,
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>

                    <Box className="lightbox-navigation">
                        <IconButton onClick={handlePrevious}>
                            <ArrowBack />
                        </IconButton>
                        <Typography>
                            {currentIndex + 1} / {images.length}
                        </Typography>
                        <IconButton onClick={handleNext}>
                            <ArrowForward />
                        </IconButton>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );

    if (!images || images.length === 0) {
        return (
            <Box className="gallery-empty">
                <Typography variant="body1">No images available</Typography>
            </Box>
        );
    }

    return (
        <Box className="product-gallery">
            <Box 
                className="main-image-container"
                style={{ aspectRatio }}
                onClick={() => setLightboxOpen(true)}
            >
                {loading && (
                    <Box className="loading-overlay">
                        <CircularProgress />
                    </Box>
                )}
                <img
                    src={images[currentIndex].url}
                    alt={images[currentIndex].alt || `Product image ${currentIndex + 1}`}
                    onLoad={handleImageLoad}
                />
                
                {!isMobile && (
                    <>
                        <IconButton 
                            className="nav-button prev"
                            onClick={handlePrevious}
                        >
                            <ArrowBack />
                        </IconButton>
                        <IconButton 
                            className="nav-button next"
                            onClick={handleNext}
                        >
                            <ArrowForward />
                        </IconButton>
                    </>
                )}
                
                <Box className="zoom-hint">
                    <ZoomIn /> Click to zoom
                </Box>
            </Box>

            {images.length > 1 && renderThumbnails()}
            {renderLightbox()}
        </Box>
    );
};

export default ProductGallery; 
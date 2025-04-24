import React from 'react';
import ProductGallery from '../gallery/ProductGallery';

const ProductDetail = ({ product }) => {
    const handleImageChange = (index) => {
        console.log(`Viewing image ${index + 1}`);
    };

    return (
        <div className="product-detail">
            <ProductGallery
                images={product.images}
                initialIndex={0}
                onImageChange={handleImageChange}
                aspectRatio="4:3" // Optional: customize aspect ratio
            />
            {/* Rest of product details */}
        </div>
    );
};

export default ProductDetail; 
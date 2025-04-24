import React from 'react';
import ImageUploader from '../common/ImageUploader';

const ProductForm = ({ productId }) => {
    const handleImagesUploaded = (uploadedImages) => {
        console.log('Uploaded images:', uploadedImages);
        // Update your product state with new images
    };

    return (
        <div>
            <h2>Product Images</h2>
            <ImageUploader
                productId={productId}
                onUploadComplete={handleImagesUploaded}
                maxFiles={5}
                showPreviews={true}
            />
            {/* Rest of your form */}
        </div>
    );
}; 
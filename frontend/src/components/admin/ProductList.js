import React, { useState } from 'react';

const ProductList = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div>
            {loading ? (
                <div className="loading-card">
                    <div className="skeleton-line full"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-line short"></div>
                </div>
            ) : (
                // Actual content
            )}
        </div>
    );
};

export default ProductList; 
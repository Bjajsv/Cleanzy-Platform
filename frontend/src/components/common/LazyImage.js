import React from 'react';

const LazyImage = ({ src, alt, placeholder }) => {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
            }}
        />
    );
};

export default LazyImage; 
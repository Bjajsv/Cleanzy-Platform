import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ProductImageZoom = ({ imageUrl }) => {
    return (
        <TransformWrapper>
            <TransformComponent>
                <img src={imageUrl} alt="Product zoom view" />
            </TransformComponent>
        </TransformWrapper>
    );
}; 
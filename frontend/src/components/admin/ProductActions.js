import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const ProductActions = ({ product }) => {
    const { hasPermission } = usePermissions();

    return (
        <div className="product-actions">
            {hasPermission('view_products') && (
                <button onClick={() => handleViewProduct(product)}>
                    View
                </button>
            )}
            
            {hasPermission('edit_products') && (
                <button onClick={() => handleEditProduct(product)}>
                    Edit
                </button>
            )}
            
            {hasPermission('delete_products') && (
                <button onClick={() => handleDeleteProduct(product)}>
                    Delete
                </button>
            )}
        </div>
    );
}; 
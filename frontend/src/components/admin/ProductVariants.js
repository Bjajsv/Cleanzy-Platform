import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';

const ProductVariants = ({ variants, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [currentVariant, setCurrentVariant] = useState(null);
    const [variantData, setVariantData] = useState({
        size: '',
        color: '',
        sku: '',
        price: '',
        stock: ''
    });

    const handleAddVariant = () => {
        setCurrentVariant(null);
        setVariantData({
            size: '',
            color: '',
            sku: '',
            price: '',
            stock: ''
        });
        setOpen(true);
    };

    const handleEditVariant = (variant) => {
        setCurrentVariant(variant);
        setVariantData(variant);
        setOpen(true);
    };

    const handleSaveVariant = () => {
        if (currentVariant) {
            // Update existing variant
            const updatedVariants = variants.map(v =>
                v.id === currentVariant.id ? variantData : v
            );
            onUpdate(updatedVariants);
        } else {
            // Add new variant
            onUpdate([...variants, { ...variantData, id: Date.now() }]);
        }
        setOpen(false);
    };

    const handleDeleteVariant = (variantId) => {
        const updatedVariants = variants.filter(v => v.id !== variantId);
        onUpdate(updatedVariants);
    };

    return (
        <div className="product-variants">
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddVariant}
                className="add-variant-button"
            >
                Add Variant
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SKU</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {variants.map((variant) => (
                            <TableRow key={variant.id}>
                                <TableCell>{variant.sku}</TableCell>
                                <TableCell>{variant.size}</TableCell>
                                <TableCell>{variant.color}</TableCell>
                                <TableCell>${variant.price}</TableCell>
                                <TableCell>{variant.stock}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleEditVariant(variant)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteVariant(variant.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {currentVariant ? 'Edit Variant' : 'Add Variant'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="SKU"
                        value={variantData.sku}
                        onChange={(e) => setVariantData({
                            ...variantData,
                            sku: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Size"
                        value={variantData.size}
                        onChange={(e) => setVariantData({
                            ...variantData,
                            size: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Color"
                        value={variantData.color}
                        onChange={(e) => setVariantData({
                            ...variantData,
                            color: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Price"
                        value={variantData.price}
                        onChange={(e) => setVariantData({
                            ...variantData,
                            price: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Stock"
                        value={variantData.stock}
                        onChange={(e) => setVariantData({
                            ...variantData,
                            stock: e.target.value
                        })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveVariant} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductVariants; 
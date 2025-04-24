import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Chip,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import { inventoryService } from '../../services/inventoryService';

const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [adjustment, setAdjustment] = useState({
        quantity: 0,
        reason: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await inventoryService.getInventory();
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleAdjustStock = (product) => {
        setSelectedProduct(product);
        setAdjustment({ quantity: 0, reason: '' });
        setOpen(true);
    };

    const handleSaveAdjustment = async () => {
        try {
            await inventoryService.adjustStock(
                selectedProduct._id,
                adjustment.quantity,
                adjustment.reason
            );
            setOpen(false);
            fetchInventory();
        } catch (error) {
            console.error('Error adjusting stock:', error);
        }
    };

    const getStockStatus = (stock, threshold) => {
        if (stock <= 0) return { label: 'Out of Stock', color: 'error' };
        if (stock <= threshold) return { label: 'Low Stock', color: 'warning' };
        return { label: 'In Stock', color: 'success' };
    };

    return (
        <div className="inventory-management">
            <Typography variant="h6" gutterBottom>
                Inventory Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Current Stock</TableCell>
                            <TableCell>Low Stock Threshold</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((item) => {
                            const status = getStockStatus(
                                item.stock,
                                item.lowStockThreshold
                            );
                            return (
                                <TableRow key={item._id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>{item.lowStockThreshold}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={status.label}
                                            color={status.color}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleAdjustStock(item)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleAdjustStock(item)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <IconButton>
                                            <HistoryIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Adjust Stock</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={adjustment.quantity}
                        onChange={(e) => setAdjustment({
                            ...adjustment,
                            quantity: parseInt(e.target.value)
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Reason"
                        value={adjustment.reason}
                        onChange={(e) => setAdjustment({
                            ...adjustment,
                            reason: e.target.value
                        })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveAdjustment} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default InventoryManagement; 
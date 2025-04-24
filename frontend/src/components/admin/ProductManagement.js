import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Dialog,
    MenuItem,
    Chip,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import ProductForm from './ProductForm';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        searchQuery: '',
        stockStatus: 'all'
    });

    useEffect(() => {
        fetchProducts();
    }, [page, rowsPerPage, filters]);

    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProducts({
                page: page + 1,
                limit: rowsPerPage,
                ...filters
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setOpenDialog(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(productId);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (selectedProduct) {
                await productService.updateProduct(selectedProduct._id, productData);
            } else {
                await productService.createProduct(productData);
            }
            setOpenDialog(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'error' };
        if (stock < 10) return { label: 'Low Stock', color: 'warning' };
        return { label: 'In Stock', color: 'success' };
    };

    return (
        <div className="product-management">
            <Grid container spacing={3}>
                <Grid item xs={12} className="header">
                    <Typography variant="h5">Product Management</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddProduct}
                    >
                        Add New Product
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search products..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({
                            ...filters,
                            searchQuery: e.target.value
                        })}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Category"
                        value={filters.category}
                        onChange={(e) => setFilters({
                            ...filters,
                            category: e.target.value
                        })}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="Cleaning Supplies">Cleaning Supplies</MenuItem>
                        <MenuItem value="Tools">Tools</MenuItem>
                        <MenuItem value="Equipment">Equipment</MenuItem>
                        <MenuItem value="Chemicals">Chemicals</MenuItem>
                        <MenuItem value="Accessories">Accessories</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Stock Status"
                        value={filters.stockStatus}
                        onChange={(e) => setFilters({
                            ...filters,
                            stockStatus: e.target.value
                        })}
                    >
                        <MenuItem value="all">All Stock Status</MenuItem>
                        <MenuItem value="in_stock">In Stock</MenuItem>
                        <MenuItem value="low_stock">Low Stock</MenuItem>
                        <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="product-thumbnail"
                                                />
                                            ) : (
                                                <ImageIcon />
                                            )}
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStockStatus(product.stock).label}
                                                color={getStockStatus(product.stock).color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleEditProduct(product)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteProduct(product._id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={products.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </TableContainer>
                </Grid>
            </Grid>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <ProductForm
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    onClose={() => setOpenDialog(false)}
                />
            </Dialog>
        </div>
    );
};

export default ProductManagement; 
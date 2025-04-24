import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Chip,
    IconButton,
    Dialog,
    TextField,
    MenuItem,
    Grid
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { orderService } from '../../services/orderService';
import OrderDetails from './OrderDetails';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        searchQuery: ''
    });

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, filters]);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAllOrders({
                page: page + 1,
                limit: rowsPerPage,
                ...filters
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            processing: 'info',
            shipped: 'primary',
            delivered: 'success',
            cancelled: 'error'
        };
        return colors[status] || 'default';
    };

    return (
        <div className="order-management">
            <Grid container spacing={3} className="filters-container">
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search orders..."
                        InputProps={{
                            startAdornment: <SearchIcon />
                        }}
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
                        label="Status"
                        value={filters.status}
                        onChange={(e) => setFilters({
                            ...filters,
                            status: e.target.value
                        })}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Date Range"
                        value={filters.dateRange}
                        onChange={(e) => setFilters({
                            ...filters,
                            dateRange: e.target.value
                        })}
                    >
                        <MenuItem value="all">All Time</MenuItem>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="week">This Week</MenuItem>
                        <MenuItem value="month">This Month</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>
                                    {order.user.firstName} {order.user.lastName}
                                </TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>${order.totalPrice}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.isPaid ? 'Paid' : 'Pending'}
                                        color={order.isPaid ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={orders.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedOrder && (
                    <OrderDetails
                        order={selectedOrder}
                        onStatusChange={handleStatusChange}
                        onClose={() => setOpenDialog(false)}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default OrderManagement; 
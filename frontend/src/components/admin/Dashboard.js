import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Grid,
    Paper
} from '@mui/material';
import {
    Menu as MenuIcon,
    ShoppingCart,
    People,
    Inventory,
    Assessment,
    Settings
} from '@mui/icons-material';
import { useNavigate, Route, Routes } from 'react-router-dom';
import OrderManagement from './OrderManagement';
import './Dashboard.css';

const Dashboard = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
        { text: 'Customers', icon: <People />, path: '/admin/customers' },
        { text: 'Products', icon: <Inventory />, path: '/admin/products' },
        { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
        { text: 'Settings', icon: <Settings />, path: '/admin/settings' }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" className="admin-appbar">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={() => setOpen(!open)}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Cleanzy Admin
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                open={open}
                className="admin-drawer"
            >
                <Toolbar />
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" className="admin-content">
                <Toolbar />
                <Routes>
                    <Route path="/orders/*" element={<OrderManagement />} />
                    {/* Add other routes as needed */}
                </Routes>
            </Box>
        </Box>
    );
};

export default Dashboard; 
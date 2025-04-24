import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';

const ProductAnalytics = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryPerformance, setCategoryPerformance] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            const [sales, products, categories] = await Promise.all([
                analyticsService.getSalesData(timeRange),
                analyticsService.getTopProducts(timeRange),
                analyticsService.getCategoryPerformance(timeRange)
            ]);

            setSalesData(sales.data);
            setTopProducts(products.data);
            setCategoryPerformance(categories.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    return (
        <div className="product-analytics">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl>
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <MenuItem value="week">Last Week</MenuItem>
                            <MenuItem value="month">Last Month</MenuItem>
                            <MenuItem value="year">Last Year</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper className="chart-container">
                        <Typography variant="h6">Sales Trend</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#8884d8"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper className="chart-container">
                        <Typography variant="h6">Top Products</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper className="chart-container">
                        <Typography variant="h6">Category Performance</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" />
                                <Bar dataKey="units" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProductAnalytics; 
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Grid,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Timeline,
    Star,
    TrendingUp,
    TrendingDown,
    Sentiment,
    Warning,
    Info
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { reviewAnalyticsService } from '../../services/reviewAnalyticsService';
import './ReviewAnalyticsDashboard.css';

const ReviewAnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('30');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await reviewAnalyticsService.getAnalytics(timeRange);
            setAnalytics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!analytics) return null;

    const COLORS = ['#4caf50', '#ff9800', '#f44336'];

    return (
        <Box className="review-analytics-dashboard">
            <Box className="dashboard-header">
                <Typography variant="h5">Review Analytics</Typography>
                <FormControl size="small">
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        label="Time Range"
                    >
                        <MenuItem value="7">Last 7 days</MenuItem>
                        <MenuItem value="30">Last 30 days</MenuItem>
                        <MenuItem value="90">Last 90 days</MenuItem>
                        <MenuItem value="365">Last year</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {/* Key Metrics */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Average Rating
                            </Typography>
                            <Typography variant="h4">
                                {analytics.averageRating.toFixed(1)}
                                <Star color="primary" sx={{ ml: 1, fontSize: '0.8em' }} />
                            </Typography>
                            <Typography variant="body2" color={
                                analytics.ratingTrend > 0 ? 'success.main' : 'error.main'
                            }>
                                {analytics.ratingTrend > 0 ? <TrendingUp /> : <TrendingDown />}
                                {Math.abs(analytics.ratingTrend)}% vs previous period
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Reviews
                            </Typography>
                            <Typography variant="h4">
                                {analytics.totalReviews}
                            </Typography>
                            <Typography variant="body2">
                                {analytics.reviewsPerDay} reviews/day
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Response Rate
                            </Typography>
                            <Typography variant="h4">
                                {analytics.responseRate}%
                            </Typography>
                            <Typography variant="body2">
                                Avg response time: {analytics.averageResponseTime}h
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Sentiment Score
                            </Typography>
                            <Typography variant="h4">
                                {analytics.sentimentScore}%
                                <Sentiment color="primary" sx={{ ml: 1 }} />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Rating Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper className="chart-container">
                        <Typography variant="h6" gutterBottom>
                            Rating Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.ratingDistribution}
                                    dataKey="value"
                                    nameKey="rating"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    label
                                >
                                    {analytics.ratingDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Review Trend */}
                <Grid item xs={12} md={6}>
                    <Paper className="chart-container">
                        <Typography variant="h6" gutterBottom>
                            Review Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.reviewTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ChartTooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#2196f3"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Top Products by Reviews */}
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Total Reviews</TableCell>
                                    <TableCell align="center">Average Rating</TableCell>
                                    <TableCell align="center">Sentiment</TableCell>
                                    <TableCell align="center">Critical Issues</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {analytics.topProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="center">{product.totalReviews}</TableCell>
                                        <TableCell align="center">
                                            {product.averageRating}
                                            <Star fontSize="small" sx={{ ml: 0.5, color: '#ffd700' }} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={product.sentiment}
                                                color={
                                                    product.sentiment === 'Positive' ? 'success' :
                                                    product.sentiment === 'Neutral' ? 'default' : 'error'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {product.criticalIssues > 0 && (
                                                <Tooltip title={`${product.criticalIssues} critical issues reported`}>
                                                    <IconButton color="error" size="small">
                                                        <Warning />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewAnalyticsDashboard; 
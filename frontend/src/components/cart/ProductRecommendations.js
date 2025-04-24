import React, { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Rating,
    Skeleton,
    IconButton
} from '@mui/material';
import {
    AddShoppingCart as AddCartIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import './ProductRecommendations.css';

const ProductRecommendations = ({ currentCartItems }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchRecommendations();
    }, [currentCartItems]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            // Get current product categories from cart
            const cartCategories = currentCartItems.map(item => item.category);
            
            // Get recommendations based on cart items
            const response = await productService.getRecommendations({
                categories: cartCategories,
                currentItems: currentCartItems.map(item => item.productId),
                limit: 4
            });

            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const LoadingSkeleton = () => (
        <Grid item xs={12} sm={6} md={3}>
            <Card className="recommendation-card">
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Skeleton variant="text" height={24} width="80%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
                <CardActions>
                    <Skeleton variant="rectangular" height={36} width={100} />
                </CardActions>
            </Card>
        </Grid>
    );

    return (
        <div className="recommendations-container">
            <Typography variant="h6" className="section-title">
                Recommended Products
            </Typography>
            <Grid container spacing={3}>
                {loading ? (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                ) : (
                    recommendations.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product._id}>
                            <Card className="recommendation-card">
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.images[0].url}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <CardContent>
                                    <Typography variant="h6" className="product-name">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {product.category}
                                    </Typography>
                                    <div className="rating-price">
                                        <Rating
                                            value={product.rating}
                                            readOnly
                                            size="small"
                                        />
                                        <Typography variant="h6" color="primary">
                                            ${product.price.toFixed(2)}
                                        </Typography>
                                    </div>
                                </CardContent>
                                <CardActions className="card-actions">
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCartIcon />}
                                        onClick={() => handleAddToCart(product)}
                                        size="small"
                                    >
                                        Add to Cart
                                    </Button>
                                    <IconButton
                                        onClick={() => toggleFavorite(product._id)}
                                        color={favorites.includes(product._id) ? "error" : "default"}
                                        size="small"
                                    >
                                        {favorites.includes(product._id) ? (
                                            <FavoriteIcon />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </div>
    );
};

export default ProductRecommendations; 
import React, { useState, useEffect } from 'react';
import {
    TextField,
    InputAdornment,
    Drawer,
    Button,
    Chip,
    Slider,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    IconButton,
    Grid,
    Rating,
    Divider,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
    Sort as SortIcon
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import './SearchAndFilter.css';

const SearchAndFilter = ({ onSearchResults }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 1000],
        rating: 0,
        inStock: false,
        onSale: false
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [loading, setLoading] = useState(false);

    // Available filter options
    const categories = [
        'Cleaning Supplies',
        'Tools',
        'Equipment',
        'Chemicals',
        'Accessories'
    ];

    const sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'newest', label: 'Newest First' }
    ];

    useEffect(() => {
        // Debounce search to avoid too many API calls
        const timeoutId = setTimeout(() => {
            performSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters, sortBy]);

    const performSearch = async () => {
        try {
            setLoading(true);
            const response = await productService.searchProducts({
                query: searchQuery,
                filters,
                sortBy
            });
            onSearchResults(response.data);
            updateActiveFilters();
        } catch (error) {
            console.error('Error performing search:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateActiveFilters = () => {
        const active = [];
        
        if (filters.categories.length > 0) {
            active.push(...filters.categories);
        }
        
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
            active.push(`$${filters.priceRange[0]} - $${filters.priceRange[1]}`);
        }
        
        if (filters.rating > 0) {
            active.push(`${filters.rating}+ Stars`);
        }
        
        if (filters.inStock) {
            active.push('In Stock');
        }
        
        if (filters.onSale) {
            active.push('On Sale');
        }

        setActiveFilters(active);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleCategoryToggle = (category) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            categories: [],
            priceRange: [0, 1000],
            rating: 0,
            inStock: false,
            onSale: false
        });
        setSortBy('relevance');
    };

    const removeFilter = (filter) => {
        if (categories.includes(filter)) {
            handleCategoryToggle(filter);
        } else if (filter.includes('$')) {
            handleFilterChange('priceRange', [0, 1000]);
        } else if (filter.includes('Stars')) {
            handleFilterChange('rating', 0);
        } else if (filter === 'In Stock') {
            handleFilterChange('inStock', false);
        } else if (filter === 'On Sale') {
            handleFilterChange('onSale', false);
        }
    };

    return (
        <div className="search-filter-container">
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        className="search-input"
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => setDrawerOpen(true)}
                        className="filter-button"
                    >
                        Filters
                    </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        SelectProps={{
                            native: true
                        }}
                        className="sort-select"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            {activeFilters.length > 0 && (
                <div className="active-filters">
                    {activeFilters.map(filter => (
                        <Chip
                            key={filter}
                            label={filter}
                            onDelete={() => removeFilter(filter)}
                            className="filter-chip"
                        />
                    ))}
                    <Button
                        size="small"
                        onClick={handleClearFilters}
                        startIcon={<ClearIcon />}
                    >
                        Clear All
                    </Button>
                </div>
            )}

            <Drawer
                anchor={isMobile ? 'bottom' : 'right'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                classes={{
                    paper: 'filter-drawer'
                }}
            >
                <div className="filter-drawer-content">
                    <div className="filter-header">
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <ClearIcon />
                        </IconButton>
                    </div>

                    <Divider />

                    <div className="filter-section">
                        <Typography variant="subtitle1">Categories</Typography>
                        <FormGroup>
                            {categories.map(category => (
                                <FormControlLabel
                                    key={category}
                                    control={
                                        <Checkbox
                                            checked={filters.categories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                        />
                                    }
                                    label={category}
                                />
                            ))}
                        </FormGroup>
                    </div>

                    <Divider />

                    <div className="filter-section">
                        <Typography variant="subtitle1">Price Range</Typography>
                        <Slider
                            value={filters.priceRange}
                            onChange={(_, value) => handleFilterChange('priceRange', value)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                            valueLabelFormat={value => `$${value}`}
                        />
                        <div className="price-inputs">
                            <TextField
                                size="small"
                                type="number"
                                value={filters.priceRange[0]}
                                onChange={(e) => handleFilterChange('priceRange', [
                                    parseInt(e.target.value),
                                    filters.priceRange[1]
                                ])}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                            <Typography variant="body2">to</Typography>
                            <TextField
                                size="small"
                                type="number"
                                value={filters.priceRange[1]}
                                onChange={(e) => handleFilterChange('priceRange', [
                                    filters.priceRange[0],
                                    parseInt(e.target.value)
                                ])}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                        </div>
                    </div>

                    <Divider />

                    <div className="filter-section">
                        <Typography variant="subtitle1">Minimum Rating</Typography>
                        <Rating
                            value={filters.rating}
                            onChange={(_, value) => handleFilterChange('rating', value)}
                            size="large"
                        />
                    </div>

                    <Divider />

                    <div className="filter-section">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.inStock}
                                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                    />
                                }
                                label="In Stock Only"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.onSale}
                                        onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                                    />
                                }
                                label="On Sale"
                            />
                        </FormGroup>
                    </div>

                    <div className="filter-actions">
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                        >
                            Clear All
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setDrawerOpen(false)}
                            color="primary"
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default SearchAndFilter; 
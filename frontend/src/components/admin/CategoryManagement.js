import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { categoryService } from '../../services/categoryService';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryData, setCategoryData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = () => {
        setCurrentCategory(null);
        setCategoryData({ name: '', description: '' });
        setOpen(true);
    };

    const handleEditCategory = (category) => {
        setCurrentCategory(category);
        setCategoryData(category);
        setOpen(true);
    };

    const handleSaveCategory = async () => {
        try {
            if (currentCategory) {
                await categoryService.updateCategory(
                    currentCategory._id,
                    categoryData
                );
            } else {
                await categoryService.createCategory(categoryData);
            }
            setOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(categoryId);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div className="category-management">
            <div className="header">
                <Typography variant="h6">Categories</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCategory}
                >
                    Add Category
                </Button>
            </div>

            <Paper>
                <List>
                    {categories.map((category) => (
                        <ListItem key={category._id}>
                            <ListItemText
                                primary={category.name}
                                secondary={category.description}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleEditCategory(category)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteCategory(category._id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {currentCategory ? 'Edit Category' : 'Add Category'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Category Name"
                        value={categoryData.name}
                        onChange={(e) => setCategoryData({
                            ...categoryData,
                            name: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={categoryData.description}
                        onChange={(e) => setCategoryData({
                            ...categoryData,
                            description: e.target.value
                        })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveCategory} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoryManagement; 
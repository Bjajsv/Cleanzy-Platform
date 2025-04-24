import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

const CART_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload,
                lastActive: Date.now()
            };
        case 'ADD_ITEM':
            const existingItem = state.items.find(
                item => item.productId === action.payload.productId
            );
            const items = existingItem
                ? state.items.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                )
                : [...state.items, action.payload];
            return {
                ...state,
                items,
                lastActive: Date.now()
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
                lastActive: Date.now()
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(
                    item => item.productId !== action.payload
                ),
                lastActive: Date.now()
            };
        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                lastActive: Date.now()
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        lastActive: Date.now()
    });

    // Load cart from localStorage on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = await cartService.getCart();
                if (savedCart) {
                    const timeSinceLastActive = Date.now() - savedCart.lastActive;
                    if (timeSinceLastActive < CART_TIMEOUT) {
                        dispatch({ type: 'SET_CART', payload: savedCart.items });
                    } else {
                        await cartService.clearCart();
                    }
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        loadCart();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        const saveCart = async () => {
            try {
                await cartService.saveCart({
                    items: state.items,
                    lastActive: state.lastActive
                });
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        };

        saveCart();
    }, [state]);

    // Check cart timeout periodically
    useEffect(() => {
        const checkTimeout = () => {
            const timeSinceLastActive = Date.now() - state.lastActive;
            if (timeSinceLastActive >= CART_TIMEOUT) {
                dispatch({ type: 'CLEAR_CART' });
            }
        };

        const timeoutInterval = setInterval(checkTimeout, 60000); // Check every minute
        return () => clearInterval(timeoutInterval);
    }, [state.lastActive]);

    const addToCart = async (product, quantity = 1) => {
        try {
            const item = {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity
            };
            dispatch({ type: 'ADD_ITEM', payload: item });
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { productId, quantity }
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            dispatch({ type: 'REMOVE_ITEM', payload: productId });
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            dispatch({ type: 'CLEAR_CART' });
            await cartService.clearCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    const getCartTotal = () => {
        return state.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart: state,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                getCartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 
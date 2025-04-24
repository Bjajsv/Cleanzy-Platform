import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? action.payload : item
                )
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const cart = await cartService.getCart();
            dispatch({ type: 'SET_CART', payload: cart.items });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const item = await cartService.addToCart(productId, quantity);
            dispatch({ type: 'ADD_ITEM', payload: item });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const item = await cartService.updateCartItem(itemId, quantity);
            dispatch({ type: 'UPDATE_ITEM', payload: item });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await cartService.removeFromCart(itemId);
            dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    return (
        <CartContext.Provider
            value={{
                ...state,
                addToCart,
                updateCartItem,
                removeFromCart,
                refreshCart: loadCart
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
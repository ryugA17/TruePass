import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the cart item type
export interface CartItem {
  id: number;
  title: string;
  creator: string;
  price: string;
  image: string;
  quantity: number;
}

// Define the context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  clearCart: () => void;
  cartItemCount: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartItemCount: 0,
});

// Create provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Sample initial items
    {
      id: 1,
      title: 'Abstract Thought of Art',
      creator: 'ZafGod.eth',
      price: '0.00069',
      image: 'https://via.placeholder.com/400x400/1a237e/ffffff',
      quantity: 1,
    },
    {
      id: 2,
      title: 'Harvested Opulence',
      creator: 'Fame Identity',
      price: '0.005',
      image: 'https://via.placeholder.com/400x400/4a148c/ffffff',
      quantity: 1,
    },
  ]);

  // Calculate total number of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Increment quantity if item exists
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: number, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext); 
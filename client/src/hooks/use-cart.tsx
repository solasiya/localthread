import { createContext, ReactNode, useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    salePrice: number | null;
    images: string[];
    stock: number;
    [key: string]: any;
  };
};

type CartContextType = {
  cartItems: CartItem[];
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: any;
  updateCartItem: any;
  removeFromCart: any;
  clearCart: any;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart items
  const { 
    data: cartItems = [], 
    isLoading,
    refetch: refetchCart
  } = useQuery({
    queryKey: ['/api/cart'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/cart', {
          credentials: 'include'
        });
        
        if (res.status === 401) {
          // Not authenticated, return empty cart
          return [];
        }
        
        if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        return res.json();
      } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Add item to cart
  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number, quantity: number }) => {
      const res = await apiRequest("POST", "/api/cart", { productId, quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      // Optionally open the cart when item is added
      setIsCartOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add item",
        description: error.message || "Could not add item to cart",
        variant: "destructive",
      });
    },
  });

  // Update cart item quantity
  const updateCartItem = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update item",
        description: error.message || "Could not update cart item",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeFromCart = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message || "Could not remove item from cart",
        variant: "destructive",
      });
    },
  });

  // Clear entire cart
  const clearCart = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to clear cart",
        description: error.message || "Could not clear your cart",
        variant: "destructive",
      });
    },
  });

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

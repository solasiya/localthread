import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const CartSidebar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartItem, 
    removeFromCart,
    cartTotal
  } = useCart();
  
  // Fixed shipping cost
  const shippingCost = 150.00;
  
  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isCartOpen && !target.closest('#cartSidebar') && !target.closest('[data-cart-toggle]')) {
        setIsCartOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateCartItem.mutate(
      { id: itemId, quantity: newQuantity },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update cart. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleRemoveItem = (itemId: number) => {
    removeFromCart.mutate(
      { id: itemId },
      {
        onSuccess: () => {
          toast({
            title: "Item removed",
            description: "Item has been removed from your cart.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to remove item. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "default",
      });
      setIsCartOpen(false);
      window.location.href = "/auth?redirect=checkout";
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "default",
      });
      return;
    }
    
    window.location.href = "/checkout";
  };

  return (
    <>
      {/* Cart Sidebar */}
      <div 
        id="cartSidebar" 
        className={`fixed right-0 top-0 w-full md:w-96 h-full bg-white shadow-xl transform transition-transform z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-heading font-bold text-lg">Your Cart ({cartItems.length})</h3>
            <button 
              className="text-neutral-500 hover:text-primary"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="bg-neutral-100 p-6 rounded-full mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 text-neutral-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium mb-2">Your cart is empty</h4>
                <p className="text-neutral-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Button 
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.href = "/shop";
                  }}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex border-b border-neutral-200 pb-4">
                    <Link href={`/product/${item.product.id}`} onClick={() => setIsCartOpen(false)}>
                      <img 
                        src={Array.isArray(item.product.images) ? item.product.images[0] : ''}
                        className="w-20 h-20 object-cover rounded-md cursor-pointer" 
                        alt={item.product.name} 
                      />
                    </Link>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-neutral-500">Brand Name</p>
                          <h4 className="font-medium">{item.product.name}</h4>
                        </div>
                        <button 
                          className="text-neutral-400 hover:text-primary"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex border border-neutral-300 rounded-md">
                          <button 
                            className="px-2 py-1 text-neutral-500"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 border-x border-neutral-300">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-neutral-500"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-bold text-primary">
                          R {((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Summary */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-100">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <p className="text-neutral-600">Subtotal</p>
                <p className="font-medium">R {cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-neutral-600">Shipping</p>
                <p className="font-medium">R {cartItems.length > 0 ? shippingCost.toFixed(2) : '0.00'}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <p className="font-bold">Total</p>
                <p className="font-bold text-primary">
                  R {cartItems.length > 0 ? (cartTotal + shippingCost).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
            <Button 
              variant="outline" 
              className="w-full mt-2 border border-secondary text-secondary hover:bg-secondary hover:text-white"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overlay for Cart Sidebar */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default CartSidebar;

import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
          setTimeout(() => setIsAddingToCart(false), 500);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to add product to cart. Please try again.",
            variant: "destructive",
          });
          setIsAddingToCart(false);
        },
      }
    );
  };
  
  // Determine if product is new (less than 7 days old)
  const isNew = new Date(product.createdAt).getTime() > 
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  
  // Determine if product is on sale
  const isOnSale = product.salePrice !== null && product.salePrice < product.price;
  
  // Get the main product image
  const mainImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : "https://via.placeholder.com/600x800?text=No+Image";
  
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-lg cursor-pointer">
        <div className="relative">
          <img 
            src={mainImage} 
            className="w-full h-64 object-cover" 
            alt={product.name} 
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-primary text-white">New</Badge>
            )}
            {isOnSale && (
              <Badge className="bg-accent text-secondary">Sale</Badge>
            )}
            {product.stock <= 0 && (
              <Badge variant="outline" className="bg-destructive text-white">Out of Stock</Badge>
            )}
          </div>
          <div className="absolute top-0 right-0 p-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="rounded-full bg-white text-neutral-600 hover:bg-primary hover:text-white">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-white text-neutral-600 hover:bg-primary hover:text-white">
              <Eye className="h-5 w-5" />
              <span className="sr-only">Quick View</span>
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              {/* Assuming we would have store data integrated */}
              <p className="text-sm text-neutral-500">Brand Name</p>
              <h3 className="font-medium text-neutral-800">{product.name}</h3>
            </div>
            <div className="flex text-accent text-xs">
              {/* This would be calculated from actual reviews */}
              <p className="flex items-center">
                <span className="mr-1">4.5</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              {isOnSale ? (
                <>
                  <p className="font-bold text-lg text-primary">R {product.salePrice.toFixed(2)}</p>
                  <p className="text-sm text-neutral-500 line-through">R {product.price.toFixed(2)}</p>
                </>
              ) : (
                <p className="font-bold text-lg text-primary">R {product.price.toFixed(2)}</p>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className={`${isAddingToCart ? 'bg-primary text-white' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAddingToCart}
            >
              {isAddingToCart ? 'Added!' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

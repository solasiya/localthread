import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  Shield, 
  Minus, 
  Plus,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { formatCurrency, getDiscountPercentage, isNewProduct } from "@/lib/utils";

const ProductPage = () => {
  const [_, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : 0;
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
    enabled: !!productId,
  });

  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
  } = useQuery({
    queryKey: ['/api/products', productId, 'reviews'],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    },
    enabled: !!productId,
  });

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (product && product.stock > quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to add product to cart",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-200 rounded-lg aspect-square mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg aspect-square"></div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-24 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate average rating from reviews
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Check if product is new
  const isNew = isNewProduct(product.createdAt);
  
  // Check if product is on sale
  const isOnSale = product.salePrice !== null && product.salePrice < product.price;
  
  // Calculate discount percentage if on sale
  const discountPercentage = isOnSale 
    ? getDiscountPercentage(product.price, product.salePrice as number)
    : 0;

  // Get a valid image array, ensuring it's an array even if API returns string or empty
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://via.placeholder.com/600x800?text=No+Image"];

  return (
    <>
      <Helmet>
        <title>{product.name} | LocalThreads Marketplace</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href="/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink>{product.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              <div className="mb-4 relative">
                <img 
                  src={productImages[selectedImageIndex]} 
                  alt={product.name}
                  className="w-full rounded-lg object-cover aspect-square"
                />
                
                {/* Product badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {isNew && (
                    <Badge className="bg-primary text-white">New</Badge>
                  )}
                  {isOnSale && (
                    <Badge className="bg-accent text-secondary">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Thumbnail gallery */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="w-full md:w-1/2">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-neutral-500">Brand Name</span>
                <Link href={`/shop?store=${product.storeId}`} className="text-primary hover:underline">
                  View Store
                </Link>
              </div>
              
              <h1 className="text-3xl font-bold font-heading mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-accent mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
              
              <div className="mb-6">
                {isOnSale ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-primary">{formatCurrency(product.salePrice || 0)}</span>
                    <span className="text-lg text-neutral-500 line-through">{formatCurrency(product.price)}</span>
                    <Badge className="bg-accent text-secondary">{discountPercentage}% OFF</Badge>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-neutral-600">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="mr-3 font-medium">Quantity:</span>
                  <div className="flex border border-neutral-300 rounded-md">
                    <button
                      className="px-3 py-2 text-neutral-500 hover:bg-neutral-100"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <Input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <button
                      className="px-3 py-2 text-neutral-500 hover:bg-neutral-100"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-neutral-500">
                    {product.stock} items available
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-4 mb-8">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addToCart.isPending}
                >
                  {addToCart.isPending ? (
                    "Adding..."
                  ) : product.stock <= 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-secondary" />
                  <span className="text-sm">Free delivery over R1000</span>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2 text-secondary" />
                  <span className="text-sm">30-day returns</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-secondary" />
                  <span className="text-sm">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs: Details, Reviews, etc. */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b">
                <TabsTrigger value="description">Product Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="py-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-4">Product Details</h3>
                  <p>{product.description}</p>
                  
                  {/* This would be expanded with more product details */}
                  <h4 className="text-lg font-semibold mt-6 mb-2">Features</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>South African made</li>
                    <li>High-quality materials</li>
                    <li>Ethically produced</li>
                    <li>Authentic design</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="py-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex text-accent mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < Math.round(averageRating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium">
                      {averageRating.toFixed(1)} out of 5
                    </span>
                  </div>
                  
                  {reviews.length === 0 ? (
                    <div className="bg-neutral-100 p-6 rounded-lg text-center">
                      <p className="text-neutral-600 mb-4">This product has no reviews yet.</p>
                      {user ? (
                        <Button>Be the first to review</Button>
                      ) : (
                        <Link href="/auth">
                          <Button variant="outline">Login to leave a review</Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <div className="bg-neutral-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                <span className="font-medium">{review.userId.toString().charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium">Customer {review.userId}</p>
                                <p className="text-sm text-neutral-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex text-accent">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${i < review.rating ? 'fill-current' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-neutral-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="py-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
                  <p>We deliver to all major cities in South Africa. Standard delivery takes 3-5 working days.</p>
                  
                  <h4 className="text-lg font-semibold mt-6 mb-2">Shipping Costs</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Standard Shipping: R150</li>
                    <li>Express Shipping: R250</li>
                    <li>Free shipping on orders over R1000</li>
                  </ul>
                  
                  <h4 className="text-lg font-semibold mt-6 mb-2">Returns Policy</h4>
                  <p>
                    If you're not completely happy with your purchase, you can return it within 30 days.
                    Items must be in original condition with tags attached. Please note that the customer
                    is responsible for the cost of returning the item.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ProductPage;

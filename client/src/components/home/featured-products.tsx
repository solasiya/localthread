import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const FeaturedProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/products', { featured: true, limit: 8 }],
    queryFn: async () => {
      const res = await fetch('/api/products?featured=true&limit=8');
      if (!res.ok) throw new Error('Failed to fetch featured products');
      return res.json();
    }
  });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(products.length / 4)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Calculate which products to display based on current page
  const productsPerPage = 4;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  
  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold text-neutral-800">Featured Products</h2>
            <p className="text-neutral-600">Handpicked items from South Africa's finest designers</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(products.length / productsPerPage)}
              className={`rounded-full ${currentPage < Math.ceil(products.length / productsPerPage) ? 'bg-primary text-white hover:bg-primary-dark' : ''}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-96 animate-pulse">
                <div className="w-full h-64 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive">Failed to load products. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3">
                <Link href="/shop">View All Products</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

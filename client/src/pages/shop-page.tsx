import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch, Link } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Grid2X2, ListFilter, Search, SlidersHorizontal, X } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

const ShopPage = () => {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  // Get filter values from URL params
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const featuredParam = searchParams.get("featured") === "true";
  const saleParam = searchParams.get("sale") === "true";
  const newParam = searchParams.get("new") === "true";
  const storeParam = searchParams.get("store") ? parseInt(searchParams.get("store") as string) : undefined;
  
  // Local state for filters
  const [searchValue, setSearchValue] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFeatured, setShowFeatured] = useState(featuredParam);
  const [showSale, setShowSale] = useState(saleParam);
  const [showNew, setShowNew] = useState(newParam);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Products per page
  const PRODUCTS_PER_PAGE = 12;
  
  // Fetch categories
  const { 
    data: categories = [],
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });
  
  // Build query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) params.append("category", selectedCategory);
    if (searchValue) params.append("search", searchValue);
    if (showFeatured) params.append("featured", "true");
    if (storeParam) params.append("storeId", storeParam.toString());
    
    // Add pagination
    params.append("limit", PRODUCTS_PER_PAGE.toString());
    params.append("page", currentPage.toString());
    
    return params.toString();
  };
  
  // Fetch products
  const { 
    data: productsResponse = { products: [], total: 0 },
    isLoading: isLoadingProducts,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['/api/products', buildQueryParams()],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const res = await fetch(`/api/products?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const products = await res.json();
      
      // In a real API, this would return a total count - mocking for now
      return {
        products,
        total: products.length < PRODUCTS_PER_PAGE ? products.length : PRODUCTS_PER_PAGE * 3 // Assuming there are more pages
      };
    }
  });
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetchProducts();
  };
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
    refetchProducts();
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("");
    setSearchValue("");
    setPriceRange([0, 5000]);
    setShowFeatured(false);
    setShowSale(false);
    setShowNew(false);
    setCurrentPage(1);
    refetchProducts();
  };
  
  // Handle pagination
  const totalPages = Math.ceil(productsResponse.total / PRODUCTS_PER_PAGE);
  
  // Filtering products client-side for demo (in real app, this would be server-side)
  const filteredProducts = productsResponse.products
    .filter(product => {
      // Price filter (client-side only for demo)
      const price = product.salePrice || product.price;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      
      // Sale filter
      if (showSale && !product.salePrice) return false;
      
      // New filter (simplified for demo - normally would be in API)
      if (showNew) {
        const productDate = new Date(product.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - productDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 7) return false;
      }
      
      return true;
    });
  
  // Sort products (client-side for demo)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "price-asc":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-desc":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  // Page title and description based on filters
  const getPageTitle = () => {
    if (searchParam) return `Search Results for "${searchParam}"`;
    if (categoryParam) {
      const categoryName = categories.find(c => c.slug === categoryParam)?.name || categoryParam;
      return `${categoryName} Products`;
    }
    if (featuredParam) return "Featured Products";
    if (saleParam) return "Sale Items";
    if (newParam) return "New Arrivals";
    return "Shop All Products";
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | LocalThreads Marketplace</title>
        <meta name="description" content="Browse our collection of authentic South African clothing brands." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-1/4 space-y-6 sticky top-24">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 font-heading">Filters</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="all-categories" 
                            checked={selectedCategory === ""}
                            onCheckedChange={() => setSelectedCategory("")}
                          />
                          <Label htmlFor="all-categories">All Categories</Label>
                        </div>
                        
                        {isLoadingCategories ? (
                          <div className="animate-pulse space-y-2">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-6 bg-gray-200 rounded"></div>
                            ))}
                          </div>
                        ) : (
                          categories.map(category => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category.id}`}
                                checked={selectedCategory === category.slug}
                                onCheckedChange={() => setSelectedCategory(category.slug)}
                              />
                              <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                            </div>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="price-range">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={5000}
                          step={100}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between">
                          <span>R {priceRange[0]}</span>
                          <span>R {priceRange[1]}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="product-type">
                    <AccordionTrigger>Product Type</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="featured" 
                            checked={showFeatured}
                            onCheckedChange={checked => setShowFeatured(checked === true)}
                          />
                          <Label htmlFor="featured">Featured Products</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="sale" 
                            checked={showSale}
                            onCheckedChange={checked => setShowSale(checked === true)}
                          />
                          <Label htmlFor="sale">Sale Items</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="new" 
                            checked={showNew}
                            onCheckedChange={checked => setShowNew(checked === true)}
                          />
                          <Label htmlFor="new">New Arrivals</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-6 flex flex-col space-y-3">
                  <Button onClick={applyFilters}>Apply Filters</Button>
                  <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="w-full md:w-3/4">
              <div className="mb-6">
                <h1 className="text-3xl font-bold font-heading mb-3">{getPageTitle()}</h1>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Search form */}
                  <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button type="submit" className="rounded-l-none">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Mobile filter button */}
                    <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="md:hidden">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                          <SheetTitle>Filter Products</SheetTitle>
                          <SheetDescription>
                            Apply filters to narrow down your search results.
                          </SheetDescription>
                        </SheetHeader>
                        
                        <div className="py-4 space-y-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Categories</h3>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-all-categories" 
                                  checked={selectedCategory === ""}
                                  onCheckedChange={() => setSelectedCategory("")}
                                />
                                <Label htmlFor="mobile-all-categories">All Categories</Label>
                              </div>
                              
                              {categories.map(category => (
                                <div key={`mobile-${category.id}`} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`mobile-category-${category.id}`}
                                    checked={selectedCategory === category.slug}
                                    onCheckedChange={() => setSelectedCategory(category.slug)}
                                  />
                                  <Label htmlFor={`mobile-category-${category.id}`}>{category.name}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <h3 className="font-medium">Price Range</h3>
                            <Slider
                              value={priceRange}
                              min={0}
                              max={5000}
                              step={100}
                              onValueChange={setPriceRange}
                            />
                            <div className="flex justify-between">
                              <span>R {priceRange[0]}</span>
                              <span>R {priceRange[1]}</span>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <h3 className="font-medium">Product Type</h3>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-featured" 
                                  checked={showFeatured}
                                  onCheckedChange={checked => setShowFeatured(checked === true)}
                                />
                                <Label htmlFor="mobile-featured">Featured Products</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-sale" 
                                  checked={showSale}
                                  onCheckedChange={checked => setShowSale(checked === true)}
                                />
                                <Label htmlFor="mobile-sale">Sale Items</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-new" 
                                  checked={showNew}
                                  onCheckedChange={checked => setShowNew(checked === true)}
                                />
                                <Label htmlFor="mobile-new">New Arrivals</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <SheetFooter className="flex-col sm:flex-row gap-3 sm:justify-start">
                          <Button onClick={applyFilters}>Apply Filters</Button>
                          <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                    
                    {/* Sort dropdown */}
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Grid view button - can be expanded with list view if needed */}
                    <Button variant="outline" size="icon" className="hidden sm:flex">
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Active filters */}
              {(selectedCategory || searchValue || showFeatured || showSale || showNew || priceRange[0] > 0 || priceRange[1] < 5000) && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="text-sm font-medium py-1">Active filters:</span>
                  
                  {selectedCategory && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setSelectedCategory("")}
                    >
                      Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  
                  {searchValue && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setSearchValue("")}
                    >
                      Search: {searchValue}
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  
                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setPriceRange([0, 5000])}
                    >
                      Price: R{priceRange[0]} - R{priceRange[1]}
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  
                  {showFeatured && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setShowFeatured(false)}
                    >
                      Featured
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  
                  {showSale && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setShowSale(false)}
                    >
                      Sale
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  
                  {showNew && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setShowNew(false)}
                    >
                      New Arrivals
                      <X className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-primary"
                    onClick={resetFilters}
                  >
                    Clear all
                  </Button>
                </div>
              )}
              
              {/* Products Grid */}
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
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
              ) : sortedProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-neutral-400 mx-auto w-16 h-16 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-neutral-600 mb-6">Try adjusting your search or filter criteria.</p>
                  <Button onClick={resetFilters}>Clear all filters</Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <Button
                            key={i}
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ShopPage;

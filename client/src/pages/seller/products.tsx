import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  AlertCircle, 
  ArrowUpDown
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const SellerProducts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Products per page
  const PRODUCTS_PER_PAGE = 10;
  
  // Fetch products
  const { 
    data: products = [], 
    isLoading, 
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['/api/products', { storeId: 'current', limit: 100 }],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return [
        {
          id: 1,
          name: "Traditional Printed Shirt",
          price: 599.99,
          salePrice: null,
          stock: 25,
          isActive: true,
          isFeatured: true,
          createdAt: "2023-06-01T08:00:00Z"
        },
        {
          id: 2,
          name: "Urban Streetwear Hoodie",
          price: 899.50,
          salePrice: 699.99,
          stock: 18,
          isActive: true,
          isFeatured: false,
          createdAt: "2023-05-28T10:30:00Z"
        },
        {
          id: 3,
          name: "Beaded Necklace",
          price: 349.99,
          salePrice: null,
          stock: 40,
          isActive: true,
          isFeatured: true,
          createdAt: "2023-05-25T14:45:00Z"
        },
        {
          id: 4,
          name: "Summer Linen Shirt",
          price: 499.99,
          salePrice: null,
          stock: 0,
          isActive: false,
          isFeatured: false,
          createdAt: "2023-05-20T09:15:00Z"
        },
        {
          id: 5,
          name: "Traditional Beaded Bracelet",
          price: 199.99,
          salePrice: null,
          stock: 32,
          isActive: true,
          isFeatured: false,
          createdAt: "2023-05-15T11:20:00Z"
        },
        {
          id: 6,
          name: "African Print Dress",
          price: 1299.99,
          salePrice: 999.99,
          stock: 15,
          isActive: true,
          isFeatured: true,
          createdAt: "2023-05-10T13:45:00Z"
        },
        {
          id: 7,
          name: "Handmade Leather Wallet",
          price: 299.99,
          salePrice: null,
          stock: 22,
          isActive: true,
          isFeatured: false,
          createdAt: "2023-05-05T08:30:00Z"
        },
        {
          id: 8,
          name: "Safari Hat",
          price: 249.99,
          salePrice: null,
          stock: 17,
          isActive: true,
          isFeatured: false,
          createdAt: "2023-04-30T10:15:00Z"
        }
      ];
    }
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // In a real app, this would trigger a new API call with the search parameter
    // For now, we're just filtering the existing data client-side
  };
  
  // Filter products based on tab, search, and category
  const filteredProducts = products.filter(product => {
    // Filter by tab
    if (activeTab === "active" && !product.isActive) return false;
    if (activeTab === "inactive" && product.isActive) return false;
    if (activeTab === "featured" && !product.isFeatured) return false;
    if (activeTab === "out-of-stock" && product.stock > 0) return false;
    if (activeTab === "on-sale" && !product.salePrice) return false;
    
    // Filter by search
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "stock-asc":
        return a.stock - b.stock;
      case "stock-desc":
        return b.stock - a.stock;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  
  // Handle product deletion
  const confirmDeleteProduct = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      // In a real app, this would call the API to delete the product
      // await apiRequest("DELETE", `/api/products/${productToDelete}`);
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      
      // Refetch products
      refetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };
  
  // Handle toggle product status
  const toggleProductStatus = async (productId: number, isCurrentlyActive: boolean) => {
    try {
      // In a real app, this would call the API to update the product
      // await apiRequest("PATCH", `/api/products/${productId}`, { isActive: !isCurrentlyActive });
      
      toast({
        title: isCurrentlyActive ? "Product deactivated" : "Product activated",
        description: `The product has been ${isCurrentlyActive ? "deactivated" : "activated"} successfully.`,
      });
      
      // Refetch products
      refetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isCurrentlyActive ? "deactivate" : "activate"} product. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  // Handle toggle featured status
  const toggleFeaturedStatus = async (productId: number, isCurrentlyFeatured: boolean) => {
    try {
      // In a real app, this would call the API to update the product
      // await apiRequest("PATCH", `/api/products/${productId}`, { isFeatured: !isCurrentlyFeatured });
      
      toast({
        title: isCurrentlyFeatured ? "Product removed from featured" : "Product added to featured",
        description: `The product has been ${isCurrentlyFeatured ? "removed from" : "added to"} featured products.`,
      });
      
      // Refetch products
      refetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update featured status. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Products | Seller Dashboard | LocalThreads Marketplace</title>
        <meta name="description" content="Manage your products, add new items, and update inventory on LocalThreads Marketplace." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-heading">Manage Products</h1>
              <p className="text-neutral-600">
                Add, edit, and manage your product listings
              </p>
            </div>
            
            <Button asChild>
              <Link href="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <CardTitle>Your Products</CardTitle>
                  <form onSubmit={handleSearch} className="flex w-full md:w-auto max-w-sm">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button type="submit" className="rounded-l-none">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start">
                    <TabsTrigger value="all" className="flex-shrink-0">All Products</TabsTrigger>
                    <TabsTrigger value="active" className="flex-shrink-0">Active</TabsTrigger>
                    <TabsTrigger value="inactive" className="flex-shrink-0">Inactive</TabsTrigger>
                    <TabsTrigger value="featured" className="flex-shrink-0">Featured</TabsTrigger>
                    <TabsTrigger value="out-of-stock" className="flex-shrink-0">Out of Stock</TabsTrigger>
                    <TabsTrigger value="on-sale" className="flex-shrink-0">On Sale</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sort-by" className="text-sm">Sort by:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort-by" className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                        <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                        <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
                        <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")} className="cursor-pointer">
                          <div className="flex items-center">
                            Product Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead onClick={() => setSortBy(sortBy === "price-asc" ? "price-desc" : "price-asc")} className="cursor-pointer">
                          <div className="flex items-center">
                            Price
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead onClick={() => setSortBy(sortBy === "stock-asc" ? "stock-desc" : "stock-asc")} className="cursor-pointer">
                          <div className="flex items-center">
                            Stock
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")} className="cursor-pointer">
                          <div className="flex items-center">
                            Added
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <Package className="h-8 w-8 text-neutral-400 animate-pulse mb-2" />
                              <p>Loading products...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : paginatedProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <Package className="h-8 w-8 text-neutral-400 mb-2" />
                              <p>No products found</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {searchQuery ? `No products match "${searchQuery}"` : "Try adding some products to your store"}
                              </p>
                              <Button asChild className="mt-4">
                                <Link href="/seller/products/new">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add New Product
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              {product.salePrice ? (
                                <div>
                                  <span className="text-primary font-medium">{formatCurrency(product.salePrice)}</span>
                                  <span className="text-sm text-muted-foreground line-through ml-2">
                                    {formatCurrency(product.price)}
                                  </span>
                                </div>
                              ) : (
                                formatCurrency(product.price)
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={
                                product.stock === 0 
                                  ? "text-red-500" 
                                  : product.stock < 10 
                                    ? "text-amber-500" 
                                    : "text-green-500"
                              }>
                                {product.stock}
                              </span>
                              {product.stock === 0 && (
                                <Badge variant="outline" className="ml-2 text-red-500 border-red-200 bg-red-50">
                                  Out of stock
                                </Badge>
                              )}
                              {product.stock > 0 && product.stock < 10 && (
                                <Badge variant="outline" className="ml-2 text-amber-500 border-amber-200 bg-amber-50">
                                  Low stock
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={product.isActive ? "default" : "outline"}
                                className={
                                  product.isActive 
                                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                    : "border-red-200 text-red-800 bg-red-50 hover:bg-red-100"
                                }
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={product.isFeatured ? "default" : "outline"}
                                className={
                                  product.isFeatured 
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200" 
                                    : "border-gray-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
                                }
                              >
                                {product.isFeatured ? "Featured" : "Not Featured"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(product.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/product/${product.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/seller/products/edit/${product.id}`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => 
                                    toggleProductStatus(product.id, product.isActive)
                                  }>
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    {product.isActive ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => 
                                    toggleFeaturedStatus(product.id, product.isFeatured)
                                  }>
                                    <Package className="mr-2 h-4 w-4" />
                                    {product.isFeatured ? "Remove from featured" : "Mark as featured"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => confirmDeleteProduct(product.id)}
                                    className="text-red-500 focus:text-red-500"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete product
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredProducts.length > PRODUCTS_PER_PAGE && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {/* Generate page numbers */}
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        // Show first page, last page, and pages around current page
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipsis for gaps
                        if (
                          (pageNum === 2 && currentPage > 3) || 
                          (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerProducts;

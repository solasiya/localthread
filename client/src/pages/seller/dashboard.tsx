import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingBag,
  Package,
  Users,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  DollarSign,
  Eye,
  Edit,
  Check,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock data for the dashboard visualizations
const salesData = [
  { name: "Jan", sales: 12000 },
  { name: "Feb", sales: 18000 },
  { name: "Mar", sales: 15000 },
  { name: "Apr", sales: 22000 },
  { name: "May", sales: 30000 },
  { name: "Jun", sales: 28000 },
];

const categoryData = [
  { name: "Women", value: 40 },
  { name: "Men", value: 30 },
  { name: "Traditional", value: 15 },
  { name: "Accessories", value: 15 },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch store data
  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ['/api/seller/store'],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return {
        id: 1,
        name: "Your Store Name",
        description: "Your store description",
        isVerified: true,
        createdAt: "2023-01-15T12:00:00Z",
        totalSales: 12500,
        totalOrders: 42,
        totalProducts: 15,
      };
    },
  });
  
  // Fetch recent orders
  const { data: recentOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/seller/orders', { limit: 5 }],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return [
        {
          id: 1,
          orderNumber: "ORD-001",
          customer: "John Smith",
          date: "2023-06-10T14:30:00Z",
          amount: 1299.99,
          status: "delivered"
        },
        {
          id: 2,
          orderNumber: "ORD-002",
          customer: "Sarah Johnson",
          date: "2023-06-09T10:15:00Z", 
          amount: 899.50,
          status: "shipped"
        },
        {
          id: 3,
          orderNumber: "ORD-003",
          customer: "Michael Brown",
          date: "2023-06-08T16:45:00Z",
          amount: 2450.00,
          status: "processing"
        },
        {
          id: 4,
          orderNumber: "ORD-004",
          customer: "Emily Davis",
          date: "2023-06-07T09:20:00Z",
          amount: 560.75,
          status: "pending"
        },
        {
          id: 5,
          orderNumber: "ORD-005",
          customer: "David Wilson",
          date: "2023-06-06T13:10:00Z",
          amount: 1875.25,
          status: "delivered"
        }
      ];
    },
  });
  
  // Fetch recent products
  const { data: recentProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/seller/products', { limit: 5 }],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return [
        {
          id: 1,
          name: "Traditional Printed Shirt",
          price: 599.99,
          stock: 25,
          createdAt: "2023-06-01T08:00:00Z",
          isActive: true
        },
        {
          id: 2,
          name: "Urban Streetwear Hoodie",
          price: 899.50,
          stock: 18,
          createdAt: "2023-05-28T10:30:00Z",
          isActive: true
        },
        {
          id: 3,
          name: "Beaded Necklace",
          price: 349.99,
          stock: 40,
          createdAt: "2023-05-25T14:45:00Z",
          isActive: true
        },
        {
          id: 4,
          name: "Summer Linen Shirt",
          price: 499.99,
          stock: 0,
          createdAt: "2023-05-20T09:15:00Z",
          isActive: false
        },
        {
          id: 5,
          name: "Traditional Beaded Bracelet",
          price: 199.99,
          stock: 32,
          createdAt: "2023-05-15T11:20:00Z",
          isActive: true
        }
      ];
    },
  });
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
      <Helmet>
        <title>Seller Dashboard | LocalThreads Marketplace</title>
        <meta name="description" content="Manage your store, products, and orders on LocalThreads Marketplace." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-heading">Seller Dashboard</h1>
              <p className="text-neutral-600">
                Manage your store, track sales, and update your products
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/seller/store-settings">
                  Edit Store
                </Link>
              </Button>
              <Button asChild>
                <Link href="/seller/products/new">
                  Add New Product
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex h-auto">
              <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
              <TabsTrigger value="orders" className="py-2">Orders</TabsTrigger>
              <TabsTrigger value="products" className="py-2">Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Verification Warning */}
              {!store?.isVerified && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Store Not Verified</h4>
                      <p>
                        Your store is awaiting verification by an administrator. You won't be able to list products 
                        until your store is verified. This process typically takes 1-2 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Store Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="flex flex-col">
                      <span>Store Overview</span>
                      {store?.isVerified ? (
                        <span className="text-sm font-medium flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          Verified Store
                        </span>
                      ) : (
                        <span className="text-sm font-medium flex items-center text-orange-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Verification Pending
                        </span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Sales</p>
                            <h3 className="text-2xl font-bold mt-1">
                              {store ? formatCurrency(store.totalSales) : "—"}
                            </h3>
                          </div>
                          <div className="bg-primary/10 p-3 rounded-full">
                            <DollarSign className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">12%</span>
                          <span className="text-muted-foreground ml-1">from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <h3 className="text-2xl font-bold mt-1">
                              {store?.totalOrders || "—"}
                            </h3>
                          </div>
                          <div className="bg-secondary/10 p-3 rounded-full">
                            <Package className="h-6 w-6 text-secondary" />
                          </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">8%</span>
                          <span className="text-muted-foreground ml-1">from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Products</p>
                            <h3 className="text-2xl font-bold mt-1">
                              {store?.totalProducts || "—"}
                            </h3>
                          </div>
                          <div className="bg-accent/10 p-3 rounded-full">
                            <ShoppingBag className="h-6 w-6 text-accent" />
                          </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">3</span>
                          <span className="text-muted-foreground ml-1">new products</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Customers</p>
                            <h3 className="text-2xl font-bold mt-1">32</h3>
                          </div>
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">24%</span>
                          <span className="text-muted-foreground ml-1">from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Sales Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Sales Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`R ${value}`, "Sales"]}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="hsl(var(--primary))"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                        <Bar dataKey="value" fill="hsl(var(--secondary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Orders and Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="#orders" onClick={() => setActiveTab("orders")}>
                        View all
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingOrders ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              Loading orders...
                            </TableCell>
                          </TableRow>
                        ) : recentOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              No orders yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>
                                <div className="font-medium">{order.orderNumber}</div>
                                <div className="text-sm text-muted-foreground">{order.customer}</div>
                              </TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDate(order.date)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(order.amount)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Products</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="#products" onClick={() => setActiveTab("products")}>
                        View all
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingProducts ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              Loading products...
                            </TableCell>
                          </TableRow>
                        ) : recentProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              No products yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Added {formatDate(product.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(product.price)}</TableCell>
                              <TableCell>
                                <div className={`${
                                  product.stock === 0 
                                    ? "text-red-500" 
                                    : product.stock < 10 
                                      ? "text-yellow-500" 
                                      : "text-green-500"
                                }`}>
                                  {product.stock}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.isActive 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {product.isActive ? "Active" : "Inactive"}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* This would be expanded with pagination in a real app */}
                        {isLoadingOrders ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10">
                              Loading orders...
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.orderNumber}
                              </TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>{formatDate(order.date)}</TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(order.amount)}
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
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Truck className="mr-2 h-4 w-4" />
                                      Update status
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Products</CardTitle>
                  <Button asChild>
                    <Link href="/seller/products/new">
                      Add New Product
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Added</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* This would be expanded with pagination in a real app */}
                        {isLoadingProducts ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10">
                              Loading products...
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">
                                {product.name}
                              </TableCell>
                              <TableCell>{formatCurrency(product.price)}</TableCell>
                              <TableCell>
                                <div className={`${
                                  product.stock === 0 
                                    ? "text-red-500" 
                                    : product.stock < 10 
                                      ? "text-yellow-500" 
                                      : "text-green-500"
                                }`}>
                                  {product.stock}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.isActive 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {product.isActive ? "Active" : "Inactive"}
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(product.createdAt)}</TableCell>
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
                                    <DropdownMenuItem>
                                      <AlertCircle className="mr-2 h-4 w-4" />
                                      {product.isActive ? "Deactivate" : "Activate"}
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default SellerDashboard;

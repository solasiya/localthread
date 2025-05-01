import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Store,
  MoreHorizontal,
  Check,
  X,
  Eye,
  Edit,
  UserCog,
  Search,
  FileText,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Color palette for charts
const CHART_COLORS = [
  "#E56B1F", // primary
  "#1E5631", // secondary
  "#F2C94C", // accent
  "#2D9CDB", // blue
  "#9B51E0", // purple
  "#EB5757", // red
];

// Mock data for the dashboard visualizations
const salesData = [
  { name: "Jan", sales: 55000 },
  { name: "Feb", sales: 80000 },
  { name: "Mar", sales: 68000 },
  { name: "Apr", sales: 90000 },
  { name: "May", sales: 120000 },
  { name: "Jun", sales: 105000 },
];

const categoryData = [
  { name: "Women's", value: 40 },
  { name: "Men's", value: 30 },
  { name: "Traditional", value: 15 },
  { name: "Accessories", value: 10 },
  { name: "Kids", value: 5 },
];

const topSellingStores = [
  { name: "Cape Town Couture", sales: 345000, products: 42, growth: 23 },
  { name: "Zulu Threads", sales: 298000, products: 35, growth: 18 },
  { name: "Ndebele Crafts", sales: 256000, products: 28, growth: 12 },
  { name: "Durban Design Co.", sales: 230000, products: 31, growth: 15 },
  { name: "Soweto Fashion", sales: 210000, products: 25, growth: 8 },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30days");
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [storeToVerify, setStoreToVerify] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch admin stats
  const { data: adminStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/admin/stats', { timeRange }],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return {
        totalUsers: 3245,
        totalSellers: 128,
        totalProducts: 4876,
        totalOrders: 12543,
        totalSales: 3450000,
        pendingVerification: 8,
        activeUsers: 2876,
        salesGrowth: 18.5,
        userGrowth: 12.3,
        orderGrowth: 15.8,
      };
    },
  });
  
  // Fetch stores
  const { 
    data: stores = [], 
    isLoading: isLoadingStores, 
    refetch: refetchStores 
  } = useQuery({
    queryKey: ['/api/admin/stores'],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return [
        {
          id: 1,
          name: "Cape Town Couture",
          owner: "Sarah Johnson",
          products: 42,
          isVerified: true,
          createdAt: "2023-01-10T09:30:00Z",
        },
        {
          id: 2,
          name: "Zulu Threads",
          owner: "Thandi Nkosi",
          products: 35,
          isVerified: true,
          createdAt: "2023-02-15T11:45:00Z",
        },
        {
          id: 3,
          name: "Ndebele Crafts",
          owner: "Sipho Mbatha",
          products: 28,
          isVerified: true,
          createdAt: "2023-01-25T14:20:00Z",
        },
        {
          id: 4,
          name: "Durban Design Co.",
          owner: "Michael Brown",
          products: 31,
          isVerified: false,
          createdAt: "2023-03-05T10:15:00Z",
        },
        {
          id: 5,
          name: "Soweto Fashion",
          owner: "Lerato Molefe",
          products: 25,
          isVerified: true,
          createdAt: "2023-02-28T16:40:00Z",
        },
        {
          id: 6,
          name: "Joburg Boutique",
          owner: "David Wilson",
          products: 19,
          isVerified: false,
          createdAt: "2023-03-10T08:50:00Z",
        },
        {
          id: 7,
          name: "African Stitches",
          owner: "Nomsa Dlamini",
          products: 23,
          isVerified: false,
          createdAt: "2023-03-15T13:30:00Z",
        },
        {
          id: 8,
          name: "Pretoria Threads",
          owner: "Johan van der Merwe",
          products: 17,
          isVerified: false,
          createdAt: "2023-03-18T15:20:00Z",
        },
      ];
    },
  });
  
  // Fetch recent orders
  const { data: recentOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/admin/orders', { limit: 5 }],
    queryFn: async () => {
      // In a real app, this would fetch from the actual API
      return [
        {
          id: 1,
          orderNumber: "ORD-001",
          customer: "John Smith",
          store: "Cape Town Couture",
          date: "2023-06-10T14:30:00Z",
          amount: 1299.99,
          status: "delivered"
        },
        {
          id: 2,
          orderNumber: "ORD-002",
          customer: "Sarah Johnson",
          store: "Zulu Threads",
          date: "2023-06-09T10:15:00Z", 
          amount: 899.50,
          status: "shipped"
        },
        {
          id: 3,
          orderNumber: "ORD-003",
          customer: "Michael Brown",
          store: "Ndebele Crafts",
          date: "2023-06-08T16:45:00Z",
          amount: 2450.00,
          status: "processing"
        },
        {
          id: 4,
          orderNumber: "ORD-004",
          customer: "Emily Davis",
          store: "Durban Design Co.",
          date: "2023-06-07T09:20:00Z",
          amount: 560.75,
          status: "pending"
        },
        {
          id: 5,
          orderNumber: "ORD-005",
          customer: "David Wilson",
          store: "Soweto Fashion",
          date: "2023-06-06T13:10:00Z",
          amount: 1875.25,
          status: "delivered"
        }
      ];
    },
  });
  
  // Handle store verification
  const handleVerifyStore = async () => {
    if (!storeToVerify) return;
    
    setIsVerifying(true);
    
    try {
      // In a real app, this would call the API
      // await apiRequest("PATCH", `/api/admin/stores/${storeToVerify}/verify`, { isVerified: true });
      
      toast({
        title: "Store verified",
        description: "The store has been successfully verified.",
      });
      
      // Refetch stores
      refetchStores();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setShowVerifyDialog(false);
      setStoreToVerify(null);
    }
  };
  
  // Filter stores based on verification status and search query
  const filteredStores = stores.filter(store => {
    // Filter by search
    if (searchQuery && !store.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !store.owner.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // If on pending verification tab, show only unverified stores
    if (activeTab === "pending-verification" && store.isVerified) {
      return false;
    }
    
    return true;
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
        <title>Admin Dashboard | LocalThreads Marketplace</title>
        <meta name="description" content="Manage the LocalThreads Marketplace platform, oversee sellers, products, and orders." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
              <p className="text-neutral-600">
                Manage the LocalThreads Marketplace platform
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:grid-cols-5 h-auto">
              <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
              <TabsTrigger value="stores" className="py-2">Stores</TabsTrigger>
              <TabsTrigger value="users" className="py-2">Users</TabsTrigger>
              <TabsTrigger value="products" className="py-2">Products</TabsTrigger>
              <TabsTrigger value="pending-verification" className="py-2 relative">
                Pending Verification
                {adminStats?.pendingVerification > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500">
                    {adminStats.pendingVerification}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {adminStats ? formatCurrency(adminStats.totalSales) : "—"}
                        </h3>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      {adminStats?.salesGrowth > 0 ? (
                        <>
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">+{adminStats.salesGrowth}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-500 font-medium">{adminStats?.salesGrowth}%</span>
                        </>
                      )}
                      <span className="text-muted-foreground ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {adminStats?.totalUsers.toLocaleString() || "—"}
                        </h3>
                      </div>
                      <div className="bg-secondary/10 p-3 rounded-full">
                        <Users className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+{adminStats?.userGrowth || 0}%</span>
                      <span className="text-muted-foreground ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {adminStats?.totalOrders.toLocaleString() || "—"}
                        </h3>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-full">
                        <Package className="h-6 w-6 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+{adminStats?.orderGrowth || 0}%</span>
                      <span className="text-muted-foreground ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sellers</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {adminStats?.totalSellers.toLocaleString() || "—"}
                        </h3>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                        {adminStats?.pendingVerification || 0} pending verification
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sales Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Sales Analytics</CardTitle>
                    <CardDescription>
                      Platform sales over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`R ${value.toLocaleString()}`, "Sales"]}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          name="Sales (ZAR)"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>
                      Product category distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              {/* Top Stores & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Stores</CardTitle>
                    <CardDescription>
                      Based on total sales volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Store</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead>Growth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topSellingStores.map((store, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {store.name}
                            </TableCell>
                            <TableCell>{store.products}</TableCell>
                            <TableCell>{formatCurrency(store.sales)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500">+{store.growth}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                          Latest transactions on the platform
                        </CardDescription>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href="#orders">
                          View all
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
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
                              No orders found
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>
                                <div className="font-medium">{order.orderNumber}</div>
                                <div className="text-xs text-muted-foreground">{order.store}</div>
                              </TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
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
              </div>
            </TabsContent>
            
            <TabsContent value="stores" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <CardTitle>All Stores</CardTitle>
                    <form className="flex w-full md:w-auto max-w-sm">
                      <Input
                        type="text"
                        placeholder="Search stores..."
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
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Store Name</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Verification</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingStores ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10">
                              <div className="flex flex-col items-center justify-center">
                                <Store className="h-8 w-8 text-neutral-400 animate-pulse mb-2" />
                                <p>Loading stores...</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredStores.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10">
                              <div className="flex flex-col items-center justify-center">
                                <Store className="h-8 w-8 text-neutral-400 mb-2" />
                                <p>No stores found</p>
                                {searchQuery && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    No stores match "{searchQuery}"
                                  </p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStores.map((store) => (
                            <TableRow key={store.id}>
                              <TableCell className="font-medium">
                                {store.name}
                              </TableCell>
                              <TableCell>{store.owner}</TableCell>
                              <TableCell>{store.products}</TableCell>
                              <TableCell>
                                {store.isVerified ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {formatDate(store.createdAt)}
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
                                      <Link href={`/store/${store.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View store
                                      </Link>
                                    </DropdownMenuItem>
                                    {!store.isVerified && (
                                      <DropdownMenuItem onClick={() => {
                                        setStoreToVerify(store.id);
                                        setShowVerifyDialog(true);
                                      }}>
                                        <Check className="mr-2 h-4 w-4" />
                                        Verify store
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/stores/${store.id}/products`}>
                                        <Package className="mr-2 h-4 w-4" />
                                        View products
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/stores/${store.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit store
                                      </Link>
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
            
            <TabsContent value="pending-verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stores Pending Verification</CardTitle>
                  <CardDescription>
                    Review and verify seller stores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Store Name</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingStores ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-10">
                              Loading pending verifications...
                            </TableCell>
                          </TableRow>
                        ) : filteredStores.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-10">
                              <div className="flex flex-col items-center justify-center">
                                <Check className="h-8 w-8 text-green-500 mb-2" />
                                <p>No stores pending verification</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  All stores have been verified
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStores.map((store) => (
                            <TableRow key={store.id}>
                              <TableCell className="font-medium">
                                {store.name}
                              </TableCell>
                              <TableCell>{store.owner}</TableCell>
                              <TableCell>{store.products}</TableCell>
                              <TableCell>
                                {formatDate(store.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mr-2"
                                  asChild
                                >
                                  <Link href={`/store/${store.id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Link>
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    setStoreToVerify(store.id);
                                    setShowVerifyDialog(true);
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
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
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage platform users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <UserCog className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">User Management</h3>
                      <p className="text-neutral-500 max-w-md mt-2 mb-6">
                        This interface would allow administrators to view, filter, and manage users registered on the platform. Users could be sorted by role (buyer, seller, admin) and various actions could be performed.
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="#">View Users</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>
                    View and manage all products on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Product Management</h3>
                      <p className="text-neutral-500 max-w-md mt-2 mb-6">
                        This interface would allow administrators to browse, search, filter, and manage all products available on the platform. Products could be filtered by category, store, price range, and more.
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="#">View Products</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
      
      {/* Verify Store Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this store? This action will make the store visible to all users and allow the seller to start selling on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isVerifying}>
              Cancel
            </Button>
            <Button onClick={handleVerifyStore} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify Store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;

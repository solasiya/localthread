import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Store } from "@shared/schema";

const StoreVerificationPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch stores
  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['/api/admin/stores'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/stores");
      return await res.json();
    },
  });

  // Verify store mutation
  const verifyStoreMutation = useMutation({
    mutationFn: async ({ storeId, action }: { storeId: number, action: 'approve' | 'reject' }) => {
      const res = await apiRequest("POST", `/api/admin/stores/${storeId}/verify`, { action });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stores'] });
      toast({
        title: "Success",
        description: "Store verification status updated",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update store verification status",
        variant: "destructive",
      });
    },
  });

  // Filter stores based on active tab
  const filteredStores = stores.filter((store: Store) => {
    if (activeTab === "pending") return !store.isVerified;
    if (activeTab === "approved") return store.isVerified;
    return true; // All stores
  });

  // Handle verification actions
  const handleVerifyStore = (storeId: number, action: 'approve' | 'reject') => {
    verifyStoreMutation.mutate({ storeId, action });
  };

  return (
    <>
      <Helmet>
        <title>Store Verification | Admin Dashboard</title>
        <meta name="description" content="Manage store verification requests" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Store Verification</h1>
              <p className="text-neutral-600">
                Manage and review store verification requests
              </p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Store Verification Overview</CardTitle>
              <CardDescription>
                Review and verify seller stores before they can list products on the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Verification</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {stores.filter(store => !store.isVerified).length}
                        </h3>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Verified Stores</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {stores.filter(store => store.isVerified).length}
                        </h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Stores</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {stores.length}
                        </h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Filter className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-6"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex h-auto">
              <TabsTrigger value="pending" className="py-2">
                Pending
                <Badge variant="outline" className="ml-2">
                  {stores.filter(store => !store.isVerified).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="py-2">
                Approved
              </TabsTrigger>
              <TabsTrigger value="all" className="py-2">
                All
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "pending" && "Pending Verification"}
                    {activeTab === "approved" && "Approved Stores"} 
                    {activeTab === "all" && "All Stores"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            Loading stores...
                          </TableCell>
                        </TableRow>
                      ) : filteredStores.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            No stores found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStores.map((store: Store) => (
                          <TableRow key={store.id}>
                            <TableCell>
                              <div className="font-medium">{store.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                ID: {store.id}
                              </div>
                            </TableCell>
                            <TableCell>{store.user?.username || "Unknown"}</TableCell>
                            <TableCell>{formatDate(store.createdAt)}</TableCell>
                            <TableCell>
                              {store.isVerified ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span className="text-xs font-medium">Verified</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-orange-600">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  <span className="text-xs font-medium">Pending</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  asChild 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Link href={`/admin/stores/${store.id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Link>
                                </Button>
                                
                                {!store.isVerified && (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleVerifyStore(store.id, 'approve')}
                                      disabled={verifyStoreMutation.isPending}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                      onClick={() => handleVerifyStore(store.id, 'reject')}
                                      disabled={verifyStoreMutation.isPending}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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

export default StoreVerificationPage;
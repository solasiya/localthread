import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductPage from "@/pages/product-page";
import ShopPage from "@/pages/shop-page";
import SellerDashboard from "@/pages/seller/dashboard";
import SellerProducts from "@/pages/seller/products";
import AdminDashboard from "@/pages/admin/dashboard";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductPage} />
      
      {/* Seller Routes */}
      <ProtectedRoute 
        path="/seller/dashboard" 
        component={SellerDashboard} 
        roles={["seller", "admin"]} 
      />
      <ProtectedRoute 
        path="/seller/products" 
        component={SellerProducts} 
        roles={["seller", "admin"]} 
      />
      
      {/* Admin Routes */}
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={AdminDashboard} 
        roles={["admin"]} 
      />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { 
  ShoppingBag, 
  User, 
  Heart, 
  Search,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CartSidebar from "@/components/cart/cart-sidebar";

const Header = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to shop page with search query
    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => {
    return location === path ? "text-primary border-b-2 border-primary pb-3" : "hover:text-primary pb-3";
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
      {/* Top Header */}
      <div className="bg-secondary px-4 py-2 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="hidden md:flex space-x-4 text-white text-sm">
            <Link href="/auth" className="hover:text-accent transition-colors duration-200">
              {user?.role === 'seller' ? 'Seller Dashboard' : 'Become a Seller'}
            </Link>
            <Link href="#" className="hover:text-accent transition-colors duration-200">Help & Support</Link>
          </div>
          <div className="flex space-x-4 text-white text-sm">
            <Link href="#" className="hover:text-accent transition-colors duration-200">Track Order</Link>
            <a href="#" className="hover:text-accent transition-colors duration-200">ZAR</a>
            <a href="#" className="hover:text-accent transition-colors duration-200">English</a>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center group">
              <div className="bg-primary text-white p-2 rounded-md mr-2 transform transition-transform duration-300 group-hover:scale-105">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LocalThreads</h1>
                <p className="text-xs text-neutral-500">South African Marketplace</p>
              </div>
            </Link>
          </div>
          
          <div className="w-full md:w-2/5 mb-4 md:mb-0">
            <form className="flex" onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search for local brands, clothing..."
                className="w-full rounded-r-none border-primary/20 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none bg-primary hover:bg-primary/90 transition-colors duration-200">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <div className="flex space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center text-neutral-600 hover:text-primary transition-colors duration-200">
                  <User className="h-6 w-6" />
                  <span className="text-xs mt-1">Account</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {!user ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/auth">
                      <DropdownMenuItem>
                        Login / Register
                      </DropdownMenuItem>
                    </Link>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>
                      Hello, {user.fullName || user.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem>My Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/orders">
                      <DropdownMenuItem>My Orders</DropdownMenuItem>
                    </Link>
                    {user.role === 'seller' && (
                      <Link href="/seller/dashboard">
                        <DropdownMenuItem>Seller Dashboard</DropdownMenuItem>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard">
                        <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="#" className="flex flex-col items-center text-neutral-600 hover:text-primary transition-colors duration-200">
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            
            <button 
              className="flex flex-col items-center text-neutral-600 hover:text-primary transition-colors duration-200 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-6 w-6" />
              {totalCartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full p-0 animate-pulse">
                  {totalCartItems}
                </Badge>
              )}
              <span className="text-xs mt-1">Cart</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu for Desktop */}
      <div className="border-t border-neutral-200 transition-all duration-300">
        <nav className="bg-white hidden md:block container mx-auto">
          <div className="container mx-auto px-4">
            <ul className="flex overflow-x-auto whitespace-nowrap py-3 -mx-4 px-4 md:justify-center space-x-8 text-sm font-medium">
              <li><Link href="/" className={`${isActive("/")} transition-colors duration-200`}>Home</Link></li>
              <li><Link href="/shop?category=tshirts" className={`${isActive("/shop?category=tshirts")} transition-colors duration-200`}>T-Shirts</Link></li>
              <li><Link href="/shop?category=shirts" className={`${isActive("/shop?category=shirts")} transition-colors duration-200`}>Shirts</Link></li>
              <li><Link href="/shop?category=hoodies" className={`${isActive("/shop?category=hoodies")} transition-colors duration-200`}>Hoodies</Link></li>
              <li><Link href="/shop?category=caps" className={`${isActive("/shop?category=caps")} transition-colors duration-200`}>Caps</Link></li>
              <li><Link href="/shop?category=beanies" className={`${isActive("/shop?category=beanies")} transition-colors duration-200`}>Beanies</Link></li>
              <li><Link href="/shop?featured=true" className={`${isActive("/shop?featured=true")} transition-colors duration-200`}>Featured</Link></li>
              <li><Link href="/shop?new=true" className={`${isActive("/shop?new=true")} transition-colors duration-200`}>New Arrivals</Link></li>
              <li><Link href="/shop?sale=true" className={`${isActive("/shop?sale=true")} transition-colors duration-200`}>Sale</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <nav className="md:hidden bg-white border-t border-neutral-200">
        <div className="flex items-center justify-between px-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-2 py-3">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="py-4 border-b border-neutral-200">
                  <Link href="/" className="flex items-center mb-6">
                    <div className="bg-primary text-white p-2 rounded-md mr-2">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LocalThreads</h1>
                      <p className="text-xs text-neutral-500">South African Marketplace</p>
                    </div>
                  </Link>
                </div>
                <nav className="flex flex-col gap-1 py-4 overflow-y-auto flex-grow">
                  <Link href="/" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Home</Link>
                  <Link href="/shop?category=tshirts" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">T-Shirts</Link>
                  <Link href="/shop?category=shirts" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Shirts</Link>
                  <Link href="/shop?category=hoodies" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Hoodies</Link>
                  <Link href="/shop?category=caps" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Caps</Link>
                  <Link href="/shop?category=beanies" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Beanies</Link>
                  <Link href="/shop?featured=true" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Featured</Link>
                  <Link href="/shop?new=true" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">New Arrivals</Link>
                  <Link href="/shop?sale=true" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Sale</Link>
                  
                  <div className="border-t border-neutral-200 pt-4 mt-auto">
                    {user ? (
                      <>
                        <div className="px-4 py-2 font-semibold">Hello, {user.fullName || user.username}</div>
                        <Link href="/profile" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">My Profile</Link>
                        <Link href="/orders" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">My Orders</Link>
                        
                        {user.role === 'seller' && (
                          <Link href="/seller/dashboard" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Seller Dashboard</Link>
                        )}
                        
                        {user.role === 'admin' && (
                          <Link href="/admin/dashboard" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Admin Dashboard</Link>
                        )}
                        
                        <button 
                          onClick={handleLogout} 
                          className="block w-full text-left py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/auth" className="block py-2 px-4 hover:bg-neutral-100 rounded-md transition-colors duration-200">Login / Register</Link>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center py-3 overflow-x-auto space-x-4 flex-grow px-2 scrollbar-hide">
            <Link href="/shop?category=tshirts" className="text-sm whitespace-nowrap transition-colors duration-200">T-Shirts</Link>
            <Link href="/shop?category=shirts" className="text-sm whitespace-nowrap transition-colors duration-200">Shirts</Link>
            <Link href="/shop?category=hoodies" className="text-sm whitespace-nowrap transition-colors duration-200">Hoodies</Link>
            <Link href="/shop?category=caps" className="text-sm whitespace-nowrap transition-colors duration-200">Caps</Link>
            <Link href="/shop?category=beanies" className="text-sm whitespace-nowrap transition-colors duration-200">Beanies</Link>
          </div>
        </div>
      </nav>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  );
};

export default Header;

import { Link } from "wouter";
import { ShoppingBag, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white p-2 rounded-md mr-2">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">LocalThreads</h3>
                <p className="text-xs text-neutral-400">South African Marketplace</p>
              </div>
            </div>
            <p className="text-neutral-400 mb-4">
              Connecting South Africans with local clothing brands and designers, supporting sustainable and ethical fashion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/shop?category=women" className="text-neutral-400 hover:text-primary">Women's Clothing</Link></li>
              <li><Link href="/shop?category=men" className="text-neutral-400 hover:text-primary">Men's Clothing</Link></li>
              <li><Link href="/shop?category=traditional" className="text-neutral-400 hover:text-primary">Traditional Wear</Link></li>
              <li><Link href="/shop?category=accessories" className="text-neutral-400 hover:text-primary">Accessories</Link></li>
              <li><Link href="/shop?new=true" className="text-neutral-400 hover:text-primary">New Arrivals</Link></li>
              <li><Link href="/shop?sale=true" className="text-neutral-400 hover:text-primary">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sell</h3>
            <ul className="space-y-2">
              <li><Link href="/auth?role=seller" className="text-neutral-400 hover:text-primary">Start Selling</Link></li>
              <li><Link href="/seller/dashboard" className="text-neutral-400 hover:text-primary">Seller Dashboard</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Seller Guidelines</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Success Stories</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Seller Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">FAQs</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Shipping Information</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Returns & Exchanges</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Track Order</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-neutral-400 hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} LocalThreads Marketplace. All rights reserved.
            </p>
            <div className="flex items-center">
              <p className="text-sm text-neutral-400 mr-4">Payment Methods:</p>
              <div className="flex space-x-3">
                <div className="bg-white px-2 py-1 rounded">
                  <span className="text-neutral-800 font-bold text-xs">VISA</span>
                </div>
                <div className="bg-white px-2 py-1 rounded">
                  <span className="text-neutral-800 font-bold text-xs">MASTERCARD</span>
                </div>
                <div className="bg-white px-2 py-1 rounded">
                  <span className="text-neutral-800 font-bold text-xs">PAYPAL</span>
                </div>
                <div className="bg-white px-2 py-1 rounded">
                  <span className="text-neutral-800 font-bold text-xs">SnapScan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

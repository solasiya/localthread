import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SellerCTA = () => {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    category: "",
    agreedToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms & Conditions to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (user) {
      // If user is logged in, redirect to seller onboarding
      navigate("/seller/onboarding");
    } else {
      // If not logged in, redirect to registration with seller role
      navigate("/auth?role=seller");
    }
    
    toast({
      title: "Application Received",
      description: "Thank you for your interest in becoming a seller!",
      variant: "default"
    });
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Become a Seller on<br/>LocalThreads Marketplace
            </h2>
            <p className="text-neutral-200 mb-6">
              Join our growing community of South African clothing brands and reach customers nationwide. We provide the platform, you bring your unique designs.
            </p>
            <ul className="text-neutral-200 mb-8">
              {[
                "Easy store setup and management",
                "Access to nationwide customer base",
                "Secure payment processing",
                "Marketing and promotional opportunities",
                "Sales analytics and business insights"
              ].map((item, index) => (
                <li key={index} className="flex items-center mb-2">
                  <div className="bg-accent rounded-full p-1 mr-2">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="bg-accent text-secondary hover:bg-accent-light">
              <Link href="/auth?role=seller">Register as a Seller</Link>
            </Button>
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-heading text-xl font-bold text-neutral-800 mb-4">Quick Seller Registration</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="category">Primary Product Category</Label>
                  <Select onValueChange={handleSelectChange} value={formData.category}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="women">Women's Clothing</SelectItem>
                        <SelectItem value="men">Men's Clothing</SelectItem>
                        <SelectItem value="traditional">Traditional Wear</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="kids">Kids Clothing</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-6 flex items-center space-x-2">
                  <Checkbox 
                    id="termsCheckbox" 
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, agreedToTerms: checked === true})
                    }
                  />
                  <Label 
                    htmlFor="termsCheckbox" 
                    className="text-sm text-neutral-600"
                  >
                    I agree to the Terms & Conditions and Privacy Policy
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;

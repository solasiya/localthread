import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Define the login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Define the registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  fullName: z.string().min(2, "Full name is required"),
  role: z.enum(["buyer", "seller", "admin"]).default("buyer"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const redirectPath = searchParams.get("redirect") || "/";
  const initialRole = searchParams.get("role") || "buyer";
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
    
    // Set active tab based on URL param
    if (searchParams.get("tab") === "register" || searchParams.get("role") === "seller") {
      setActiveTab("register");
    }
  }, [user, navigate, redirectPath, searchParams]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      role: initialRole as "buyer" | "seller" | "admin",
    },
  });
  
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate(redirectPath);
      },
    });
  };
  
  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        navigate(redirectPath);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Login or Register | LocalThreads Marketplace</title>
        <meta name="description" content="Join LocalThreads Marketplace - sign up or login to browse and shop from South Africa's finest clothing brands." />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Nunito+Sans:wght@300;400;600;700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Left column - Auth Forms */}
              <div className="w-full md:w-1/2 p-8">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold font-heading">Welcome Back</h1>
                        <p className="text-neutral-600">Login to your account</p>
                      </div>
                      
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username or Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="your_username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                          </Button>
                        </form>
                      </Form>
                      
                      <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600">
                          Don't have an account?{" "}
                          <button 
                            onClick={() => setActiveTab("register")}
                            className="text-primary hover:underline"
                          >
                            Register
                          </button>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold font-heading">Create Your Account</h1>
                        <p className="text-neutral-600">Join the LocalThreads community</p>
                      </div>
                      
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={registerForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Register as</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="buyer">Buyer</SelectItem>
                                    <SelectItem value="seller">Seller</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Creating account..." : "Register"}
                          </Button>
                        </form>
                      </Form>
                      
                      <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600">
                          Already have an account?{" "}
                          <button 
                            onClick={() => setActiveTab("login")}
                            className="text-primary hover:underline"
                          >
                            Login
                          </button>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right column - Hero/Brand Showcase */}
              <div className="hidden md:block md:w-1/2 bg-primary hero-pattern">
                <div className="flex flex-col items-center justify-center h-full p-12 text-white">
                  <div className="bg-white text-primary p-4 rounded-full mb-8">
                    <ShoppingBag className="h-12 w-12" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4">
                    {activeTab === "login" 
                      ? "Welcome Back to LocalThreads" 
                      : "Join LocalThreads Marketplace"}
                  </h2>
                  <p className="text-lg text-center mb-8 max-w-md">
                    {activeTab === "login"
                      ? "Sign in to discover authentic South African fashion, support local designers, and get exclusive access to new arrivals."
                      : "Create an account to browse our collection of authentic South African clothing brands, track your orders, and enjoy a seamless shopping experience."}
                  </p>
                  
                  {activeTab === "register" && (
                    <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="font-bold text-xl mb-4">As a member, you'll enjoy:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <span className="bg-white text-primary rounded-full p-1 mr-2">✓</span>
                          Access to exclusive South African brands
                        </li>
                        <li className="flex items-center">
                          <span className="bg-white text-primary rounded-full p-1 mr-2">✓</span>
                          Track your orders in real-time
                        </li>
                        <li className="flex items-center">
                          <span className="bg-white text-primary rounded-full p-1 mr-2">✓</span>
                          Save your favorite items
                        </li>
                        <li className="flex items-center">
                          <span className="bg-white text-primary rounded-full p-1 mr-2">✓</span>
                          Early access to sales and promotions
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AuthPage;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { ZodError, z } from "zod";
import { insertProductSchema, insertCategorySchema, insertReviewSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth routes
  setupAuth(app);
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Middleware to check if user has a specific role
  const hasRole = (roles: string[]) => (req, res, next) => {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };
  
  // Error handler for validation errors
  const handleZodError = (error: unknown, res) => {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    throw error;
  };

  // Category endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  app.post("/api/categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Product endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const { 
        storeId, 
        categoryId, 
        search, 
        featured, 
        limit = 20, 
        page = 1 
      } = req.query;
      
      const options = {
        storeId: storeId ? parseInt(storeId as string) : undefined,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        search: search as string | undefined,
        isFeatured: featured === 'true' ? true : undefined,
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string)
      };
      
      const products = await storage.getProducts(options);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.post("/api/products", isAuthenticated, hasRole(["seller", "admin"]), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Check if user owns the store
      if (req.user.role === 'seller') {
        const store = await storage.getStoreByUserId(req.user.id);
        if (!store || store.id !== validatedData.storeId) {
          return res.status(403).json({ message: "You can only add products to your own store" });
        }
        
        // Check if store is verified
        if (!store.isVerified) {
          return res.status(403).json({ 
            message: "Your store must be verified by an admin before you can add products",
            isVerified: false
          });
        }
      }
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.put("/api/products/:id", isAuthenticated, hasRole(["seller", "admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user owns the store
      if (req.user.role === 'seller') {
        const store = await storage.getStoreByUserId(req.user.id);
        if (!store || store.id !== product.storeId) {
          return res.status(403).json({ message: "You can only edit your own products" });
        }
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(productId, validatedData);
      res.json(updatedProduct);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.delete("/api/products/:id", isAuthenticated, hasRole(["seller", "admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user owns the store
      if (req.user.role === 'seller') {
        const store = await storage.getStoreByUserId(req.user.id);
        if (!store || store.id !== product.storeId) {
          return res.status(403).json({ message: "You can only delete your own products" });
        }
      }
      
      await storage.deleteProduct(productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByProductId(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  app.post("/api/products/:id/reviews", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        productId
      });
      
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Cart endpoints
  app.get("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const cartItems = await storage.getCartItemsByUserId(req.user.id);
      
      // For each cart item, get the product details
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(itemsWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  
  app.post("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid product or quantity" });
      }
      
      const product = await storage.getProduct(parseInt(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const cartItem = await storage.addToCart({
        userId: req.user.id,
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      });
      
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  
  app.put("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(itemId, quantity);
      
      if (quantity === 0) {
        return res.status(204).send();
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  
  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.removeFromCart(itemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  
  app.delete("/api/cart", isAuthenticated, async (req, res) => {
    try {
      await storage.clearCart(req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  
  // Order endpoints
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const orders = await storage.getOrdersByUserId(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user owns the order or is an admin
      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const items = await storage.getOrderItems(orderId);
      
      // Get product details for each item
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        ...order,
        items: itemsWithProducts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const { 
        total, 
        shippingAddress, 
        shippingCity, 
        shippingProvince, 
        shippingPostalCode 
      } = req.body;
      
      // Validate required fields
      if (!total || !shippingAddress || !shippingCity || !shippingProvince || !shippingPostalCode) {
        return res.status(400).json({ message: "Missing required order information" });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItemsByUserId(req.user.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Your cart is empty" });
      }
      
      // Create order items from cart items
      const orderItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }
          
          // Use sale price if available, otherwise use regular price
          const price = product.salePrice || product.price;
          
          return {
            productId: item.productId,
            quantity: item.quantity,
            price,
            orderId: 0 // Will be set in the transaction
          };
        })
      );
      
      // Create the order
      const order = await storage.createOrder(
        {
          userId: req.user.id,
          total: parseFloat(total),
          status: 'pending',
          paymentStatus: 'pending',
          shippingAddress,
          shippingCity,
          shippingProvince,
          shippingPostalCode
        },
        orderItems
      );
      
      // Clear the cart
      await storage.clearCart(req.user.id);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Update order status (admin only)
  app.put("/api/orders/:id/status", isAuthenticated, hasRole(["admin", "seller"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // If seller, check if they own any products in the order
      if (req.user.role === 'seller') {
        const orderItems = await storage.getOrderItems(orderId);
        const productIds = orderItems.map(item => item.productId);
        
        // Get all products in the order
        const products = await Promise.all(
          productIds.map(id => storage.getProduct(id))
        );
        
        // Check if seller owns any of the products
        const store = await storage.getStoreByUserId(req.user.id);
        if (!store) {
          return res.status(403).json({ message: "Unauthorized" });
        }
        
        const ownsAnyProduct = products.some(product => product?.storeId === store.id);
        if (!ownsAnyProduct) {
          return res.status(403).json({ message: "Unauthorized" });
        }
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  
  // Store endpoints
  app.get("/api/stores/:id", async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });
  
  // Get current seller's store
  app.get("/api/seller/store", isAuthenticated, hasRole(["seller"]), async (req, res) => {
    try {
      const store = await storage.getStoreByUserId(req.user.id);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });
  
  app.put("/api/stores/:id", isAuthenticated, async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      // Check if user owns the store or is an admin
      if (store.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updatedStore = await storage.updateStore(storeId, req.body);
      res.json(updatedStore);
    } catch (error) {
      res.status(500).json({ message: "Failed to update store" });
    }
  });
  
  // User profile endpoints
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...userProfile } = user;
      
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const { password, ...updateData } = req.body;
      
      // Update user data
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password: _, ...userProfile } = updatedUser;
      
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Admin endpoints
  app.get("/api/admin/users", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      // This is a simplified implementation
      // In a real-world app, you'd add pagination, filtering, etc.
      res.json({ message: "Admin user management would be here" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // Admin endpoint to get all stores
  app.get("/api/admin/stores", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      // In a real app, you would add pagination, filtering, etc.
      const stores = await storage.getAllStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });
  
  // Admin endpoint to verify or reject a store
  app.patch("/api/admin/stores/:id/verify", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const storeId = parseInt(req.params.id);
      const { action } = req.body;
      
      // Check if action is valid
      if (!action || !["approve", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'" });
      }
      
      const isVerified = action === "approve";
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      // Get the store owner for email notification
      const storeOwner = await storage.getUser(store.userId);
      if (!storeOwner) {
        return res.status(404).json({ message: "Store owner not found" });
      }
      
      const updatedStore = await storage.updateStore(storeId, { isVerified });
      
      // Send email notification to the store owner
      const { sendStoreVerificationEmail } = await import('./email');
      await sendStoreVerificationEmail(
        storeOwner.email, 
        store.name, 
        isVerified,
        !isVerified ? req.body.reason : undefined
      );
      
      res.json(updatedStore);
    } catch (error) {
      console.error("Failed to update store verification:", error);
      res.status(500).json({ message: "Failed to update store verification" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}

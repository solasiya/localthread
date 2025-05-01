import { 
  users, 
  stores,
  products,
  categories,
  reviews,
  cartItems,
  orders,
  orderItems,
  type User, 
  type InsertUser,
  type Store,
  type InsertStore,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Review,
  type InsertReview,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, like, desc, asc, or, isNull, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Store management
  getStore(id: number): Promise<Store | undefined>;
  getStoreByUserId(userId: number): Promise<Store | undefined>;
  getAllStores(): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  
  // Category management
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product management
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(options?: { 
    storeId?: number, 
    categoryId?: number,
    search?: string,
    isFeatured?: boolean,
    limit?: number,
    offset?: number
  }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Review management
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProductId(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart management
  getCartItemsByUserId(userId: number): Promise<CartItem[]>;
  getCartItemWithProduct(userId: number, productId: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order management
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Session store
  sessionStore: any; // Using any for now to avoid type errors
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Store management
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }
  
  async getStoreByUserId(userId: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.userId, userId));
    return store;
  }
  
  async getAllStores(): Promise<Store[]> {
    return db.select().from(stores).orderBy(desc(stores.createdAt));
  }
  
  async createStore(store: InsertStore): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store).returning();
    return newStore;
  }
  
  async updateStore(id: number, storeData: Partial<InsertStore>): Promise<Store | undefined> {
    const [updatedStore] = await db
      .update(stores)
      .set(storeData)
      .where(eq(stores.id, id))
      .returning();
    return updatedStore;
  }
  
  // Category management
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }
  
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  
  // Product management
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async getProducts(options: { 
    storeId?: number, 
    categoryId?: number,
    search?: string,
    isFeatured?: boolean,
    limit?: number,
    offset?: number
  } = {}): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (options.storeId) {
      query = query.where(eq(products.storeId, options.storeId));
    }
    
    if (options.categoryId) {
      query = query.where(eq(products.categoryId, options.categoryId));
    }
    
    if (options.search) {
      query = query.where(
        or(
          like(products.name, `%${options.search}%`),
          like(products.description, `%${options.search}%`)
        )
      );
    }
    
    if (options.isFeatured !== undefined) {
      query = query.where(eq(products.isFeatured, options.isFeatured));
    }
    
    query = query.where(eq(products.isActive, true));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.offset(options.offset);
    }
    
    query = query.orderBy(desc(products.createdAt));
    
    return query;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }
  
  // Review management
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
  
  // Cart management
  async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
    return db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
  }
  
  async getCartItemWithProduct(userId: number, productId: number): Promise<CartItem | undefined> {
    const [item] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId)
        )
      );
    return item;
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const existingItem = await this.getCartItemWithProduct(
      cartItem.userId,
      cartItem.productId
    );
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + cartItem.quantity;
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      const [newItem] = await db
        .insert(cartItems)
        .values(cartItem)
        .returning();
      return newItem;
    }
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeFromCart(id);
      return undefined;
    }
    
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }
  
  async clearCart(userId: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return true;
  }
  
  // Order management
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
  
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Transaction to create order and order items
    const [newOrder] = await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(orders)
        .values(order)
        .returning();
      
      // Add order ID to each item
      const orderItemsWithId = items.map(item => ({
        ...item,
        orderId: createdOrder.id
      }));
      
      await tx.insert(orderItems).values(orderItemsWithId);
      
      return [createdOrder];
    });
    
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }
}

export const storage = new DatabaseStorage();

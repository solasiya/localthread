import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp,
  pgEnum,
  primaryKey,
  doublePrecision,
  json 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['buyer', 'seller', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default('buyer'),
  phone: text("phone"),
  avatar: text("avatar"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  store: one(stores, {
    fields: [users.id],
    references: [stores.userId],
  }),
  orders: many(orders),
  reviews: many(reviews),
  cart: many(cartItems),
}));

// Stores table
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  products: many(products),
}));

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  salePrice: doublePrecision("sale_price"),
  images: json("images").$type<string[]>().notNull(),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

// Cart Items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  total: doublePrecision("total").notNull(),
  status: orderStatusEnum("status").notNull().default('pending'),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default('pending'),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingProvince: text("shipping_province").notNull(),
  shippingPostalCode: text("shipping_postal_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

// Order Items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  phone: true,
  address: true,
  city: true,
  province: true,
  postalCode: true,
}).omit({ id: true, createdAt: true });

export const insertStoreSchema = createInsertSchema(stores).pick({
  userId: true,
  name: true,
  description: true,
  logo: true,
  bannerImage: true,
}).omit({ id: true, isVerified: true, createdAt: true });

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  image: true,
}).omit({ id: true });

export const insertProductSchema = createInsertSchema(products).pick({
  storeId: true,
  categoryId: true,
  name: true,
  description: true,
  price: true,
  salePrice: true,
  images: true,
  stock: true,
  isActive: true,
  isFeatured: true,
}).omit({ id: true, createdAt: true });

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
}).omit({ id: true, createdAt: true });

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  status: true,
  paymentStatus: true,
  shippingAddress: true,
  shippingCity: true,
  shippingProvince: true,
  shippingPostalCode: true,
}).omit({ id: true, createdAt: true });

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
}).omit({ id: true });

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  rating: true,
  comment: true,
}).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

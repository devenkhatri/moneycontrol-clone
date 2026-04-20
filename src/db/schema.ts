import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const assetClasses = sqliteTable("asset_classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  icon: text("icon"),
});

export const holdings = sqliteTable("holdings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetClassId: integer("asset_class_id").references(() => assetClasses.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull().default(0),
  avgPrice: real("avg_price").notNull().default(0),
  currentPrice: real("current_price"),
  lastUpdated: integer("last_updated", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  holdingId: integer("holding_id").references(() => holdings.id),
  assetClassId: integer("asset_class_id").references(() => assetClasses.id),
  type: text("type").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(),
  price: real("price").notNull(),
  totalAmount: real("total_amount").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dividends = sqliteTable("dividends", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  holdingId: integer("holding_id").references(() => holdings.id),
  assetClassId: integer("asset_class_id").references(() => assetClasses.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  perShare: real("per_share"),
  exDate: integer("ex_date", { mode: "timestamp" }).notNull(),
  paymentDate: integer("payment_date", { mode: "timestamp" }),
  reinvested: integer("reinvested", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const sips = sqliteTable("sips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  holdingId: integer("holding_id").references(() => holdings.id),
  assetClassId: integer("asset_class_id").references(() => assetClasses.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  frequency: text("frequency").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  lastInstallmentDate: integer("last_installment_date", { mode: "timestamp" }),
  nextInstallmentDate: integer("next_installment_date", { mode: "timestamp" }),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const sipInstallments = sqliteTable("sip_installments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sipId: integer("sip_id").references(() => sips.id),
  amount: real("amount").notNull(),
  nav: real("nav"),
  units: real("units"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("completed"),
});

export const watchlists = sqliteTable("watchlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const watchlistItems = sqliteTable("watchlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  watchlistId: integer("watchlist_id").references(() => watchlists.id),
  assetClassId: integer("asset_class_id").references(() => assetClasses.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  addedAt: integer("added_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  institution: text("institution"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const portfolioHistory = sqliteTable("portfolio_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  totalValue: real("total_value").notNull(),
  dayChange: real("day_change"),
  dayChangePercent: real("day_change_percent"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
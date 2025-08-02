import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const issues = pgTable("issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("reported"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address"),
  images: text("images").array().default([]),
  upvotes: integer("upvotes").default(0),
  reporterId: varchar("reporter_id").references(() => users.id),
  isAnonymous: boolean("is_anonymous").default(false),
  flagCount: integer("flag_count").default(0),
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: varchar("issue_id").notNull().references(() => issues.id),
  authorId: varchar("author_id").references(() => users.id),
  content: text("content").notNull(),
  parentId: varchar("parent_id"), // For threaded comments
  likes: integer("likes").default(0),
  flagCount: integer("flag_count").default(0),
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: varchar("issue_id").notNull().references(() => issues.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp("created_at").defaultNow(),
});

export const statusHistory = pgTable("status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: varchar("issue_id").notNull().references(() => issues.id),
  status: text("status").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: varchar("issue_id").notNull().references(() => issues.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true,
  upvotes: true,
  flagCount: true,
  isHidden: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likes: true,
  flagCount: true,
  isHidden: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertStatusHistorySchema = createInsertSchema(statusHistory).omit({
  id: true,
  createdAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Issue = typeof issues.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type StatusHistory = typeof statusHistory.$inferSelect;
export type Follow = typeof follows.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertStatusHistory = z.infer<typeof insertStatusHistorySchema>;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

// Enums
export const IssueCategory = z.enum(["garbage", "water", "roads", "traffic", "lighting", "parks", "other"]);
export const IssueStatus = z.enum(["reported", "in-progress", "resolved", "flagged"]);
export const VoteType = z.enum(["upvote", "downvote"]);

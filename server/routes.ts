import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIssueSchema, insertCommentSchema, insertVoteSchema, insertFollowSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Issues routes
  app.get("/api/issues", async (req, res) => {
    try {
      const { category, status, latitude, longitude, radius } = req.query;
      
      const filters: any = {};
      if (category && category !== "all") filters.category = category;
      if (status && status !== "all") filters.status = status;
      if (latitude) filters.latitude = parseFloat(latitude as string);
      if (longitude) filters.longitude = parseFloat(longitude as string);
      if (radius) filters.radius = parseFloat(radius as string);

      const issues = await storage.getIssuesByFilter(filters);
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  app.get("/api/issues/:id", async (req, res) => {
    try {
      const issue = await storage.getIssue(req.params.id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      res.json(issue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issue" });
    }
  });

  app.post("/api/issues", async (req, res) => {
    try {
      const validatedData = insertIssueSchema.parse(req.body);
      const issue = await storage.createIssue(validatedData);
      res.status(201).json(issue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid issue data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create issue" });
    }
  });

  app.patch("/api/issues/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const issue = await storage.updateIssueStatus(req.params.id, status);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      res.json(issue);
    } catch (error) {
      res.status(500).json({ message: "Failed to update issue status" });
    }
  });

  // Voting routes
  app.post("/api/issues/:id/vote", async (req, res) => {
    try {
      const { type, userId } = req.body;
      const issueId = req.params.id;

      // Check if user already voted
      const existingVote = await storage.getVoteByUserAndIssue(userId, issueId);
      if (existingVote) {
        // Remove existing vote
        await storage.deleteVote(userId, issueId);
      }

      // Create new vote
      const voteData = insertVoteSchema.parse({ issueId, userId, type });
      await storage.createVote(voteData);

      // Update issue upvotes if it's an upvote
      if (type === "upvote") {
        const updatedIssue = await storage.incrementUpvotes(issueId);
        res.json(updatedIssue);
      } else {
        const issue = await storage.getIssue(issueId);
        res.json(issue);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process vote" });
    }
  });

  app.post("/api/issues/:id/flag", async (req, res) => {
    try {
      const issue = await storage.incrementFlagCount(req.params.id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      res.json(issue);
    } catch (error) {
      res.status(500).json({ message: "Failed to flag issue" });
    }
  });

  // Comments routes
  app.get("/api/issues/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByIssueId(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/issues/:id/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse({
        ...req.body,
        issueId: req.params.id,
      });
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const comment = await storage.likeComment(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  app.post("/api/comments/:id/flag", async (req, res) => {
    try {
      const comment = await storage.flagComment(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to flag comment" });
    }
  });

  // Status history routes
  app.get("/api/issues/:id/status-history", async (req, res) => {
    try {
      const statusHistory = await storage.getStatusHistoryByIssueId(req.params.id);
      res.json(statusHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch status history" });
    }
  });

  // Follow routes
  app.post("/api/issues/:id/follow", async (req, res) => {
    try {
      const { userId } = req.body;
      const issueId = req.params.id;

      // Check if already following
      const existingFollow = await storage.getFollowByUserAndIssue(userId, issueId);
      if (existingFollow) {
        // Unfollow
        await storage.deleteFollow(userId, issueId);
        res.json({ following: false });
      } else {
        // Follow
        const followData = insertFollowSchema.parse({ issueId, userId });
        await storage.createFollow(followData);
        res.json({ following: true });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid follow data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to toggle follow" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

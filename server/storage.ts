import { 
  type User, 
  type InsertUser, 
  type Issue, 
  type InsertIssue,
  type Comment,
  type InsertComment,
  type Vote,
  type InsertVote,
  type StatusHistory,
  type InsertStatusHistory,
  type Follow,
  type InsertFollow
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Issues
  getIssue(id: string): Promise<Issue | undefined>;
  getAllIssues(): Promise<Issue[]>;
  getIssuesByFilter(filters: {
    category?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<Issue[]>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssueStatus(id: string, status: string): Promise<Issue | undefined>;
  incrementUpvotes(id: string): Promise<Issue | undefined>;
  incrementFlagCount(id: string): Promise<Issue | undefined>;

  // Comments
  getCommentsByIssueId(issueId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  likeComment(id: string): Promise<Comment | undefined>;
  flagComment(id: string): Promise<Comment | undefined>;

  // Votes
  getVoteByUserAndIssue(userId: string, issueId: string): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  deleteVote(userId: string, issueId: string): Promise<boolean>;

  // Status History
  getStatusHistoryByIssueId(issueId: string): Promise<StatusHistory[]>;
  createStatusHistory(statusHistory: InsertStatusHistory): Promise<StatusHistory>;

  // Follows
  getFollowByUserAndIssue(userId: string, issueId: string): Promise<Follow | undefined>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(userId: string, issueId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private issues: Map<string, Issue>;
  private comments: Map<string, Comment>;
  private votes: Map<string, Vote>;
  private statusHistory: Map<string, StatusHistory>;
  private follows: Map<string, Follow>;

  constructor() {
    this.users = new Map();
    this.issues = new Map();
    this.comments = new Map();
    this.votes = new Map();
    this.statusHistory = new Map();
    this.follows = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isVerified: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Issues
  async getIssue(id: string): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async getAllIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values()).filter(issue => !issue.isHidden);
  }

  async getIssuesByFilter(filters: {
    category?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<Issue[]> {
    let issues = Array.from(this.issues.values()).filter(issue => !issue.isHidden);

    if (filters.category) {
      issues = issues.filter(issue => issue.category === filters.category);
    }

    if (filters.status) {
      issues = issues.filter(issue => issue.status === filters.status);
    }

    // TODO: Implement radius filtering with lat/lng
    
    return issues;
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = randomUUID();
    const issue: Issue = {
      ...insertIssue,
      id,
      upvotes: 0,
      flagCount: 0,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.issues.set(id, issue);

    // Create initial status history
    await this.createStatusHistory({
      issueId: id,
      status: issue.status,
      description: "Issue reported",
    });

    return issue;
  }

  async updateIssueStatus(id: string, status: string): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;

    const updatedIssue = { ...issue, status, updatedAt: new Date() };
    this.issues.set(id, updatedIssue);

    // Create status history entry
    await this.createStatusHistory({
      issueId: id,
      status,
      description: `Status changed to ${status}`,
    });

    return updatedIssue;
  }

  async incrementUpvotes(id: string): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;

    const updatedIssue = { ...issue, upvotes: issue.upvotes + 1 };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  async incrementFlagCount(id: string): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;

    const updatedIssue = { 
      ...issue, 
      flagCount: issue.flagCount + 1,
      isHidden: issue.flagCount + 1 >= 3 // Auto-hide after 3 flags
    };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  // Comments
  async getCommentsByIssueId(issueId: string): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.issueId === issueId && !comment.isHidden
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      likes: 0,
      flagCount: 0,
      isHidden: false,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async likeComment(id: string): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    const updatedComment = { ...comment, likes: comment.likes + 1 };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  async flagComment(id: string): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    const updatedComment = { 
      ...comment, 
      flagCount: comment.flagCount + 1,
      isHidden: comment.flagCount + 1 >= 3
    };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  // Votes
  async getVoteByUserAndIssue(userId: string, issueId: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.issueId === issueId
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = {
      ...insertVote,
      id,
      createdAt: new Date(),
    };
    this.votes.set(id, vote);
    return vote;
  }

  async deleteVote(userId: string, issueId: string): Promise<boolean> {
    const vote = Array.from(this.votes.values()).find(
      v => v.userId === userId && v.issueId === issueId
    );
    if (!vote) return false;

    this.votes.delete(vote.id);
    return true;
  }

  // Status History
  async getStatusHistoryByIssueId(issueId: string): Promise<StatusHistory[]> {
    return Array.from(this.statusHistory.values()).filter(
      history => history.issueId === issueId
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createStatusHistory(insertStatusHistory: InsertStatusHistory): Promise<StatusHistory> {
    const id = randomUUID();
    const statusHistory: StatusHistory = {
      ...insertStatusHistory,
      id,
      createdAt: new Date(),
    };
    this.statusHistory.set(id, statusHistory);
    return statusHistory;
  }

  // Follows
  async getFollowByUserAndIssue(userId: string, issueId: string): Promise<Follow | undefined> {
    return Array.from(this.follows.values()).find(
      follow => follow.userId === userId && follow.issueId === issueId
    );
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const id = randomUUID();
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: new Date(),
    };
    this.follows.set(id, follow);
    return follow;
  }

  async deleteFollow(userId: string, issueId: string): Promise<boolean> {
    const follow = Array.from(this.follows.values()).find(
      f => f.userId === userId && f.issueId === issueId
    );
    if (!follow) return false;

    this.follows.delete(follow.id);
    return true;
  }
}

export const storage = new MemStorage();

import { users, type User, type InsertUser, type ContactMessage, type InsertContactMessage, type PortfolioItem, type InsertPortfolioItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: any): Promise<any>;
  getPortfolioItems(): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<boolean>;
  clearPortfolioItems(): Promise<void>;
  upsertPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private portfolioItems: Map<number, PortfolioItem>;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.portfolioItems = new Map();
    this.currentId = 1;
    this.currentMessageId = 1;
    this.currentPortfolioId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.currentPortfolioId++;
    const now = new Date();
    const portfolioItem: PortfolioItem = {
      id,
      ...item,
      createdAt: now,
      updatedAt: now,
    };
    this.portfolioItems.set(id, portfolioItem);
    return portfolioItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  async clearPortfolioItems(): Promise<void> {
    this.portfolioItems.clear();
  }

  async upsertPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    // Normalize title for matching (trim whitespace, lowercase)
    const normalizedNewTitle = (item.title || "").trim().toLowerCase();
    
    // Find existing item with the same title and type
    const existingItem = Array.from(this.portfolioItems.values()).find(
      (p) => {
        const normalizedExistingTitle = (p.title || "").trim().toLowerCase();
        return normalizedExistingTitle === normalizedNewTitle && p.type === item.type;
      }
    );

    if (existingItem) {
      // Update existing item
      const updatedItem: PortfolioItem = {
        ...existingItem,
        ...item,
        title: (item.title || "").trim(), // Trim the new title too
        updatedAt: new Date(),
      };
      this.portfolioItems.set(existingItem.id, updatedItem);
      console.log(`✓ Updated portfolio item: "${existingItem.title}" (${item.type})`);
      return updatedItem;
    } else {
      // Create new item
      console.log(`✓ Created new portfolio item: "${item.title}" (${item.type})`);
      return this.createPortfolioItem(item);
    }
  }
}

export const storage = new MemStorage();

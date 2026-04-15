import type { Express } from "express";
import { storage } from "../../storage";
import { insertPortfolioItemSchema } from "@shared/schema";
import { z } from "zod";

export default function portfolioRoutes(app: Express) {
  // Get all portfolio items
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch portfolio items" });
    }
  });

  // Create a portfolio item
  app.post("/api/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validatedData);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid portfolio item data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ success: false, message: "Failed to create portfolio item" });
      }
    }
  });

  // Bulk create or update portfolio items from Excel
  app.post("/api/portfolio/bulk", async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ 
          success: false, 
          message: "Items must be an array" 
        });
      }

      console.log(`📥 Processing ${items.length} portfolio items from Excel...`);

      // Upsert all items (update if exists by title+type, create if new)
      const upsertedItems = [];
      const errors = [];

      for (const item of items) {
        try {
          // Validate and normalize the type
          const normalizedType = (item.type || "poster").toLowerCase();
          if (!["poster", "video", "website"].includes(normalizedType)) {
            errors.push(`Invalid type "${item.type}" for "${item.title}". Allowed: poster, video, website`);
            continue;
          }

          // Normalize title
          const normalizedTitle = (item.title || "").trim();
          if (!normalizedTitle) {
            errors.push(`Row skipped: Title is required`);
            continue;
          }

          const validatedData = insertPortfolioItemSchema.parse({
            ...item,
            title: normalizedTitle,
            type: normalizedType,
          });

          const upsertedItem = await storage.upsertPortfolioItem(validatedData);
          upsertedItems.push(upsertedItem);
        } catch (itemError) {
          console.error("Error upserting item:", item, itemError);
          errors.push(`Failed to process "${item.title}": ${itemError instanceof Error ? itemError.message : "Unknown error"}`);
        }
      }

      const message = errors.length > 0 
        ? `Synced ${upsertedItems.length}/${items.length} items. ${errors.length} had issues.`
        : `Successfully synced all ${upsertedItems.length} items!`;

      res.status(201).json({ 
        success: true, 
        message,
        data: upsertedItems,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error("Bulk upsert error:", error);
      res.status(500).json({ success: false, message: "Failed to bulk upsert portfolio items" });
    }
  });

  // Delete a portfolio item
  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePortfolioItem(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Portfolio item not found" });
      }
      res.json({ success: true, message: "Portfolio item deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete portfolio item" });
    }
  });
}

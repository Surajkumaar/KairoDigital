import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import configRoutes from "./routes/api/config";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register the config API routes
  app.use("/api/config", configRoutes);
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Message sent successfully!",
        id: contactMessage.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message" 
        });
      }
    }
  });

  // Newsletter signup endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ 
          success: false, 
          message: "Valid email address required" 
        });
      }
      
      // In a real implementation, this would integrate with an email service
      res.status(200).json({ 
        success: true, 
        message: "Successfully subscribed to newsletter!" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to subscribe to newsletter" 
      });
    }
  });

  // Google Drive image proxy endpoint
  app.get("/api/drive-image/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      if (!fileId || fileId.length < 20) {
        return res.status(400).json({ error: "Invalid file ID" });
      }

      // Use the Direct Download URL format for Google Drive files
      const driveImageUrl = `https://drive.google.com/uc?id=${fileId}&export=view&confirm=t`;
      
      const response = await fetch(driveImageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch image from Google Drive" });
      }

      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "image/jpeg";
      
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Drive image proxy error:", error);
      res.status(500).json({ error: "Failed to proxy image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

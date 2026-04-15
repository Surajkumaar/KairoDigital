import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import configRoutes from "./routes/api/config";
import portfolioRoutes from "./routes/api/portfolio";

// Static portfolio data - matches portfolio-links.ts structure
const STATIC_PORTFOLIO_DATA = [
  {
    title: "Ep Release",
    description: "Minimal streetwear platform showcasing bold collections, premium fabrics, and expressive design identity.",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1SGhzT_sWr6PmfMsBJwZixd_a6hbhYv0N&w=600&h=800&fit=cover",
    websiteUrl: "https://blacmelo.com/?srsltid=AfmBOopO0WuNhMtspGmIU2thcQ1sFZ4hPijexfR3L5bSzxIkK7DbnqtT",
  },
  {
    title: "Kamal Navas",
    description: "AI-powered platform showcasing IT automation, incident management, and service orchestration for smarter operations.",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1oKJ_vtXrsXHPRup0suSiMjk2UZv6-fkd&w=600&h=800&fit=cover",
    websiteUrl: "https://blacmelo.com/",
  },
  {
    title: "Murugan Trophy",
    description: "Course-focused design with clear programs, student-friendly UI, and integrated enquiry for better conversions.",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=19_tk2Dz99oWLo2-kIXTT3j2frqL9RQa4&w=600&h=800&fit=cover",
    websiteUrl: "https://blacmelo.com/",
  },
  {
    title: "HOSUR TOPPERS ACADEMY",
    description: "Course-focused design with clear programs, student-friendly UI, and integrated enquiry for better conversions.",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1u13a2aslbRHltq55WE4T_Gi1Zu86bO7k&w=600&h=800&fit=cover",
    websiteUrl: "https://www.hosurtoppersacademy.com/",
  },
  {
    title: "28 DAY TRAINING PROGRAM",
    description: "Training program",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1PyRJa4bcXDugvQvaJSCAV10w4B6mdeIx&w=600&h=800&fit=cover",
    websiteUrl: "https://www.hosurtoppersacademy.com/",
  },
  {
    title: "GEOFFERY",
    description: "Design campaign",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1thbP-xmWEc553zVLtc3xA9zV4KJS0ZMV&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "Band Aid",
    description: "Band design",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1EwsI-qmneHS_Omf8BpqmJEvwRzNzJNmC&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "Race Action",
    description: "Motorsports marketing",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1fsr4Wl9z6u2iTNZtMngaXu21luQfef4l&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "Sports Support",
    description: "Sports sponsorship",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1Vwa2W1wRY4T_iupRr7_4Vp1cH2ED_WQM&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "CYPHER",
    description: "Event branding",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1nV_VH-90T8ACODvHFoaRsoOmp-ZMnrGR&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "Race 2 Results",
    description: "Racing event results",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1UMI6iA0Y3UCxnsMAuNbCywstuGkbpUKr&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "Motorcycle Racer",
    description: "Motorsports content",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1oBAy55NS8FtcALH4ieMHopilP3NaKNK2&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "MSBK 2025",
    description: "Motorcycle championship",
    type: "poster" as const,
    imageUrl: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=11baBnqsJWhV7y34gNwQZopWSei_BSHxd&w=600&h=800&fit=cover",
    websiteUrl: "#",
  },
  {
    title: "Blacmelo",
    description: "Video content",
    type: "video" as const,
    videoUrl: "https://youtu.be/yOCeuRVwP74",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1_aE-ZMgWedYbGNpKI4I3tSBhzCueLEHd&w=1280&h=720&fit=cover",
  },
  {
    title: "Crud",
    description: "Video content",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1palQ_X2xD1xzzQja4RK2sTn-4cNcrCdR/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1tIupSl0FgbQ1-x14VEgeHSYBDub9aTv6&w=1280&h=720&fit=cover",
  },
  {
    title: "GE17XAGR",
    description: "Video content",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1MZgtq90z_V9pGuslZLhZHW_ikVpVKBg-/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1kuXJdciRJwRe0nHEtX7yROVJ0gQ3sme8&w=1280&h=720&fit=cover",
  },
  {
    title: "HTA",
    description: "Academy video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1pKciPEHPLujFJmSMPESedPoPrp8jQTVO/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1PmGblkrnkkT2ogAl0vyGT-Ij2-iw8rrK&w=1280&h=720&fit=cover",
  },
  {
    title: "Silvan_Promo",
    description: "Promo video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1MtNgF_rdh5bwK7s8k6efxERwVTHFujAR/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1u2iuXkzsBWst4iseatUGOOk6CIGtY62_&w=1280&h=720&fit=cover",
  },
  {
    title: "Boutique Montage",
    description: "Fashion video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1Fsv2fzKudhrK-Dpl6_3EWp4p4fsLDEs4/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1z0ApzeaijUaDpJaFKQ6IuK6VsT2Znjw4&w=1280&h=720&fit=cover",
  },
  {
    title: "POV",
    description: "Perspective video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/181CzEYuaR4LHnzg5Kc8-PTXMaSApwdna/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1WNQUBO2PfEeckl7R6l542mDzKvJuekEQ&w=1280&h=720&fit=cover",
  },
  {
    title: "Anudhi",
    description: "Video content",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/12R8iTDn1Yt-K4h-Z6CIFb2AizW8bc4th/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1G1EIjzbH1-SVPyX1-J4se8MMiaNvGM34&w=1280&h=720&fit=cover",
  },
  {
    title: "The Academy",
    description: "Educational video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1dQ53LmlNRQCMHxUAdYtHOpK7FSukYotM/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1EpM5qdHXD1SkbXhYIfntHUbDkwMoEadE&w=1280&h=720&fit=cover",
  },
  {
    title: "Sport Support",
    description: "Sports video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/17-zSrrRMQMcvUHR7dXGtAk0TBOHH9n2Y/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1fXRDRTtf7Hd0hGe2x38OJ9PQbrnVrAHd&w=1280&h=720&fit=cover",
  },
  {
    title: "GE",
    description: "Video content",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1FX3lNocPDESto1wHuRh8GqeT3Ez9M1my/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1Ifeyv3oA0buFkmofLyQQxKN-nEcWHN18&w=1280&h=720&fit=cover",
  },
  {
    title: "Crocin",
    description: "Brand video",
    type: "video" as const,
    videoUrl: "https://drive.google.com/file/d/1Qj55CFrygVRQEUIfX9Wep3cMdoaFkNh9/preview",
    videoThumbnail: "https://images.weserv.nl/?url=https://drive.google.com/uc?export=download%26id=1qh2xBbPQRd26SizEvLX0f3LIoaw3cfFj&w=1280&h=720&fit=cover",
  },
  {
    title: "Blacmelo",
    description: "Minimal streetwear platform",
    type: "website" as const,
    websiteUrl: "https://blacmelo.com/?srsltid=AfmBOopO0WuNhMtspGmIU2thcQ1sFZ4hPijexfR3L5bSzxIkK7DbnqtT",
  },
  {
    title: "Autointelli",
    description: "AI automation platform",
    type: "website" as const,
    websiteUrl: "https://autointelli.com/",
  },
  {
    title: "Hosur Toppers Academy.",
    description: "Educational platform",
    type: "website" as const,
    websiteUrl: "https://www.hosurtoppersacademy.com/",
  },
  {
    title: "NextUp",
    description: "Coming soon",
    type: "website" as const,
    websiteUrl: "https://www.kairodigital.in/under-development",
  },
];

async function initializeStaticPortfolioData() {
  try {
    // Add all static portfolio items to storage
    for (const item of STATIC_PORTFOLIO_DATA) {
      // Use upsert to ensure we don't create duplicates on server restart
      await storage.upsertPortfolioItem({
        title: item.title,
        description: item.description,
        type: item.type,
        imageUrl: item.imageUrl,
        videoUrl: item.videoUrl,
        videoThumbnail: item.videoThumbnail,
        websiteUrl: item.websiteUrl,
      });
    }
    console.log(`✓ Initialized ${STATIC_PORTFOLIO_DATA.length} static portfolio items`);
  } catch (error) {
    console.error("Failed to initialize static portfolio data:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize static portfolio data
  await initializeStaticPortfolioData();

  // Register the config API routes
  app.use("/api/config", configRoutes);
  
  // Register portfolio routes
  portfolioRoutes(app);
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

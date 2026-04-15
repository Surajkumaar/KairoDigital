import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Get the dist directory path
  const distPath = path.join(process.cwd(), "dist");

  console.log(`[serve-static] Setup starting...`);
  console.log(`[serve-static] CWD: ${process.cwd()}`);
  console.log(`[serve-static] Looking for: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    console.error(`[serve-static] ERROR: dist not found at ${distPath}`);
    app.use("*", (_req, res) => {
      res.status(500).send(`Build directory not found at: ${distPath}`);
    });
    return;
  }

  const indexPath = path.join(distPath, "index.html");
  const hasIndex = fs.existsSync(indexPath);
  
  console.log(`[serve-static] index.html exists: ${hasIndex}`);
  console.log(`[serve-static] dist contents: ${fs.readdirSync(distPath).join(", ")}`);

  if (!hasIndex) {
    console.error(`[serve-static] ERROR: index.html not found`);
    app.use("*", (_req, res) => {
      res.status(500).send(`index.html not found in dist`);
    });
    return;
  }

  // Serve static assets with high priority
  app.use("/assets", express.static(path.join(distPath, "assets"), { 
    maxAge: "1d",
    immutable: true,
  }));

  // Serve public files
  app.use(express.static(distPath, { 
    maxAge: "1h",
    setHeaders: (res, path) => {
      if (path.endsWith(".html")) {
        res.set("Cache-Control", "no-cache");
      }
    },
  }));

  // SPA fallback - serve index.html for all other routes
  app.use("*", (req, res) => {
    console.log(`[serve-static] SPA fallback for ${req.method} ${req.path}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[serve-static] Error sending index.html:`, err);
        res.status(500).send("Error loading application");
      }
    });
  });

  console.log(`[serve-static] Setup complete - ready to serve`);
}

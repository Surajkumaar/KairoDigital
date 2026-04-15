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
  // On Vercel, working directory is the project root
  const distPath = path.join(process.cwd(), "dist");

  console.log(`[serve-static] Looking for build at: ${distPath}`);
  console.log(`[serve-static] Current working directory: ${process.cwd()}`);

  if (!fs.existsSync(distPath)) {
    const errorMsg = `Build directory not found at ${distPath}`;
    console.error(`[serve-static] ERROR: ${errorMsg}`);
    // Don't throw - instead serve a 404 page for now
    app.use("*", (_req, res) => {
      res.status(500).send(`<pre>${errorMsg}\n\nContents of ${process.cwd()}:\n${fs.readdirSync(process.cwd()).join('\n')}</pre>`);
    });
    return;
  }

  // Check for index.html
  const indexPath = path.join(distPath, "index.html");
  const hasIndex = fs.existsSync(indexPath);
  
  console.log(`[serve-static] index.html exists: ${hasIndex}`);
  console.log(`[serve-static] Contents of dist: ${fs.readdirSync(distPath).join(", ")}`);

  // Serve static assets (CSS, JS, images, etc)
  // First priority: explicit asset serving
  app.use("/assets", express.static(path.join(distPath, "assets")));
  
  // Serve all other static files
  app.use(express.static(distPath, {
    maxAge: "1d",
    etag: false,
  }));

  // SPA fallback - serve index.html for all other routes
  app.use("*", (req, res) => {
    if (!hasIndex) {
      return res.status(404).send("index.html not found in build");
    }
    
    console.log(`[serve-static] Serving SPA fallback for: ${req.path}`);
    res.sendFile(indexPath);
  });
}

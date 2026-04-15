import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

// Only import vite in development mode - lazy load to avoid bundling issues
async function getViteServer() {
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteConfig = await import("../vite.config.js" as any);
  return { createViteServer, createLogger, viteConfig: viteConfig.default };
}

const viteLogger = (() => {
  let logger: any = null;
  return {
    error: (msg: string) => console.error("[vite]", msg),
    warn: (msg: string) => console.warn("[vite]", msg),
    info: (msg: string) => console.info("[vite]", msg),
  };
})();

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
  try {
    const { createViteServer, createLogger, viteConfig } = await getViteServer();
    const viteLoggerInstance = createLogger();

    const serverOptions = {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    };

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLoggerInstance,
        error: (msg, options) => {
          viteLoggerInstance.error(msg, options);
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
          import.meta.url.slice(7, -12),
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
  } catch (error) {
    console.error("[setupVite] Failed to initialize Vite:", error);
    throw error;
  }
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

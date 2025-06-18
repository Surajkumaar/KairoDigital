import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import environment check to debug environment variables
import { checkEnv } from "./lib/env-check";

// Check environment variables on startup
checkEnv();

createRoot(document.getElementById("root")!).render(<App />);

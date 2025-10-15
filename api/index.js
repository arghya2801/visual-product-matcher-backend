import { createApp } from "../src/app.js";
import serverless from "serverless-http";

// Create the Express app
const app = createApp();

// Export a serverless handler for Vercel
export default serverless(app);

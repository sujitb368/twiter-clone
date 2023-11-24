// Import required packages
import express from "express"; // Express framework for building web applications
import cors from "cors"; // Cross-Origin Resource Sharing middleware for handling HTTP requests across different domains

// Create an instance of the Express application
const app = express();

// Enable CORS with specified origin and credentials configuration
app.use(cors());

// Parse incoming JSON requests with a limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Import authentication routes module
import authRoutes from "./routes/auth.route.js";

// Import user routes module
import userRoutes from "./routes/user.route.js";

// Import user routes module
import tweetRoutes from "./routes/tweet.route.js";

// Declare routes for the application under the "/api/v1/*" path

//auth routes
app.use("/api/v1/auth", authRoutes);

//user routes
app.use("/api/v1/user", userRoutes);

//tweet routes
app.use("/api/v1/tweet", tweetRoutes);

// Export the configured Express application
export { app };

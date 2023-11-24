// Import necessary modules and packages
import dotenv from "dotenv"; // Package for handling environment variables
import connectDB from "./db/dbConfig.js"; // Custom module for connecting to MongoDB
import { app } from './app.js'; // Custom Express application module

// Load environment variables from the .env file
dotenv.config({
    path: './.env'
});

// Connect to the MongoDB database
connectDB()
    .then(() => {
        // Start the Express server and listen on the specified port or default to 8000
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        // Handle MongoDB connection errors
        console.log("MONGO db connection failed !!! ", err);
    });

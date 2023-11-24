// Import the Mongoose library for MongoDB connection
import mongoose from "mongoose";

// Async function to connect to MongoDB using the provided URI
const connectDB = async () => {
  try {
    // Attempt to establish a connection to the MongoDB database
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );

    // Log a success message with the connected host information
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    // Log an error message if the MongoDB connection fails and exit the process with an error code
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
export default connectDB;

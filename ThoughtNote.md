## Introduction

This project aims to create a backend application for twitter clone using the MERN stack, focusing on Node.js, Express.js, MongoDB, and related libraries for handling authentication, user management, and tweets.

## Installation:

## Project Structure:

- /project
  - /frontend
    - 123
  - /backend
    - /src
      - /controllers
        - authController.js
        - userController.js
        - tweetController.js
      - /models
        - User.js
        - Tweet.js
      - /routes
        - authRoutes.js
        - userRoutes.js
        - tweetRoutes.js
      - server.js

## Code Explanation

### 1. Setting Up the Project

- Initialized a Node.js project using `npm init -y`.
- Installed necessary dependencies with `npm install express mongoose bcrypt multer`.

### 2. Creating the Server

# 2.1 server.js :

- Environment Setup:
  The code uses the dotenv package to load environment variables from a .env file, facilitating configuration.
- Database Connection:
  It establishes a connection to a MongoDB database using a custom module (dbConfig.js) named connectDB.
- Server Initialization:
  The Express server is started and listens on the port specified in the environment variables (process.env.PORT) or defaults to port 8000. Any successful or failed MongoDB connection is logged accordingly.

# 2.2 app.js :

- Express Application Setup:
  The code initializes an Express application, a popular Node.js web application framework for building RESTful APIs and web services.
- CORS Configuration:
  Cross-Origin Resource Sharing (CORS) is enabled using the cors middleware.
  It allows requests from a specified origin (process.env.CORS_ORIGIN)
- Route Declaration:
  The authentication routes are imported from the "auth.route.js" file and declared under the "/api/v1/user" path.

### 4. Creating Models

- User model -> user.model.js
- Tweet model -> tweet.model.js

### 5. Creating Controllers

### 6. db/

# 6.1 dbConfig.js:

- Mongoose Connection:
  The code uses the Mongoose library to connect to a MongoDB database specified by the URI provided in the process.env.MONGODB_URI environment variable.
- Connection Success Logging:
  If the connection is successful, a log message is printed to the console, indicating that MongoDB is connected and displaying the host information.
- Error Handling:
  In case of connection failure, an error message is logged, and the process is exited with an error code (1) using process.exit(1). This ensures that the application does not continue to run with a failed database connection.

### 7. helper/

# 7.1 authHelper.js :

- Password Hashing:
  hashPassword that utilizes the bcrypt library to hash a given password with salt round of 10.
- Removing Password from User Object:
  removePassword designed to exclude the password field from a user object.
- Password Comparison:
  comparePassword is implemented to compare a plain-text password with its hashed version.
- Token generation:
  generateToken that uses the jwt library to generate a unique token based on the user's email and a secret key.

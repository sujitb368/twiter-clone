## Introduction

This project aims to create a backend application for twitter clone using the MERN stack, focusing on Node.js, Express.js, MongoDB, and related libraries for handling authentication, user management, and tweets.

## Installation:

## Project Structure:

- /project
  - ## /frontend
  - /backend
    - /src
      - /controllers
        - authController.js
        - userController.js
        - tweetController.js
      - db
        - dbConfig.js
      - helper
        - authHelper.js
      - images
      - middlewares
        - auth.middleware.js
        - file.middleware.js
      - /models
        - User.js
        - Tweet.js
      - /routes
        - authRoutes.js
        - userRoutes.js
        - tweetRoutes.js
      - app.js
      - config.js
      - server.js

## Code Explanation

# \***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***backend\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***

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
  The code initializes an Express application, for building RESTful APIs and web services.
- CORS Configuration:
  Cross-Origin Resource Sharing (CORS) is enabled using the cors middleware.
  It allows requests from a specified origin (process.env.CORS_ORIGIN)
- express.json() middleware is used to parse incoming JSON requests with a specified limit of 16kb
- Route Declaration:
  Routes for the application under the "/api/v1/\*" path.
  Each type of route (auth, user, tweet) is associated with a specific sub-path
  (/api/v1/auth, /api/v1/user, /api/v1/tweet).

### 4. Creating Models

- User model -> user.model.js
- Tweet model -> tweet.model.js

### 5. Creating Controllers

### 6. db/

# 3 config.js :

- URL and Path Modules:
  The code imports functions from the url and path modules, which are built-in Node.js modules. These modules provide utilities for working with URLs and file paths, respectively.

- Current Module's Directory:
  Using fileURLToPath and dirname, the code obtains the current module's file path (**filename) and then derives the corresponding directory path (**dirname).

# 4 dbConfig.js:

- Mongoose Connection:
  The code uses the Mongoose library to connect to a MongoDB database specified by the URI provided in the process.env.MONGODB_URI environment variable.
- Connection Success Logging:
  If the connection is successful, a log message is printed to the console, indicating that MongoDB is connected and displaying the host information.
- Error Handling:
  In case of connection failure, an error message is logged, and the process is exited with an error code (1) using process.exit(1). This ensures that the application does not continue to run with a failed database connection.

### 7. helper/

# 5 authHelper.js :

- Password Hashing:
  hashPassword that utilizes the bcrypt library to hash a given password with salt round of 10.
- Removing Password from User Object:
  removePassword designed to exclude the password field from a user object.
- Password Comparison:
  comparePassword is implemented to compare a plain-text password with its hashed version.
- Token generation:
  generateToken that uses the jwt library to generate a unique token based on the user's email and a secret key.

# 6 images/

- To store files

# 7 auth.middleware.js :

- Import Necessary Libraries and Modules:
  Import jwt and the user.model.
- isLogin Middleware:
  Check if a user is logged in by verifying the authorization token, extracting user details, and adding them to the request object.

# 8 file.middleware.js:

- multer configuration
- file download middleware

# 9.1 tweet.model.js:

- schema definition for tweet

# 9.2 user.model.js:

- schema definition for user

# 10.1 auth.route.js:

- routes for auth
- `/register`
- `/login`

# 10.2 user.route.js:

- routes for user operation
- `/:id` get single user
- `/:id/tweets` get user's tweets (`id = userId`)
- `/follow/:userToFollowId` to follow a user
- `/unfollow/:userToUnFollowId` to unfollow a user
- `/edit` to edit user details
- `/:_id/uploadProfilePic` to upload profile picture
- `/get-file/:filename` to download file

# 10.3 tweet.routes:

- POST(`/`) create tweet
- GET(`/`) get all tweet
- GET(`/_id`) get single tweet
- POST(`/:_id/like`) to like a tweet
- POST(`/:_id/dislike`) to dislike a tweet
- POST(`/:_id/reply`) to reply a tweet
- POST(`/:_id/retweet`) to retweet a tweet
- DELETE(`/:_id`) to delete a tweet
- POST(`/:_id/image`) to upload image for tweet
- GET(`/get-file/:filename`) to download file

# 11.1 auth.controller.js:

- Dependencies:
  Importing necessary dependencies, including the User model and authentication helper functions.

- Function:

  - Register:
    Handling user sign-up with data validation, checking for existing users, password hashing, saving to the database, and returning appropriate responses.

  - Login:
    Managing user login with email and password validation, checking for user existence, comparing passwords, generating tokens, and returning responses accordingly.

- Error Handling:
  Implementing try-catch blocks to handle potential errors and providing informative error responses.

# 11.2 tweet.controller.js:

- Model Import:
  The code imports the `Tweet` model

- Function:

  - `createTweet` function handles the creation of a new tweet.
  - `likeTweet` function allows a user to like a tweet. It checks if the user has already liked the tweet, adds the user's ID to the tweet's likes array, and saves the updated tweet.
  - `dislikeTweet` function enables a user to dislike a previously liked tweet. It ensures the tweet exists, checks if the user has liked it, removes the user's ID from the likes array, and saves the updated tweet. -`replyToTweet` function handles the reply to a tweet. It checks for the existence of the parent tweet, creates a new tweet for the reply, saves it, and updates the parent tweet with the reply's ID.
  - `getSingleTweet` function retrieves details for a single tweet by its ID, populating user and reply details. It returns a success response with the tweet details.
  - `getAllTweet` function fetches all tweets, sorting them in descending order of creation and populating user and reply details. It returns a success response with an array of tweet details.
  - `deleteTweet` function allows a user to delete their own tweet. It verifies ownership, deletes associated replies, and removes the tweet.
  - `retweetTweet` function enables a user to retweet a tweet. It checks if the user has already retweeted the tweet, adds the user's ID to the retweets array, and saves the updated tweet.
  - The `uploadTweetImage` function handles the upload of an image for a tweet. It checks for the presence of a file, updates the tweet's image field with the filename, and saves the tweet.

# 11.3 auth.controller.js:

Certainly! Here are 10 summary points for the provided code:

- Model Import:
  The code imports the `User` and `Tweet` models

- Function:
  - `getSingleUser`:
    function retrieves details for a single user by their ID, excluding the password field and populating followers and following arrays with selected fields. It returns a success response with the user details.
  - `followUser`:
    function allows a user to follow another user. It checks for self-following, verifies user existence, and updates the following and followers arrays for both users.
  - `unfollowUser`:
    function enables a user to unfollow another user. It checks for self-unfollowing, verifies user existence, and updates the following and followers arrays accordingly.
  - `editUserDetails`:
    function allows a user to edit their name, date of birth, and location. It updates the user details and returns a success response with the edited user.
  - `getUserTweets`:
    function retrieves all tweets tweeted by a specific user, populating details for the tweet's author and re-tweeter. It returns a success response with an array of user tweets.
  - `uploadProfilePicture`:
    function handles the upload of a profile picture for a user. It checks for the presence of a file, updates the user's profile picture field, and returns a success response.
  - `downloadFile`:
    function facilitates the download of a file, specified by the filename parameter. It constructs the file path and triggers the file download, handling potential errors.

# \***\*\*\*\*\*\*\***\*\*\***\*\*\*\*\*\*\*** frontend \***\*\*\*\*\*\*\***\*\*\***\*\*\*\*\*\*\***

1. **App.js**

   - This is the main application component in a React application.
   - It includes routing logic using `react-router-dom` to navigate between different pages.
   - Manages authentication state and conditionally renders routes based on the user's authentication status.
   - Sets up Axios with default base URL and authorization headers for API calls.
   - Renders the `ToastContainer` for displaying notifications.

2. **Constant.js**

   - This file typically contains constants used throughout the application.
   - It helps in managing magic strings or numbers and reusing them, ensuring consistency.
   - Constants could include API endpoints, configuration settings, or reusable static values.
   - Using a separate file for constants makes the codebase easier to maintain and update.
   - It's not clear what specific constants are defined without viewing the file's contents.

3. **index.js**

   - Entry point for the React application.
   - Responsible for rendering the main `App` component.
   - Includes setup for React and possibly other libraries or frameworks used in conjunction.
   - Often includes global styles or scripts that apply to the entire application.
   - It is the starting point that kicks off the React rendering process.

4. **util.js**

   - A utility file generally contains reusable functions or components that can be used across different parts of the application.
   - It helps in reducing code duplication and maintaining a cleaner codebase.
   - Functions in this file could range from format helpers to complex logic that is needed in multiple components.
   - The specific utilities provided in this file are unknown without viewing its contents.
   - This file promotes a modular and maintainable code structure.

5. **Login.js**

   - This file likely contains the component for user login.
   - It could include a form for entering login credentials and logic to authenticate users.
   - This component may interact with an authentication service or API.
   - It might handle user input validation and error messaging related to login.
   - The component is probably used in a route defined in `App.js`.

6. **Signup.js**

   - Contains the component for user registration or signup.
   - Similar to `Login.js`, it probably includes a form for new users to enter their details.
   - Handles the logic for registering new users, possibly interacting with an API.
   - Might include input validation and error handling specific to user registration.
   - Used as part of the public routes in the application for unauthenticated users.

7. **Loader.js**

   - A component that renders a loading indicator, such as a spinner.
   - Useful for displaying feedback during asynchronous operations like data fetching.
   - Typically used across various components where loading states need to be represented.
   - Enhances user experience by providing visual cues about ongoing processes.
   - The code includes a button with a spinner indicating the loading state.

8. **Sidebar.js**

   - Responsible for rendering the sidebar navigation in the application.
   - Includes links for navigation like Home, Profile, and Logout, using `react-router-dom`.
   - Manages user logout functionality, clearing user data from local storage and updating auth state.
   - Conditionally renders navigation links based on user authentication status.
   - Incorporates user-specific information like profile picture and username.

9. **TweetCard.js**

   - Likely a component that represents a single tweet in the application.
   - It may include the tweet's content, author information, and interactive elements like buttons for liking or retweeting.
   - Could be used in list views to display multiple tweets in a feed or search results.
   - May handle events like clicking on a tweet to view more details or interact with it.
   - The detailed implementation and features would depend on the specifics of your application's functionality.

10. **authContext.js**

    - This file is expected to define the React Context for authentication.
    - It allows for sharing the authentication state (like user info and token) across the entire app.
    - Typically used to manage global authentication state, such as whether a user is logged in.
    - It simplifies accessing and updating authentication-related information from any component.
    - This context is crucial for protected routes and user-specific features in the app.

11. **authContextProvider.js**

    - Provides the `AuthContext` to the application.
    - Wraps the application or specific components with the context provider.
    - Manages the state and logic related to authentication, like login, logout, and state initialization.
    - Offers a way to centralize authentication logic, making it accessible to all child components.
    - It's essential for handling user sessions and conditional rendering based on authentication status.

12. **Home.js**

    - Serves as the main landing page or dashboard for the application.
    - Likely includes a layout or components that are displayed when a user navigates to the home route.
    - Could aggregate various features or components like a feed of tweets, user suggestions, or other interactive elements.
    - This component may also be responsible for fetching and displaying data relevant to the home page.
    - It's a key part of the user experience, offering a central place for users to interact with the app's main features.

13. **Profile.js**

    - Manages the user profile view in the application.
    - Displays user-specific information, such as profile details, posts, or other relevant data.
    - Might include functionality to edit or update user profile information.
    - Could interact with backend services to fetch and update user data.
    - It's an essential component for personalization and user engagement in social applications.

14. **TweetDetails.js**
    - Responsible for displaying detailed information about a specific tweet.
    - Could include the tweet's full content, comments, likes, retweets, and other interactive elements.
    - May offer functionality to add comments, like, or retweet the tweet.
    - It's likely used in a route that's accessed when a user selects a tweet to view more details.
    - Enhances the user experience by providing a focused view on individual tweets.

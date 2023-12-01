import { createContext, useContext } from "react";

// Define initial state for the authState
const initialState = {
  user: [],
  token: null,
};

//create context object
const AuthContext = createContext();

//define reducer function to handle Auth actions
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "AUTH_FAILED":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

// Custom hook to access the auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthContext, authReducer, initialState, useAuth };

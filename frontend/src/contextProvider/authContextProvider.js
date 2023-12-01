// Import necessary dependencies and components
import { useReducer } from "react";
import { AuthContext, authReducer, initialState } from "../context/authContext";

// Create the AuthProvider component
const AuthContextProvider = ({ children }) => {
  // Initialize the cart state and dispatch using the useReducer hook
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Provide the cart state and dispatch function to its children components through the CartContext.Provider
  return (
    <AuthContext.Provider value={{ authState: state, authDispatch: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the AuthContextProvider for use in the application
export { AuthContextProvider };

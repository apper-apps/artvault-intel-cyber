import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component that wraps Redux user state
export function AuthProvider({ children }) {
  const userState = useSelector((state) => state.user);
  
  const authValue = {
    user: userState?.user || null,
    isAuthenticated: userState?.isAuthenticated || false,
    isLoading: false // Can be extended based on app needs
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
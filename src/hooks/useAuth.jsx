import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('🔄 Initializing auth from localStorage...');
      console.log('   Token exists:', !!storedToken);
      console.log('   User exists:', !!storedUser);

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log('✅ Auth state restored from localStorage');
          
          // Verify token with backend (optional)
          try {
            await authAPI.getProfile();
            console.log('✅ Token verified with backend');
          } catch (error) {
            console.log('⚠️ Token verification failed, but keeping local state');
          }
        } catch (error) {
          console.error('❌ Error restoring auth state:', error);
          logout();
        }
      } else {
        console.log('❌ No auth data in localStorage');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔄 Login attempt with credentials:', credentials);
      const response = await authAPI.login(credentials);
      const { token: newToken, user: userData } = response.data;

      console.log('✅ Login successful, updating state...');
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // Persist to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('✅ Auth state updated and persisted');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Logging out...');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Logout completed');
    }
  };

  // This function should update the state from localStorage
  const refreshAuthState = () => {
    console.log('🔄 Refreshing auth state from localStorage...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      console.log('✅ Auth state refreshed');
      return true;
    }
    console.log('❌ No auth data to refresh');
    return false;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshAuthState,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'moderator'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
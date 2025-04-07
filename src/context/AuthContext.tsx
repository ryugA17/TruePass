import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, provider } from '../components/layout/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userData = { email: firebaseUser.email || '' };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate custom login — optional if only using Firebase
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    setIsAuthenticated(true);
    setUser({ email });
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({ email }));
  };

  const googleLogin = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userData = { email: firebaseUser.email || '' };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const logout = () => {
    signOut(auth);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

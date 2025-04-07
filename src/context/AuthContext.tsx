import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../components/layout/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';

export type UserType = 'user' | 'host';

interface AuthUser {
  email: string;
  displayName?: string;
  userType: UserType;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userType: UserType, displayName?: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
  updateUserType: (userType: UserType) => void;
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
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Get user type from localStorage if available
        let userType: UserType = 'user';
        const storedUserType = localStorage.getItem(`userType_${firebaseUser.uid}`);
        if (storedUserType === 'host' || storedUserType === 'user') {
          userType = storedUserType;
        }

        const userData: AuthUser = { 
          email: firebaseUser.email || '', 
          displayName: firebaseUser.displayName || undefined,
          userType
        };
        
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user type from localStorage if available
      let userType: UserType = 'user';
      const storedUserType = localStorage.getItem(`userType_${firebaseUser.uid}`);
      if (storedUserType === 'host' || storedUserType === 'user') {
        userType = storedUserType as UserType;
      }

      const userData: AuthUser = { 
        email: firebaseUser.email || '', 
        displayName: firebaseUser.displayName || undefined,
        userType
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const signup = async (email: string, password: string, userType: UserType, displayName?: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile if display name is provided
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }
      
      // Store user type in localStorage
      localStorage.setItem(`userType_${firebaseUser.uid}`, userType);
      
      const userData: AuthUser = { 
        email: firebaseUser.email || '', 
        displayName: displayName || undefined,
        userType
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const googleLogin = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Default to 'user' type for Google login
      // Check if user already has a stored type
      let userType: UserType = 'user';
      const storedUserType = localStorage.getItem(`userType_${firebaseUser.uid}`);
      if (storedUserType === 'host' || storedUserType === 'user') {
        userType = storedUserType as UserType;
      } else {
        // Store default user type
        localStorage.setItem(`userType_${firebaseUser.uid}`, userType);
      }
      
      const userData: AuthUser = { 
        email: firebaseUser.email || '', 
        displayName: firebaseUser.displayName || undefined,
        userType
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const updateUserType = (userType: UserType) => {
    if (user && auth.currentUser) {
      // Store user type in localStorage
      localStorage.setItem(`userType_${auth.currentUser.uid}`, userType);
      
      const updatedUser = { ...user, userType };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup,
      logout, 
      googleLogin,
      updateUserType
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

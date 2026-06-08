import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem('leegality_current_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const savedUsersStr = localStorage.getItem('leegality_users');
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = { email: foundUser.email, name: foundUser.name };
      setUser(userSession);
      localStorage.setItem('leegality_current_user', JSON.stringify(userSession));
      toast.success('Welcome back!', { description: `Signed in as ${email}` });
      return true;
    } else {
      toast.error('Invalid credentials', { description: 'Please check your email and password.' });
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const savedUsersStr = localStorage.getItem('leegality_users');
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    const existingUser = savedUsers.find((u: any) => u.email === email);
    if (existingUser) {
      toast.error('Account already exists', { description: 'Please sign in instead.' });
      return false;
    }

    const newUser = { email, password, name };
    savedUsers.push(newUser);
    localStorage.setItem('leegality_users', JSON.stringify(savedUsers));
    
    const userSession = { email, name };
    setUser(userSession);
    localStorage.setItem('leegality_current_user', JSON.stringify(userSession));
    
    toast.success('Account created successfully', { description: `Welcome to Leegality, ${name}.` });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('leegality_current_user');
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


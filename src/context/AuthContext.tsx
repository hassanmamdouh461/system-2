import React, { createContext, useContext, useState, ReactNode } from 'react';

const LS_KEY = 'brewmaster_remembered_username';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ── Registered accounts ────────────────────────────────────────────────
  const ACCOUNTS: Array<{ username: string; password: string; name: string; role: 'admin' | 'staff' }> = [
    { username: 'admin', password: '123', name: 'Admin User', role: 'admin' },
  ];

  const login = async (username: string, password: string, rememberMe?: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const match = ACCOUNTS.find(
      a => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
    );
    if (!match) throw new Error('Invalid username or password');
    // ── Persist / clear username based on rememberMe ───────────────────────
    if (rememberMe) {
      localStorage.setItem(LS_KEY, username.trim());
    } else {
      localStorage.removeItem(LS_KEY);
    }
    setUser({ id: '1', name: match.name, role: match.role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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

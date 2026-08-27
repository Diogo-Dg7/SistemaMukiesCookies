import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

function getUserFromToken(token: string): User | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as Record<string, unknown>;
    const name = String(claims[nameClaim] ?? claims.unique_name ?? claims.name ?? 'Cliente');
    const role = claims[roleClaim] === 'Admin' || claims.role === 'Admin' ? 'Admin' : 'User';
    return { id: name, name, role };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('@Mukies:token');
    if (storedToken) {
      const storedUser = getUserFromToken(storedToken);
      if (storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        localStorage.setItem('@Mukies:user', JSON.stringify(storedUser));
      } else {
        localStorage.removeItem('@Mukies:token');
        localStorage.removeItem('@Mukies:user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    const userDetails = getUserFromToken(newToken);
    if (!userDetails) throw new Error('Token de acesso inv\u00e1lido.');
    setToken(newToken);
    setUser(userDetails);
    localStorage.setItem('@Mukies:token', newToken);
    localStorage.setItem('@Mukies:user', JSON.stringify(userDetails));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('@Mukies:token');
    localStorage.removeItem('@Mukies:user');
  };

  return <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), isAdmin: user?.role === 'Admin', login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

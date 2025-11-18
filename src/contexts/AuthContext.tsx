import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  dept?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  accessCodes: string[];
  isAuthenticated: boolean;
  hasPermission: (code: string | string[]) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessCodes, setAccessCodes] = useState<string[]>([]);

  useEffect(() => {
    // 从 localStorage 加载用户信息和权限
    const userInfoStr = localStorage.getItem('user_info');
    const accessCodesStr = localStorage.getItem('access_codes');
    
    if (userInfoStr) {
      try {
        const parsed = JSON.parse(userInfoStr);
        setUser(parsed.data || parsed);
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
    
    if (accessCodesStr) {
      try {
        const parsed = JSON.parse(accessCodesStr);
        setAccessCodes(parsed.data || parsed || []);
      } catch (e) {
        console.error('解析权限代码失败', e);
      }
    }
  }, []);

  const hasPermission = (code: string | string[]): boolean => {
    if (!code) return true;
    const codes = Array.isArray(code) ? code : [code];
    return codes.some(c => accessCodes.includes(c));
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('session_uuid');
    localStorage.removeItem('user_info');
    localStorage.removeItem('access_codes');
    setUser(null);
    setAccessCodes([]);
    window.location.href = '/login';
  };

  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <AuthContext.Provider value={{ user, accessCodes, isAuthenticated, hasPermission, logout }}>
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

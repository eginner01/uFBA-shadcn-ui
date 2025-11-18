import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('[AuthGuard] Checking auth on:', location.pathname);
    console.log('[AuthGuard] Token exists:', !!token);

    if (!token && location.pathname !== '/login') {
      console.log('[AuthGuard] No token, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}

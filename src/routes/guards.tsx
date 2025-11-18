import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface RouteGuardProps {
  children: ReactNode;
  requiresAuth?: boolean;
  permissions?: string[];
}

export default function RouteGuard({
  children,
  requiresAuth = true,
  permissions = [],
}: RouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, hasPermission } = useAuthStore();

  useEffect(() => {
    // 需要认证但未登�?
    if (requiresAuth && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // 已登录但访问登录页，跳转到首�?
    if (!requiresAuth && location.pathname === '/login' && isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // 检查权�?
    if (requiresAuth && permissions.length > 0) {
      const hasAllPermissions = permissions.every((perm) => hasPermission(perm));
      if (!hasAllPermissions) {
        navigate('/403');
        return;
      }
    }
  }, [requiresAuth, isAuthenticated, permissions, location.pathname, navigate, hasPermission]);

  return <>{children}</>;
}

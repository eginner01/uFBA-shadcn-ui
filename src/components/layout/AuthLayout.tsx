import { Outlet } from 'react-router-dom';
import LoginPage from '@/features/auth/LoginPage';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoginPage />
    </div>
  );
}

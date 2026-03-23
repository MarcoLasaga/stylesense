import { Navigate } from 'react-router-dom';
import { isAdmin, isLoggedIn } from '@/lib/store';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

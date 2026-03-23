import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Shirt, Users, Eye, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { path: '/admin', label: 'Overview', icon: BarChart3 },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/clothes', label: 'Clothes', icon: Shirt },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/algorithm', label: 'Algorithm', icon: Eye },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <AdminSidebar />

          {/* Mobile nav */}
          <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-card border-b border-border px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Admin</span>
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
          {mobileOpen && (
            <div className="lg:hidden fixed top-[6.5rem] left-0 right-0 z-40 bg-card border-b border-border p-3 space-y-1">
              {links.map(l => (
                <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                    location.pathname === l.path ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  <l.icon className="h-4 w-4" />{l.label}
                </Link>
              ))}
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground">
                <Home className="h-4 w-4" /> Back to Site
              </Link>
            </div>
          )}

          <main className="flex-1 pt-24 lg:pt-20 pb-16 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}

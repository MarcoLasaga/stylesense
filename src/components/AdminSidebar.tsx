import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Shirt, Users, Settings, Shield, Home, Eye } from 'lucide-react';

const links = [
  { path: '/admin', label: 'Overview', icon: BarChart3 },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/clothes', label: 'Clothing Items', icon: Shirt },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/algorithm', label: 'Algorithm', icon: Eye },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-card border-r border-border pt-16">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          <span className="font-display font-bold text-sm">Admin Panel</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(l => {
          const active = location.pathname === l.path;
          return (
            <Link key={l.path} to={l.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}>
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
          <Home className="h-4 w-4" /> Back to Site
        </Link>
      </div>
    </aside>
  );
}

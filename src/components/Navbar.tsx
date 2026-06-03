import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, X, Shield, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isLoggedIn, isAdmin, logout, saveProfile, getProfile } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { syncLocalProfileFromCloud, isCloudAdmin } from '@/lib/socialStore';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/wardrobe', label: 'Wardrobe' },
  { path: '/upload', label: 'Add' },
  { path: '/outfits', label: 'Generator' },
  { path: '/planner', label: 'Planner' },
  { path: '/feed', label: 'Feed' },
  { path: '/saved', label: 'Saved' },
  { path: '/gaps', label: 'Gaps' },
  { path: '/sustainability', label: 'Eco' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for Supabase auth changes and keep local profile/role in sync
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (session) {
        // Defer DB lookups to next tick to avoid deadlocks
        setTimeout(async () => {
          await syncLocalProfileFromCloud();
          const adm = await isCloudAdmin();
          const p = getProfile();
          if (adm && p.role !== 'admin') saveProfile({ ...p, role: 'admin' });
          setAuthVersion(v => v + 1);
        }, 0);
      } else {
        setAuthVersion(v => v + 1);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loggedIn = isLoggedIn();
  const admin = isAdmin();
  // re-render trigger when authVersion changes
  void authVersion;

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => { /* ignore */ });
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          Style<span className="text-accent">Sense</span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-medium tracking-wide uppercase transition-colors hover:text-accent ${
                location.pathname === item.path ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {loggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="h-8 w-8"><User className="h-4 w-4" /></Button>
              </Link>
              {admin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-[10px] gap-1.5">
                    <Shield className="h-3 w-3" /> Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout} title="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border mt-2 flex gap-2 flex-wrap">
            {loggedIn ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}><Button variant="outline" size="sm">Profile</Button></Link>
                {admin && (
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm" className="gap-1.5"><Shield className="h-3 w-3" /> Admin</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleLogout}>
                  <LogOut className="h-3 w-3" /> Log Out
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" size="sm">Sign In</Button></Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

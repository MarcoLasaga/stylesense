import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Shield, LogOut, Home, Shirt, Compass, CalendarDays, Bell, Search,
  ChevronDown, BarChart3, History, Users as UsersIcon, Bookmark, Settings, HelpCircle, User
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { isLoggedIn, isAdmin, logout, saveProfile, getProfile } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { syncLocalProfileFromCloud, isCloudAdmin } from '@/lib/socialStore';

const primaryNav = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/wardrobe', label: 'Wardrobe', icon: Shirt },
  { path: '/feed', label: 'Discover', icon: Compass },
  { path: '/planner', label: 'Planner', icon: CalendarDays },
];

const moreNav = [
  { path: '/sustainability', label: 'Analytics', icon: BarChart3 },
  { path: '/planner', label: 'Calendar', icon: CalendarDays },
  { path: '/saved', label: 'Outfit History', icon: History },
  { path: '/feed', label: 'Community', icon: UsersIcon },
  { path: '/saved', label: 'Saved Outfits', icon: Bookmark },
  { path: '/gaps', label: 'Wardrobe Gaps', icon: Shirt },
  { path: '/profile', label: 'Settings', icon: Settings },
];

const mobileNav = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/wardrobe', label: 'My Wardrobe', icon: Shirt },
  { path: '/upload', label: 'Add Clothes', icon: Shirt },
  { path: '/outfits', label: 'Outfit Generator', icon: Compass },
  { path: '/planner', label: 'Planner', icon: CalendarDays },
  { path: '/feed', label: 'Community', icon: UsersIcon },
  { path: '/saved', label: 'Saved Outfits', icon: Bookmark },
  { path: '/sustainability', label: 'Analytics', icon: BarChart3 },
  { path: '/gaps', label: 'Wardrobe Gaps', icon: Shirt },
  { path: '/profile', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (session) {
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loggedIn = isLoggedIn();
  const admin = isAdmin();
  const profile = loggedIn ? getProfile() : null;
  void authVersion;

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => { /* ignore */ });
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center gap-4 h-16 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-display text-lg">
            S
          </div>
          <span className="hidden sm:block font-display text-xl tracking-tight">
            Style<span className="text-accent">Sense</span>
          </span>
        </Link>

        {/* Search (desktop center) */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clothes, outfits, styles…"
              className="pl-9 h-10 rounded-full bg-secondary border-transparent focus-visible:bg-card"
            />
          </div>
        </div>

        {/* Right nav (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {primaryNav.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(v => !v)}
              className="px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg overflow-hidden py-1.5">
                {moreNav.map(item => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-secondary border-t border-border"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" /> Help
                </Link>
              </div>
            )}
          </div>

          {loggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              {admin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                    <Shield className="h-4 w-4" /> Admin
                  </Button>
                </Link>
              )}
              <Link to="/profile" aria-label="Profile">
                <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-border hover:ring-accent transition">
                  {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-display">
                    {profile?.avatarInitial || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={handleLogout} title="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="rounded-full">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile actions */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          {loggedIn && (
            <Link to="/profile">
              <Avatar className="h-8 w-8 ring-1 ring-border">
                {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-display">
                  {profile?.avatarInitial || '?'}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <button
            className="p-2 rounded-lg hover:bg-secondary"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9 h-10 rounded-full bg-secondary border-transparent" />
            </div>
          </div>
          <div className="px-2 pb-3 max-h-[70vh] overflow-y-auto">
            {mobileNav.map(item => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            {loggedIn ? (
              <>
                {admin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                  >
                    <Shield className="h-5 w-5 text-accent" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-secondary text-left"
                >
                  <LogOut className="h-5 w-5 text-muted-foreground" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

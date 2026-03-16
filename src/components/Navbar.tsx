import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { isLoggedIn } from '@/lib/store';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/catalog', label: 'Catalog' },
  { path: '/recommendations', label: 'For You' },
  { path: '/outfits', label: 'Outfit Generator' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const loggedIn = isLoggedIn();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          Style<span className="text-accent">Sense</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent ${
                location.pathname === item.path ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon"><User className="h-4 w-4" /></Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-xs">Admin</Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border mt-2">
            {loggedIn ? (
              <div className="flex gap-2">
                <Link to="/profile" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm">Profile</Button>
                </Link>
                <Link to="/admin" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              </div>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

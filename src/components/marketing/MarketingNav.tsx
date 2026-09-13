import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/faq', label: 'FAQ' },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-border/70 bg-background/95 px-3 shadow-sm backdrop-blur-md sm:px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="StyleSense home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-base text-accent-foreground">S</span>
          <span className="font-display text-base sm:text-lg">Style<span className="text-primary">Sense</span></span>
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Main navigation">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `rounded-full px-3 py-2 text-xs font-semibold transition-colors ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" className="text-xs font-semibold text-muted-foreground hover:text-foreground">Sign In</Link>
          <Link to="/#get-the-app"><Button size="sm" className="h-9 rounded-full px-5">Get the App</Button></Link>
        </div>

        <button className="rounded-full p-2 hover:bg-secondary lg:hidden" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-sm rounded-3xl border border-border bg-background p-3 shadow-lg lg:hidden">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-secondary">
              {link.label}
            </NavLink>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
            <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full rounded-full">Sign In</Button></Link>
            <Link to="/#get-the-app" onClick={() => setOpen(false)}><Button className="w-full rounded-full">Get the App</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}

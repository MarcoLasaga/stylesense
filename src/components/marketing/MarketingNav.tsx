import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#about', label: 'About' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <a href="#home" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-display text-lg">
            S
          </span>
          <span className="font-display text-xl">
            Style<span className="text-primary">Sense</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="rounded-full">Sign In</Button>
          </Link>
          <a href="#get-the-app">
            <Button size="sm" className="rounded-full px-5">Get StyleSense</Button>
          </a>
        </div>

        <button
          className="lg:hidden p-2 rounded-xl hover:bg-secondary"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-3">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-xl text-sm font-medium hover:bg-secondary"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3">
            <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full rounded-full">Sign In</Button>
            </Link>
            <a href="#get-the-app" className="flex-1" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full">Get the App</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from 'react-router-dom';

const links = [
  ['Home', '/'], ['Features', '/features'], ['How It Works', '/how-it-works'],
  ['About', '/about'], ['Testimonials', '/testimonials'], ['FAQ', '/faq'],
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-md">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-foreground">S</span>
              <span className="font-display text-xl">Style<span className="text-primary">Sense</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">An image-based wardrobe and outfit recommendation system designed to help you make more of the clothes you already own.</p>
          </div>
          <div>
            <p className="mb-4 text-sm font-bold">Explore</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {links.map(([label, to]) => <li key={to}><Link to={to} className="text-sm text-muted-foreground hover:text-primary">{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-bold">More</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/login" className="hover:text-primary">Sign In</Link></li>
              <li><span>Privacy</span></li>
              <li><span>Terms</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StyleSense. A personalized outfit recommendation research project.</p>
          <p>Built around what you already own.</p>
        </div>
      </div>
    </footer>
  );
}

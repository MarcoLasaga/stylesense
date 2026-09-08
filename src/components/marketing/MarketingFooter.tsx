import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer className="bg-secondary/60 border-t border-border">
      <div className="container mx-auto px-4 md:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-display text-lg">S</span>
              <span className="font-display text-xl">Style<span className="text-primary">Sense</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An image-based wardrobe and outfit recommendation system designed to help you
              make more out of the clothes you already own.
            </p>
          </div>

          {columns.map(col => (
            <div key={col.title}>
              <p className="font-semibold mb-3 text-sm">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
                {col.title === 'Learn' && (
                  <>
                    <li><Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                    <li><a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
                    <li><a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a></li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 StyleSense. An academic research project on personalized outfit recommendation.
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Instagram</span>
            <span className="hover:text-primary cursor-pointer">Facebook</span>
            <span className="hover:text-primary cursor-pointer">TikTok</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

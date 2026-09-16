import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from './MarketingNav';
import MarketingFooter from './MarketingFooter';
import { Button } from '@/components/ui/button';

export function PublicPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <header className="relative overflow-hidden border-b border-border bg-fashion-cream-deep px-4 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
          <div className="container mx-auto max-w-5xl px-0 md:px-6">
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h1 className="max-w-4xl font-display text-4xl leading-[1.05] sm:text-5xl md:text-7xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
          </div>
        </header>
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}

export function AppCta() {
  return (
    <section className="px-4 py-20 text-center md:py-28">
      <div className="container mx-auto max-w-3xl border-y border-border py-14">
        <h2 className="font-display text-3xl sm:text-5xl">MAKE MORE OUTFITS FROM WHAT YOU ALREADY OWN.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Discover your wardrobe differently with StyleSense.</p>
        <Button asChild size="lg" className="mt-8 rounded-full px-8"><Link to="/download">Get the App</Link></Button>
      </div>
    </section>
  );
}

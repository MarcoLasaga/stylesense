import type { ReactNode } from 'react';
import MarketingNav from './MarketingNav';
import MarketingFooter from './MarketingFooter';

export function PublicPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <header className="border-b border-border bg-secondary/45 px-4 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="container mx-auto max-w-5xl px-0 md:px-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
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
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-display text-3xl sm:text-5xl">MAKE MORE OUTFITS FROM WHAT YOU ALREADY OWN.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Discover your wardrobe differently with StyleSense.</p>
        <a href="/#get-the-app" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-8 font-bold text-accent-foreground hover:bg-primary hover:text-primary-foreground">Get the App</a>
      </div>
    </section>
  );
}

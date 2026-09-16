import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MobileAppPreview from '@/components/marketing/MobileAppPreview';
import mobileEditorial from '@/assets/stylesense-mobile-editorial.jpg';

const experience = [
  ['01', 'Add your clothes', 'Capture what you own and keep every piece easy to find.'],
  ['02', 'Discover combinations', 'See complete outfits built from your real wardrobe.'],
  ['03', 'Share what you like', 'Save, skip, and rate ideas so suggestions feel more personal.'],
  ['04', 'Plan what you’ll wear', 'Prepare for the day or map out the week ahead.'],
  ['05', 'Wear it and respond', 'Your wear history and feedback shape what comes next.'],
];

const capabilities = [
  ['Your Digital Wardrobe', 'Your clothes, organized around the way you actually dress.'],
  ['Personalized Recommendations', 'Outfit ideas shaped by taste, context, feedback, and fit.'],
  ['Outfit Planner', 'Make calmer morning decisions with a plan already in place.'],
  ['Weather-Aware Suggestions', 'Dress for temperature, rain, humidity, and the day ahead.'],
  ['No New Clothes Mode', 'Rediscover combinations before deciding you need something new.'],
  ['Community Inspiration', 'See how other people make personal wardrobes feel fresh.'],
];

export default function Download() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-28 md:pb-28 md:pt-36">
          <div className="absolute inset-x-0 top-0 h-[72%] bg-fashion-cream-deep" aria-hidden="true" />
          <div className="relative container mx-auto grid max-w-6xl gap-14 md:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow">StyleSense for mobile</p>
              <h1 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">Your wardrobe goes with you.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Take StyleSense wherever you go and discover what to wear from the clothes you already own.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-8"><a href="#platforms">Download StyleSense</a></Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8"><Link to="/features">Explore the App</Link></Button>
              </div>
              <p className="mt-5 max-w-md text-sm text-muted-foreground">iOS and Android store links will be connected when the mobile release is available.</p>
            </div>
            <div className="relative min-h-[570px]">
              <img src={mobileEditorial} alt="A woman planning outfits on her phone beside her wardrobe" className="absolute inset-y-0 right-0 h-full w-[78%] rounded-editorial object-cover" width={1600} height={1072} fetchPriority="high" />
              <div className="absolute bottom-8 left-0"><MobileAppPreview compact /></div>
            </div>
          </div>
        </section>

        <section id="platforms" className="border-y border-border bg-secondary/10 py-16 scroll-mt-20">
          <div className="container mx-auto flex max-w-5xl flex-col gap-8 px-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="eyebrow">Choose your platform</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">Made for everyday movement.</h2></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" size="lg" className="min-w-52 rounded-full" disabled>Download on the App Store · Soon</Button>
              <Button variant="outline" size="lg" className="min-w-52 rounded-full" disabled>Get it on Google Play · Soon</Button>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-32 lg:self-start"><p className="eyebrow">In your pocket</p><h2 className="section-title mt-4">Everything you need, right in your pocket.</h2></div>
              <div className="border-y border-border">
                {capabilities.map(([title, copy], index) => <article key={title} className="grid gap-3 border-b border-border py-7 last:border-b-0 sm:grid-cols-[64px_1fr_1.2fr]"><span className="font-display text-2xl text-secondary">{String(index + 1).padStart(2, '0')}</span><h3 className="font-display text-xl">{title}</h3><p className="leading-relaxed text-muted-foreground">{copy}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-tint py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-12 max-w-2xl"><p className="eyebrow">The mobile rhythm</p><h2 className="section-title mt-4">A wardrobe that becomes more personal with you.</h2></div>
            <div className="border-y border-border">{experience.map(([number, title, copy]) => <article key={number} className="grid gap-3 border-b border-border py-7 last:border-b-0 sm:grid-cols-[84px_1fr_1.2fr]"><span className="font-display text-3xl text-secondary">{number}</span><h3 className="font-display text-xl sm:text-2xl">{title}</h3><p className="leading-relaxed text-muted-foreground">{copy}</p></article>)}</div>
          </div>
        </section>

        <section className="editorial-section px-4 text-center">
          <div className="mx-auto max-w-3xl"><p className="eyebrow">A smarter daily choice</p><h2 className="section-title mt-4">Ready to rethink your wardrobe?</h2><p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">Download StyleSense and start creating more outfits from what you already own.</p><Button asChild size="lg" className="mt-8 rounded-full px-9"><a href="#platforms">Get the App</a></Button></div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
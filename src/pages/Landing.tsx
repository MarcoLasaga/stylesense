import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import heroImage from '@/assets/stylesense-hero.jpg';
import wardrobeImage from '@/assets/wardrobe-editorial.jpg';
import communityImage from '@/assets/community-editorial.jpg';
import { faqGroups, testimonials } from '@/data/marketingContent';

const steps = [
  ['01', 'Add your clothes', 'Upload or capture the clothing you already own.'],
  ['02', 'Build your wardrobe', 'StyleSense identifies useful details and keeps everything organized.'],
  ['03', 'Get personal recommendations', 'Your taste, wardrobe, weather, occasion, and feedback shape every suggestion.'],
  ['04', 'Plan what to wear', 'Save outfits, plan the week, and keep discovering combinations.'],
];

const intelligence = ['Clothing attributes', 'Personal style', 'Previous interactions', 'Outfit ratings', 'Wear frequency', 'Occasion', 'Weather', 'Location', 'Fashion trends', 'Fit and size'];

function PhonePreview() {
  return (
    <div className="mx-auto w-[250px] overflow-hidden rounded-[2.75rem] border-[9px] border-foreground bg-background shadow-2xl sm:w-[290px]">
      <div className="h-7 bg-foreground" />
      <div className="p-4">
        <p className="text-xs font-bold text-primary">Good morning, Mika</p>
        <h3 className="mt-1 font-display text-xl">Your outfit for today</h3>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="aspect-[3/4] rounded-2xl bg-accent/60" />
          <div className="aspect-[3/4] rounded-2xl bg-primary/30" />
          <div className="aspect-[3/4] rounded-2xl bg-fashion-rose/45" />
          <div className="aspect-[3/4] rounded-2xl bg-secondary" />
        </div>
        <div className="mt-3 rounded-2xl bg-secondary px-3 py-2">
          <p className="text-[11px] text-muted-foreground">Warm · Casual · No recent repeats</p>
          <p className="text-xs font-bold">A strong match for your day</p>
        </div>
        <div className="mt-3 rounded-full bg-accent py-2 text-center text-xs font-bold text-accent-foreground">Save this outfit</div>
      </div>
    </div>
  );
}

export default function Landing() {
  const homepageFaqs = faqGroups.flatMap(group => group.items).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <section className="relative min-h-[92svh] overflow-hidden">
          <img src={heroImage} alt="A woman choosing between outfits beside her personal wardrobe" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" width={1920} height={1280} fetchPriority="high" />
          <div className="absolute inset-0 bg-foreground/10" />
          <div className="relative container mx-auto flex min-h-[92svh] items-end px-4 pb-14 pt-28 md:items-center md:px-6 md:pb-10">
            <div className="max-w-2xl rounded-[2rem] bg-background/95 p-7 shadow-sm sm:p-10 md:bg-transparent md:p-0 md:shadow-none">
              <p className="mb-4 text-sm font-bold text-primary md:text-foreground">Your wardrobe, reimagined.</p>
              <h1 className="font-display text-4xl leading-[1.02] sm:text-5xl md:text-7xl">Style starts with what you already own.</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg md:text-foreground/80">StyleSense turns the clothes in your wardrobe into personalized outfit recommendations made for your style, schedule, and everyday life.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#get-the-app"><Button size="lg" className="h-12 w-full rounded-full px-8 sm:w-auto">Get the App</Button></a>
                <Link to="/how-it-works"><Button size="lg" variant="outline" className="h-12 w-full rounded-full bg-background/90 px-8 sm:w-auto">Explore How It Works</Button></Link>
              </div>
            </div>
          </div>
          <a href="#introduction" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] text-foreground md:block">Scroll to discover ↓</a>
        </section>

        <section id="introduction" className="container mx-auto grid gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">A better first choice</p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">MORE OUTFITS. LESS SHOPPING.</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">The answer to “what should I wear?” may already be hanging in your closet. StyleSense helps uncover overlooked combinations, reduce repetition, and make everyday dressing feel easier.</p>
            <Link to="/about" className="mt-7 inline-block font-bold text-primary underline decoration-accent decoration-4 underline-offset-8">Why we built StyleSense</Link>
          </div>
          <img src={wardrobeImage} alt="Several outfits arranged from an existing personal wardrobe" className="aspect-[3/2] w-full rounded-3xl object-cover" width={1536} height={1024} loading="lazy" />
        </section>

        <section className="border-y border-border bg-secondary/45 py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">How StyleSense works</p>
              <h2 className="font-display text-4xl sm:text-5xl">FROM CLOSET TO OUTFIT, WITHOUT THE GUESSWORK.</h2>
            </div>
            <div className="border-y border-border">
              {steps.map(([number, title, copy]) => (
                <div key={number} className="grid gap-2 border-b border-border py-7 last:border-b-0 sm:grid-cols-[90px_1fr_1fr] sm:items-baseline sm:gap-8">
                  <span className="font-display text-3xl text-accent">{number}</span>
                  <h3 className="font-display text-xl sm:text-2xl">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
            <Link to="/how-it-works"><Button variant="outline" className="mt-8 rounded-full">See the complete journey</Button></Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-7 overflow-hidden rounded-3xl bg-primary text-primary-foreground">
              <div className="p-8 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Image-based wardrobe</p>
                <h2 className="mt-3 max-w-xl font-display text-4xl sm:text-5xl">YOUR CLOSET, ORGANIZED AROUND YOU.</h2>
                <p className="mt-5 max-w-xl text-primary-foreground/80">Photograph your clothes, correct details when needed, then search and filter everything without digging through a drawer.</p>
              </div>
              <img src={wardrobeImage} alt="Organized wardrobe outfits" className="h-72 w-full object-cover" width={1536} height={1024} loading="lazy" />
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8 lg:col-span-5 sm:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Recommendations</p>
                <h3 className="mt-3 font-display text-3xl">Not random. Personal.</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">StyleSense balances compatible clothing, your preferences, weather, occasion, feedback, and fashion context.</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                {['Content-based', 'Collaborative', 'Weather-aware', 'Feedback-led'].map(item => <span key={item} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold">{item}</span>)}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 lg:col-span-5 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Wear frequency</p>
              <h3 className="mt-3 font-display text-3xl">Keep the rotation fresh.</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">Frequently worn pieces can step back for a while, giving overlooked clothes a chance to return.</p>
              <div className="mt-8 space-y-3">
                {[['Yellow knit', '2 wears this week', 'w-3/4'], ['Denim jacket', '1 wear this week', 'w-1/2'], ['Printed skirt', 'Ready to rediscover', 'w-1/4']].map(([name, note, width]) => <div key={name}><div className="flex justify-between text-xs"><span className="font-bold">{name}</span><span className="text-muted-foreground">{note}</span></div><div className="mt-1 h-2 rounded-full bg-secondary"><div className={`h-full rounded-full bg-accent ${width}`} /></div></div>)}
              </div>
            </div>
            <div className="rounded-3xl bg-accent/45 p-8 lg:col-span-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Plan ahead</p>
              <h3 className="mt-3 font-display text-3xl">A week that still feels like you.</h3>
              <p className="mt-4 max-w-xl text-muted-foreground">Build daily plans around your calendar, current weather, available clothes, and recent outfit history.</p>
              <div className="mt-8 grid grid-cols-5 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => <div key={day} className={`rounded-2xl p-3 text-center text-xs font-bold ${index === 2 ? 'bg-primary text-primary-foreground' : 'bg-background'}`}><span>{day}</span><div className="mx-auto mt-3 h-12 w-8 rounded-full bg-secondary" /></div>)}
              </div>
            </div>
          </div>
          <Link to="/features"><Button className="mt-9 rounded-full px-7">Explore every feature</Button></Link>
        </section>

        <section className="bg-foreground py-20 text-background md:py-28">
          <div className="container mx-auto grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Style intelligence</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">IT UNDERSTANDS THE DAY AROUND THE OUTFIT.</h2>
              <p className="mt-5 max-w-xl text-background/70">StyleSense is an intelligent wardrobe assistant, not a store. Every suggestion starts with your clothes and considers the context that makes an outfit useful.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {intelligence.map(item => <span key={item} className="rounded-full border border-background/25 px-4 py-2 text-sm">{item}</span>)}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <img src={communityImage} alt="Friends sharing personal style inspiration on a university campus" className="aspect-[3/2] w-full rounded-3xl object-cover" width={1536} height={1024} loading="lazy" />
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">Community inspiration</p>
            <h2 className="font-display text-4xl sm:text-5xl">SEE HOW OTHER PEOPLE STYLE THEIRS.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">Browse real outfit ideas, react, rate, and share feedback inside the app. Over time, those interactions help StyleSense understand what people with similar taste enjoy.</p>
            <p className="mt-4 text-sm font-bold">Lifestyle inspiration first. The learning happens quietly in the background.</p>
          </div>
        </section>

        <section className="border-y border-border bg-accent/35 py-20 md:py-28">
          <div className="container mx-auto grid gap-10 px-4 md:px-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">No New Clothes mode</p>
              <h2 className="font-display text-4xl sm:text-6xl">YOUR NEXT OUTFIT MIGHT ALREADY BE IN YOUR CLOSET.</h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-muted-foreground">For budget-conscious students, young professionals, and ukay-ukay lovers, buying more is not always the best first answer. StyleSense encourages creative reuse, better wardrobe value, and fewer unnecessary purchases.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">Early voices</p><h2 className="font-display text-4xl sm:text-5xl">MADE FOR REAL WARDROBES.</h2></div>
            <Link to="/testimonials" className="font-bold text-primary">Read all testimonials →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map(item => <figure key={item.name} className="flex min-h-72 flex-col justify-between rounded-3xl border border-border bg-card p-7"><blockquote className="text-lg leading-relaxed">“{item.quote}”</blockquote><figcaption className="mt-8"><p className="font-bold">{item.name}</p><p className="text-sm text-muted-foreground">Placeholder · {item.context}</p></figcaption></figure>)}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Placeholder testimonials prepared for replacement with approved research participant feedback.</p>
        </section>

        <section id="get-the-app" className="overflow-hidden bg-primary py-20 text-primary-foreground md:py-28 scroll-mt-20">
          <div className="container mx-auto grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">The StyleSense app</p>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl">YOUR WARDROBE. YOUR STYLE. ONE SMARTER WAY TO DRESS.</h2>
              <p className="mt-5 max-w-xl text-lg text-primary-foreground/75">Your wardrobe, outfit generator, recommendations, and weekly planner belong together in the mobile-first StyleSense experience.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="rounded-full bg-accent px-8 text-accent-foreground hover:bg-background">Get the StyleSense App</Button>
                <div className="rounded-2xl border border-primary-foreground/25 px-5 py-2 text-sm"><span className="block text-[10px] uppercase opacity-70">App stores</span><strong>Coming soon</strong></div>
              </div>
            </div>
            <PhonePreview />
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">Frequently asked</p><h2 className="font-display text-4xl sm:text-5xl">A FEW THINGS TO KNOW.</h2></div></div>
            <Accordion type="single" collapsible className="space-y-3">
              {homepageFaqs.map(([question, answer], index) => <AccordionItem key={question} value={`home-${index}`} className="rounded-2xl border border-border bg-card px-5"><AccordionTrigger className="text-left hover:no-underline">{question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}
            </Accordion>
            <Link to="/faq"><Button variant="outline" className="mt-7 rounded-full">View the full FAQ</Button></Link>
          </div>
        </section>

        <section className="border-t border-border px-4 py-24 text-center md:py-32">
          <div className="mx-auto max-w-3xl"><h2 className="font-display text-4xl sm:text-6xl">MAKE MORE OUTFITS FROM WHAT YOU ALREADY OWN.</h2><p className="mt-5 text-lg text-muted-foreground">Discover your wardrobe differently with StyleSense.</p><a href="#get-the-app"><Button size="lg" className="mt-8 rounded-full px-9">Get the App</Button></a></div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

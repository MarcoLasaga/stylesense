import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import OnboardingQuiz from '@/components/marketing/OnboardingQuiz';

const problems = [
  'A full closet, and still nothing feels wearable.',
  'The same three outfits, week after week.',
  'Clothes at the back of the shelf you forgot you owned.',
  'Pieces you like, but can never match with anything.',
  'Buying something new when what you own would have worked.',
  'Guessing what fits the weather or the occasion.',
];

const features = [
  { title: 'Digital Wardrobe', desc: 'Upload or capture photos of your clothes and keep your whole wardrobe organized in one place.' },
  { title: 'Smart Clothing Recognition', desc: 'StyleSense picks up the details that matter — clothing type, color, and style — so tagging is quick.' },
  { title: 'Mix & Match', desc: 'Generate outfit combinations built only from the clothes already sitting in your closet.' },
  { title: 'Personalized Recommendations', desc: 'Suggestions adapt to your preferences, ratings, feedback, and the outfits you actually wear.' },
  { title: 'Weather-Aware Outfits', desc: 'Recommendations can take today\'s weather into account before suggesting anything.' },
  { title: 'Occasion-Based Styling', desc: 'School, casual days, work, formal events, or occasions you define yourself.' },
  { title: 'Outfit Planner', desc: 'Line up outfit choices for the days ahead so mornings stop being a decision.' },
  { title: 'No New Clothes Mode', desc: 'Prioritizes what you already own instead of nudging you toward another purchase.' },
  { title: 'Wear Frequency Tracking', desc: 'Sees how often items and outfits get worn, and eases off repeats so suggestions stay fresh.' },
  { title: 'Community & Outfit Discovery', desc: 'Browse and react to outfits shared by other users — optional, and it helps recommendations too.' },
];

const hybrid = [
  { title: 'Content-Based Filtering', desc: 'Looks at the characteristics of your clothing — type, color, style, fabric — and works out which pieces genuinely go together.' },
  { title: 'Collaborative Filtering', desc: 'Learns from ratings, feedback, outfit interactions, and what people with similar taste tend to like.' },
  { title: 'Fashion Trend Awareness', desc: 'Folds in relevant current trends while still putting your existing wardrobe and personal taste first.' },
];

const context = [
  'Weather', 'Location', 'Occasion', 'Your preferences',
  'What\'s available', 'Outfit history', 'Wear frequency', 'Community activity',
];

const steps = [
  { n: '01', title: 'BUILD YOUR WARDROBE', desc: 'Upload photos of your clothes or add them manually.' },
  { n: '02', title: 'SET YOUR PREFERENCES', desc: 'Tell StyleSense about your style, your usual occasions, and what matters to you.' },
  { n: '03', title: 'DISCOVER OUTFITS', desc: 'Get combinations generated from the clothes you already own.' },
  { n: '04', title: 'MAKE IT YOURS', desc: 'Rate, save, wear, skip, or leave feedback on what you\'re shown.' },
  { n: '05', title: 'STYLESENSE LEARNS', desc: 'Every interaction shapes the recommendations you get next.' },
];

const testimonials = [
  { quote: 'I have so many clothes, but I always end up wearing the same three outfits. StyleSense gives me ideas I wouldn\'t have thought of.', name: 'Placeholder Name', role: 'Student' },
  { quote: 'Mornings used to eat twenty minutes. Now I check the planner the night before and it\'s already sorted.', name: 'Placeholder Name', role: 'Young Professional' },
  { quote: 'It reminded me about pieces I completely forgot I bought. I stopped shopping for a while, honestly.', name: 'Placeholder Name', role: 'Student' },
];

const faqs = [
  { q: 'What is StyleSense?', a: 'StyleSense is an image-based wardrobe and outfit recommendation system. You add the clothes you own, and it generates outfit suggestions from them.' },
  { q: 'Is StyleSense a shopping app?', a: 'No. StyleSense focuses primarily on helping you make better use of clothing you already own.' },
  { q: 'Does StyleSense recognize my clothes?', a: 'Yes — when you add a photo, it identifies clothing attributes such as type, color, and style so your wardrobe is organized with less effort.' },
  { q: 'Can I manually add clothes?', a: 'Absolutely. You can enter items yourself and edit any detail the app picked up.' },
  { q: 'Can StyleSense recommend outfits based on weather?', a: 'Yes. Recommendations can consider current weather conditions before suggesting an outfit.' },
  { q: 'Can I plan outfits for future days?', a: 'Yes, the outfit planner lets you organize choices for upcoming days.' },
  { q: 'Does StyleSense learn from my preferences?', a: 'It does. Ratings, feedback, saves, skips, and what you actually wear all feed into future recommendations.' },
  { q: 'Can I see outfits from other users?', a: 'Yes, optionally. Community outfit discovery lets you browse and react to outfits shared by others.' },
  { q: 'What happens if my clothing size changes?', a: 'You can update sizes and fit feedback, and StyleSense adjusts so outdated clothing information stops affecting your recommendations.' },
  { q: 'Can I use StyleSense without buying new clothes?', a: 'That is the whole point. No New Clothes mode prioritizes what is already in your wardrobe.' },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[240px] sm:w-[270px] rounded-[2.5rem] border-8 border-foreground/85 bg-card shadow-xl overflow-hidden">
      <div className="h-6 bg-foreground/85" />
      <div className="p-4 space-y-3 bg-background">
        <p className="font-display text-lg leading-tight">Today's Outfit</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-[3/4] rounded-2xl bg-accent/45" />
          <div className="aspect-[3/4] rounded-2xl bg-primary/25" />
          <div className="aspect-[3/4] rounded-2xl bg-secondary" />
          <div className="aspect-[3/4] rounded-2xl bg-fashion-rose/40" />
        </div>
        <div className="rounded-2xl bg-secondary px-3 py-2">
          <p className="text-[11px] text-muted-foreground">Sunny · 29°C · Casual day</p>
          <p className="text-xs font-semibold">92% match with your style</p>
        </div>
        <div className="rounded-full bg-primary text-primary-foreground text-center text-xs py-2 font-semibold">
          Wear this today
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">{children}</p>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* HERO */}
      <section id="home" className="pt-16">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6">
              YOUR WARDROBE.<br />
              YOUR STYLE.<br />
              <span className="text-primary">SMARTER CHOICES.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              StyleSense helps you turn the clothes you already own into outfits you'll actually
              want to wear.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#get-the-app">
                <Button size="lg" className="rounded-full h-13 px-8 text-base w-full sm:w-auto">Get the App</Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline" className="rounded-full h-13 px-8 text-base w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Personal wardrobe', 'Outfit ideas', 'Weather-aware', 'No new clothes needed'].map(t => (
                <span key={t} className="text-xs font-medium bg-secondary text-secondary-foreground rounded-full px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-[3rem] bg-accent/35" aria-hidden />
            <div className="relative py-10">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <SectionLabel>The everyday problem</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">WHAT DO I WEAR TODAY?</h2>
            <p className="text-muted-foreground text-lg">
              It's the question that eats your mornings. For students, young professionals, and anyone
              watching their budget, the answer is usually already hanging in the closet.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map(p => (
              <div key={p} className="bg-card border border-border rounded-2xl p-6">
                <p className="text-base leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>Why StyleSense exists</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">
              MAKE MORE OUT OF THE WARDROBE YOU ALREADY HAVE.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              StyleSense brings your closet into one place, understands what's in it, and puts pieces
              together for you — with your taste, your week, and the weather in mind.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Photo-based wardrobe', 'Clothing attribute recognition',
              'Personalized suggestions', 'Content-based matching',
              'Learning from the community', 'Fashion trend awareness',
              'Weather and context', 'Your feedback', 'Outfit planning',
            ].map(item => (
              <div key={item} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-secondary/50 border-y border-border scroll-mt-16">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <SectionLabel>Features</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              EVERYTHING IN THE STYLESENSE APP
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="bg-card border border-border rounded-3xl p-7 hover:border-primary transition-colors">
                <h3 className="font-display text-xl mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HYBRID RECOMMENDATION */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <SectionLabel>The recommendation system</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">
            IT LEARNS YOUR STYLE, NOT JUST YOUR CLOTHES.
          </h2>
          <p className="text-muted-foreground text-lg">
            No magic claims. StyleSense uses a hybrid approach that combines three sources of insight.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {hybrid.map((h, i) => (
            <div key={h.title} className="rounded-3xl border border-border bg-card p-7">
              <span className="font-display text-4xl text-accent">{`0${i + 1}`}</span>
              <h3 className="font-display text-xl mt-3 mb-3">{h.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTEXT AWARE */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-3 text-accent">Context-aware</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">
              OUTFITS THAT FIT THE DAY, NOT JUST THE CLOSET.
            </h2>
            <div className="flex flex-wrap gap-2">
              {context.map(c => (
                <span key={c} className="text-sm rounded-full bg-primary-foreground/15 px-4 py-1.5">{c}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[
              ['Rainy morning?', 'StyleSense can prioritize weather-appropriate pieces.'],
              ['Presentation today?', 'It can lean toward your more formal clothing.'],
              ['Don\'t want a repeat?', 'Yesterday\'s outfit influences what shows up today.'],
            ].map(([q, a]) => (
              <div key={q} className="rounded-2xl bg-primary-foreground/10 px-6 py-5">
                <p className="font-display text-lg mb-1">{q}</p>
                <p className="text-sm opacity-90">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIZE ADAPTABILITY */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="rounded-3xl bg-accent/35 border border-accent/50 p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl mb-4">YOUR WARDROBE CHANGES. STYLESENSE ADAPTS.</h2>
            <p className="text-base leading-relaxed">
              Sizes shift, favorites wear out, and some pieces just stop fitting the way they used to.
              StyleSense keeps your clothing information current so outdated details don't drag down
              your recommendations.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              'Current clothing sizes',
              'Fit feedback on items',
              'Updated measurements you provide',
              'How you interact with items',
              'Changes in your wardrobe',
              'Items consistently marked as not fitting',
            ].map(i => (
              <li key={i} className="rounded-2xl bg-background/80 px-4 py-3 text-sm font-medium">{i}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-secondary/50 border-y border-border scroll-mt-16">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">FIVE STEPS, THEN IT RUNS ITSELF</h2>
          </div>
          <div className="max-w-3xl">
            {steps.map(s => (
              <div key={s.n} className="flex gap-6 sm:gap-10 border-t border-border py-7 last:border-b">
                <span className="font-display text-3xl sm:text-4xl text-accent shrink-0 w-14">{s.n}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl mb-1.5">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NO NEW CLOTHES */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mb-10">
          <SectionLabel>No New Clothes</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">
            BEFORE YOU BUY MORE, CHECK WHAT YOU ALREADY HAVE.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            StyleSense is built to squeeze more out of the wardrobe you own. Better use of what's
            already in your closet can also mean fewer purchases you didn't really need.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Cost efficiency', 'Spend less by rediscovering what you own.'],
            ['Wardrobe utilization', 'See which pieces rarely leave the shelf.'],
            ['Creative reuse', 'New combinations from familiar clothes.'],
            ['Less repetition', 'Frequency tracking keeps outfits varied.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-lg mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY PREVIEW */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <SectionLabel>Community</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">
              SEE HOW OTHER PEOPLE STYLE THEIRS.
            </h2>
            <p className="text-muted-foreground text-lg">
              Outfit discovery, likes, ratings, and feedback all live inside the app — and they help
              recommendations get better for everyone.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['Campus Casual', 'Placeholder user'],
              ['Rainy Day Layers', 'Placeholder user'],
              ['Interview Ready', 'Placeholder user'],
              ['Weekend Coffee Run', 'Placeholder user'],
            ].map(([title, user], i) => (
              <div key={title} className="rounded-3xl border border-border bg-card overflow-hidden">
                <div className={`aspect-[4/5] ${['bg-accent/40', 'bg-primary/20', 'bg-fashion-rose/35', 'bg-fashion-sage/35'][i]}`} />
                <div className="p-4">
                  <p className="font-display text-base">{title}</p>
                  <p className="text-xs text-muted-foreground">{user} · saved &amp; rated in-app</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET THE APP */}
      <section id="get-the-app" className="container mx-auto px-4 md:px-6 py-16 md:py-24 scroll-mt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>Mobile first</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">
              YOUR STYLE DOESN'T STAY ON THE WEBSITE.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              StyleSense is made for the moment you're standing in front of your closet. Add your
              clothes, answer a few questions about your style, and your first outfit suggestions
              are ready in minutes.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-2xl bg-foreground text-background px-6 py-3">
                <p className="text-[10px] uppercase tracking-widest opacity-70">Coming soon on</p>
                <p className="font-semibold">App Store</p>
              </div>
              <div className="rounded-2xl bg-foreground text-background px-6 py-3">
                <p className="text-[10px] uppercase tracking-widest opacity-70">Coming soon on</p>
                <p className="font-semibold">Google Play</p>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-border p-3 text-center">
                <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center text-[10px] text-muted-foreground text-center px-2">
                  QR code placeholder
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-8 rounded-[3rem] bg-primary/15" aria-hidden />
            <div className="relative py-8"><PhoneMockup /></div>
          </div>
        </div>
      </section>

      {/* ONBOARDING */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
          <div className="mb-8 text-center">
            <SectionLabel>Quick start</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl">LET'S FIND YOUR STARTING POINT</h2>
          </div>
          <OnboardingQuiz />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="container mx-auto px-4 md:px-6 py-16 md:py-24 scroll-mt-16">
        <div className="max-w-2xl mb-12">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-3">WORDS FROM EARLY USERS</h2>
          <p className="text-muted-foreground">
            Placeholder quotes for now — these will be replaced with feedback from real research
            participants.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-3xl border border-border bg-card p-7 flex flex-col">
              <blockquote className="text-base leading-relaxed flex-1">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent/50" />
                <span>
                  <span className="block font-semibold text-sm">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">SIMPLE, WHEN IT'S READY</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
            <div className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-2xl mb-1">Free</h3>
              <p className="text-sm text-muted-foreground mb-6">For basic StyleSense features.</p>
              <span className="inline-block text-xs font-semibold rounded-full bg-secondary px-3 py-1.5">Available at launch</span>
            </div>
            <div className="rounded-3xl border-2 border-accent bg-card p-8">
              <h3 className="font-display text-2xl mb-1">StyleSense Plus</h3>
              <p className="text-sm text-muted-foreground mb-6">For future premium features.</p>
              <span className="inline-block text-xs font-semibold rounded-full bg-accent text-accent-foreground px-3 py-1.5">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container mx-auto px-4 md:px-6 py-16 md:py-24 scroll-mt-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel>About</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">THE PROJECT BEHIND STYLESENSE</h2>
            <Link to="/help">
              <Button variant="outline" className="rounded-full">Learn About the Project</Button>
            </Link>
          </div>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              StyleSense started as a research project: an image-based wardrobe and outfit
              recommendation system built to help people get more out of the clothes they already own.
            </p>
            <p>
              It brings together clothing recognition, personalized recommendations, hybrid
              recommendation techniques, outfit planning, and context-aware suggestions — packaged in
              something that feels friendly enough to open every morning.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-secondary/50 border-y border-border scroll-mt-16">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
          <div className="mb-10">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">QUESTIONS, ANSWERED</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl bg-card px-5">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 md:px-6 py-20 md:py-28 text-center max-w-3xl">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">
          YOUR CLOSET HAS MORE STORIES TO TELL.
        </h2>
        <p className="text-muted-foreground text-lg mb-9">
          Discover new ways to wear what you already own with StyleSense.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#get-the-app"><Button size="lg" className="rounded-full px-8 w-full sm:w-auto">Get the App</Button></a>
          <a href="#features"><Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto">Explore StyleSense</Button></a>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

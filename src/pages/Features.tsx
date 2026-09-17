import { PublicPage, AppCta } from '@/components/marketing/PublicPage';
import { featureGroups } from '@/data/marketingContent';
import wardrobeImage from '@/assets/wardrobe-editorial.jpg';
import communityImage from '@/assets/community-editorial.jpg';

export default function Features() {
  return (
    <PublicPage eyebrow="Inside the app" title="A wardrobe that learns how you actually dress." intro="StyleSense brings organization, recommendations, context, planning, and feedback into one personal wardrobe experience.">
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center"><img src={wardrobeImage} alt="Clothes from a personal wardrobe arranged into outfits" className="aspect-[3/2] rounded-editorial object-cover shadow-soft" width={1536} height={1024} /><div className="lg:p-8"><p className="eyebrow">Start with your clothes</p><h2 className="mt-3 font-display text-4xl">SEE IT. ADD IT. MAKE IT YOURS.</h2><p className="mt-5 text-lg leading-relaxed text-muted-foreground">Photo recognition speeds up wardrobe setup, while manual entry and corrections keep you in control of every detail.</p></div></div>
      </section>
      <section className="border-y border-border bg-fashion-cream-deep py-20 md:py-28"><div className="container mx-auto px-4 md:px-6"><div className="space-y-16">{featureGroups.map((feature, index) => <article key={feature.title} className={`grid gap-8 border-t border-border pt-10 md:grid-cols-2 ${index % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}><div><span className="font-display text-3xl text-secondary">{String(index + 1).padStart(2, '0')}</span><h2 className="mt-3 font-display text-3xl sm:text-4xl">{feature.title}</h2><p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{feature.copy}</p></div><ul className="space-y-3 self-end">{feature.points.map(point => <li key={point} className="border-b border-border pb-3 font-bold">{point}</li>)}</ul></article>)}</div></div></section>
      <section className="container mx-auto grid gap-10 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow">Community discovery</p><h2 className="mt-3 font-display text-4xl">INSPIRATION THAT STILL FEELS PERSONAL.</h2><p className="mt-5 leading-relaxed text-muted-foreground">Community reactions can help the recommendation system learn, but the experience remains grounded in your own wardrobe and preferences.</p></div><img src={communityImage} alt="Friends sharing personal outfit inspiration" className="aspect-[3/2] rounded-editorial object-cover shadow-soft" width={1536} height={1024} loading="lazy" /></section>
      <AppCta />
    </PublicPage>
  );
}

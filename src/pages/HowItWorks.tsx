import { PublicPage, AppCta } from '@/components/marketing/PublicPage';
import wardrobeImage from '@/assets/wardrobe-editorial.jpg';

const journey = [
  ['01', 'Create your profile', 'Begin with the style, occasions, and practical preferences that matter to you.'],
  ['02', 'Add your wardrobe', 'Build a private digital view of the clothes you already own.'],
  ['03', 'Upload or capture clothing', 'Use an existing image, take a new photo, or enter an item manually.'],
  ['04', 'Review clothing details', 'StyleSense suggests categories, colors, styles, and other useful attributes that you can correct.'],
  ['05', 'Set your preferences', 'Tell the system what you enjoy, avoid, need for work, or wear for everyday life.'],
  ['06', 'Receive outfit recommendations', 'Compatible pieces are ranked using your wardrobe, context, and learned preferences.'],
  ['07', 'Rate and provide feedback', 'Save, skip, rate, wear, or comment on suggestions to improve what appears next.'],
  ['08', 'Track what you wear', 'Wear history prevents repetitive suggestions and reveals overlooked clothing.'],
  ['09', 'Plan outfits', 'Prepare tomorrow or organize a week around weather, schedule, and available pieces.'],
  ['10', 'Keep improving', 'Your changing wardrobe, fit, feedback, and habits keep future recommendations relevant.'],
];

export default function HowItWorks() {
  return (
    <PublicPage eyebrow="The complete journey" title="From the first photo to a wardrobe that knows you." intro="StyleSense gets useful quickly, then becomes more personal through the choices and feedback you share.">
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28"><img src={wardrobeImage} alt="Organized clothing ready for outfit planning" className="aspect-[16/7] w-full rounded-editorial object-cover shadow-soft" width={1536} height={1024} /></section>
      <section className="border-y border-border bg-fashion-cream-deep"><div className="container mx-auto px-4 py-20 md:px-6 md:py-28"><div className="mx-auto max-w-4xl border-y border-border">{journey.map(([number, title, copy]) => <article key={number} className="grid gap-3 border-b border-border py-8 last:border-b-0 sm:grid-cols-[80px_1fr_1.2fr] sm:gap-8"><span className="font-display text-3xl text-secondary">{number}</span><h2 className="font-display text-xl sm:text-2xl">{title}</h2><p className="leading-relaxed text-muted-foreground">{copy}</p></article>)}</div></div></section>
      <section className="container mx-auto grid gap-8 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2"><div><p className="eyebrow">The hybrid approach</p><h2 className="mt-3 font-display text-4xl">TWO WAYS OF LEARNING, ONE USEFUL RESULT.</h2></div><div className="space-y-7"><div><h3 className="font-display text-2xl">It understands your clothes</h3><p className="mt-2 text-muted-foreground">Content-based matching compares categories, colors, fabrics, seasons, and occasions to find pieces that work together.</p></div><div><h3 className="font-display text-2xl">It learns from people</h3><p className="mt-2 text-muted-foreground">Ratings, saves, feedback, and community interactions reveal preferences shared by people with similar taste.</p></div><div><h3 className="font-display text-2xl">It respects the moment</h3><p className="mt-2 text-muted-foreground">Weather, location, availability, recent wear, and your schedule help turn a possible outfit into a practical one.</p></div></div></section>
      <AppCta />
    </PublicPage>
  );
}

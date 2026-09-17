import { useState } from 'react';
import { PublicPage, AppCta } from '@/components/marketing/PublicPage';
import { testimonials } from '@/data/marketingContent';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Students', 'Young Professionals', 'Everyday Users'];

export default function Testimonials() {
  const [category, setCategory] = useState('All');
  const visible = category === 'All' ? testimonials : testimonials.filter(item => item.category === category);
  return (
    <PublicPage eyebrow="Early perspectives" title="Real wardrobes. Familiar problems. Better possibilities." intro="These clearly labeled placeholders show how approved participant and user feedback can appear once the research collection is complete.">
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter testimonials">{categories.map(item => <Button key={item} variant={category === item ? 'default' : 'outline'} className="rounded-full" onClick={() => setCategory(item)}>{item}</Button>)}</div>
        <div className="border-y border-border">{visible.map((item, index) => <figure key={item.name} className="grid gap-6 border-b border-border py-9 last:border-b-0 md:grid-cols-[72px_1fr_240px] md:items-start"><span className="font-display text-3xl text-secondary">{String(index + 1).padStart(2, '0')}</span><blockquote className="font-display text-2xl leading-relaxed sm:text-3xl">“{item.quote}”</blockquote><figcaption><p className="font-bold">{item.name}</p><p className="text-sm text-muted-foreground">Placeholder · {item.context}</p></figcaption></figure>)}</div>
        <p className="mt-6 text-sm text-muted-foreground">No quote on this page is presented as verified research evidence. Replace placeholders only with approved participant or user feedback.</p>
      </section>
      <AppCta />
    </PublicPage>
  );
}

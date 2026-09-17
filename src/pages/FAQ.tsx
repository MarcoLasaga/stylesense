import { PublicPage, AppCta } from '@/components/marketing/PublicPage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqGroups } from '@/data/marketingContent';

export default function FAQ() {
  return (
    <PublicPage eyebrow="Frequently asked questions" title="Everything worth knowing before you begin." intro="Learn how StyleSense handles wardrobes, recommendations, fit, context, and personal information.">
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28"><div className="mx-auto max-w-4xl space-y-14">{faqGroups.map((group, groupIndex) => <section key={group.title}><h2 className="mb-5 font-display text-3xl">{group.title}</h2><Accordion type="single" collapsible className="border-y border-border">{group.items.map(([question, answer], itemIndex) => <AccordionItem key={question} value={`${groupIndex}-${itemIndex}`} className="border-border px-1"><AccordionTrigger className="text-left text-base hover:no-underline">{question}</AccordionTrigger><AccordionContent className="max-w-3xl text-base leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></section>)}</div></section>
      <AppCta />
    </PublicPage>
  );
}

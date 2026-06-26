import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Mail, Phone, MapPin, User, Rocket, Settings, ShieldCheck, KeyRound,
  Server, ShoppingBag, CreditCard, Lock, Handshake, Newspaper, Briefcase, LifeBuoy,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';

const helpCards = [
  { icon: Rocket, title: 'Getting Started' },
  { icon: Settings, title: 'Account Settings' },
  { icon: KeyRound, title: 'Login & Verification' },
  { icon: Server, title: 'Server Status' },
  { icon: ShoppingBag, title: 'Order Issues' },
  { icon: CreditCard, title: 'Payments' },
  { icon: Lock, title: 'Privacy' },
  { icon: ShieldCheck, title: 'Security' },
];

const otherRequests = [
  { icon: Handshake, title: 'Partnerships' },
  { icon: Newspaper, title: 'Media & Press' },
  { icon: Briefcase, title: 'Business Inquiries' },
  { icon: LifeBuoy, title: 'Technical Support' },
];

const footerLinks = [
  { label: 'About', desc: LOREM },
  { label: 'Contact', desc: LOREM },
  { label: 'Privacy Policy', desc: LOREM },
  { label: 'Terms of Service', desc: LOREM },
  { label: 'FAQ', desc: LOREM },
];

const hoverCard =
  'group transition-all duration-200 hover:border-[#FF8C00] hover:shadow-[0_8px_24px_-12px_rgba(255,140,0,0.45)] hover:-translate-y-0.5 cursor-pointer';
const hoverIcon = 'transition-colors duration-200 group-hover:text-[#FF8C00]';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">Help &amp; Support</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {LOREM} Reach out to us using the form below or browse common topics.
          </p>
        </header>

        {/* Two-column: Contact info + Form */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Contact info */}
          <Card className="p-6 md:p-8">
            <h2 className="font-display text-2xl mb-6">Contact Information</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Name</div>
                  <div className="font-medium">John Doe</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Email</div>
                  <a href="mailto:john.doe@email.com" className="font-medium hover:text-[#FF8C00] transition-colors">
                    john.doe@email.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Phone</div>
                  <a href="tel:+639123456789" className="font-medium hover:text-[#FF8C00] transition-colors">
                    +63 912 345 6789
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Address</div>
                  <div className="font-medium leading-relaxed">
                    123 Sample Street<br />
                    Lorem City, Philippines
                  </div>
                </div>
              </li>
            </ul>
          </Card>

          {/* Contact form */}
          <Card className="p-6 md:p-8">
            <h2 className="font-display text-2xl mb-6">Send us a Message</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Subject" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} placeholder="Lorem ipsum dolor sit amet..." />
              </div>
              <Button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-[#FF8C00] hover:text-white transition-colors"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </section>

        {/* Need Help? */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-3xl tracking-tight">Need Help?</h2>
            <span className="text-sm text-muted-foreground hidden sm:block">Browse common topics</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {helpCards.map(({ icon: Icon, title }) => (
              <Card key={title} className={`p-5 ${hoverCard}`}>
                <Icon className={`h-6 w-6 mb-3 text-muted-foreground ${hoverIcon}`} />
                <h3 className="font-medium mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{LOREM}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Other Requests */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-tight mb-6">Other Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherRequests.map(({ icon: Icon, title }) => (
              <Card key={title} className={`p-6 flex items-start gap-4 ${hoverCard}`}>
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className={`h-5 w-5 text-muted-foreground ${hoverIcon}`} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{LOREM}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {footerLinks.map((l) => (
              <div key={l.label}>
                <Link
                  to="/help"
                  className="font-display text-base mb-2 inline-block hover:text-[#FF8C00] transition-colors"
                >
                  {l.label}
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} StyleSense. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

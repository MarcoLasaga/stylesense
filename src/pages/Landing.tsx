import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Sparkles, Users, Shirt, Camera, Cloud, TrendingUp,
  CalendarDays, Heart, Tag,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: Camera,
    title: 'Snap & Organize',
    desc: 'Upload your clothes once. We categorize by color, fabric, style, and occasion automatically.',
  },
  {
    icon: Sparkles,
    title: 'Smart Outfit Generator',
    desc: 'Hybrid recommendation engine creates outfits using color harmony, style, and weather.',
  },
  {
    icon: Users,
    title: 'Community-Powered',
    desc: 'Collaborative filtering learns from outfits that real users love — and applies it to your wardrobe.',
  },
  {
    icon: Cloud,
    title: 'Weather-Aware',
    desc: 'Outfit suggestions adapt to today\'s temperature, humidity, and rain probability.',
  },
  {
    icon: CalendarDays,
    title: '7-Day Planner',
    desc: 'Plan a full week of non-repetitive outfits matched to your schedule and the forecast.',
  },
  {
    icon: TrendingUp,
    title: 'Eco Insights',
    desc: 'Track wardrobe utilization and avoided purchases — wear more of what you already own.',
  },
];

const steps = [
  { icon: Camera, title: '1. Upload Clothes', desc: 'Snap or upload photos of every item' },
  { icon: Tag, title: '2. Label & Organize', desc: 'Category, color, style, and size' },
  { icon: Sparkles, title: '3. Get Outfits', desc: 'AI generates daily combinations' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO — large, premium */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-background to-fashion-rose/10" />
        <div className="container mx-auto px-4 pt-20 md:pt-32 pb-24 md:pb-40 min-h-[85vh] flex flex-col items-center justify-center text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                Your AI Wardrobe Assistant
              </p>
            </div>

            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] mb-8 tracking-tight">
              Your Wardrobe.{' '}
              <span className="text-accent">Smarter.</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Upload your clothes, generate outfits, plan your week, and discover new
              combinations without buying anything new.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto h-14 px-8 text-base rounded-full">
                  Start Building Wardrobe <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/feed" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full">
                  Explore Community Outfits
                </Button>
              </Link>
            </div>

            {/* Visual mockup row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-3xl mx-auto"
            >
              {[
                { icon: Shirt, label: 'Top · Cotton', tone: 'bg-fashion-cream' },
                { icon: Shirt, label: 'Bottom · Denim', tone: 'bg-fashion-navy/20' },
                { icon: Heart, label: 'Saved · Casual', tone: 'bg-fashion-rose/30' },
                { icon: TrendingUp, label: 'Trending Now', tone: 'bg-fashion-sage/30' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className={`aspect-[3/4] rounded-2xl ${card.tone} border border-border p-4 flex flex-col justify-between shadow-sm`}
                >
                  <card.icon className="h-6 w-6 text-foreground/70" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Wardrobe Item
                    </p>
                    <p className="font-display text-sm mt-1">{card.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              How It Works
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Three steps to a smarter closet</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-5">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              Core Features
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Your Wardrobe, Reimagined</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card p-7 rounded-2xl border border-border hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl mb-5">
            Ready to organize your closet?
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Upload your clothes, let the algorithm work, and start wearing smarter outfits today.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2 h-14 px-8 rounded-full text-base">
              Create Your Wardrobe <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-display text-sm">
              S
            </div>
            <p className="font-display text-base">
              Style<span className="text-accent">Sense</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 StyleSense — Personalized Outfit Recommendation System. Thesis Project.
          </p>
        </div>
      </footer>
    </div>
  );
}

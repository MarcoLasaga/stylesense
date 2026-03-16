import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Shirt } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClothingCard from '@/components/ClothingCard';
import { clothingItems } from '@/data/clothing';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    desc: 'Content-based filtering analyzes color, fabric, style, and occasion to match your taste.',
  },
  {
    icon: Users,
    title: 'Collaborative Filtering',
    desc: 'Discover what people with similar fashion sense are wearing and loving.',
  },
  {
    icon: Shirt,
    title: 'Outfit Generator',
    desc: 'Automatically combine tops, bottoms, and shoes into cohesive outfits.',
  },
];

export default function Landing() {
  const featured = clothingItems.filter(i => i.rating >= 4.5).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
              Personalized Fashion
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] mb-6">
              Your Style,{' '}
              <span className="italic text-accent">Intelligently</span>{' '}
              Curated
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
              StyleSense uses collaborative filtering and content-based machine learning to recommend
              clothing that matches your unique taste.
            </p>
            <div className="flex gap-4">
              <Link to="/catalog">
                <Button size="lg" className="gap-2">
                  Explore Catalog <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/recommendations">
                <Button variant="outline" size="lg">
                  Get Recommendations
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {featured.map((item, i) => (
              <ClothingCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Smart Recommendations
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card p-8 rounded-sm border border-border hover:border-accent/30 transition-colors"
              >
                <f.icon className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Find Your Style?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Set up your profile, browse the catalog, and let our algorithms do the rest.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display font-bold">
            Style<span className="text-accent">Sense</span>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 StyleSense — Personalized Clothing Recommendation System. Thesis Project.
          </p>
        </div>
      </footer>
    </div>
  );
}

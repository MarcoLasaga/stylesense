import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Shirt, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: Camera,
    title: 'Snap & Organize',
    desc: 'Upload or photograph your clothes. Categorize by color, style, fabric, and occasion.',
  },
  {
    icon: Sparkles,
    title: 'Smart Outfit Generator',
    desc: 'Content-based filtering creates outfits based on color harmony, style consistency, and occasion.',
  },
  {
    icon: Users,
    title: 'Collaborative Filtering',
    desc: 'Learn from community patterns — discover outfit combinations similar users love.',
  },
  {
    icon: Shirt,
    title: 'Save & Track',
    desc: 'Save your favorite outfits, track what you wear, and get better recommendations over time.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-36 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
              Your Digital Wardrobe Assistant
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] mb-6">
              Never Ask{' '}
              <span className="italic text-accent">"What Should I Wear?"</span>{' '}
              Again
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              StyleSense organizes your personal wardrobe and uses machine learning to generate
              perfect outfit combinations from clothes you already own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/wardrobe">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Demo Wardrobe
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Visual element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="container mx-auto px-4 pb-16"
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-sm p-6 md:p-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">How It Works</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-secondary/50 rounded-sm p-4">
                <div className="text-2xl mb-2">📸</div>
                <p className="text-xs font-medium">1. Upload Clothes</p>
                <p className="text-[10px] text-muted-foreground mt-1">Snap or upload photos</p>
              </div>
              <div className="bg-secondary/50 rounded-sm p-4">
                <div className="text-2xl mb-2">🏷️</div>
                <p className="text-xs font-medium">2. Label & Organize</p>
                <p className="text-[10px] text-muted-foreground mt-1">Category, color, style</p>
              </div>
              <div className="bg-secondary/50 rounded-sm p-4">
                <div className="text-2xl mb-2">✨</div>
                <p className="text-xs font-medium">3. Get Outfits</p>
                <p className="text-[10px] text-muted-foreground mt-1">AI generates combos</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">Core Features</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Your Wardrobe, Smarter
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-sm border border-border hover:border-accent/30 transition-colors"
              >
                <f.icon className="h-7 w-7 text-accent mb-3" />
                <h3 className="font-display text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Organize Your Closet?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Upload your clothes, let the algorithm work, and start wearing smarter outfits.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Create Your Wardrobe <ArrowRight className="h-4 w-4" />
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
            © 2026 StyleSense — Personalized Outfit Recommendation System. Thesis Project.
          </p>
        </div>
      </footer>
    </div>
  );
}

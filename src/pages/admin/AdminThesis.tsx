import AdminLayout from '@/components/AdminLayout';
import { Award, Brain, Camera, Cloud, Eye, Layers, Leaf, Ruler, Share2, Sparkles, Repeat } from 'lucide-react';

const CONTRIBUTIONS = [
  { icon: Camera, title: 'Image-Based Wardrobe Detection',
    desc: 'Users digitise their physical wardrobe through image upload and automated tagging.' },
  { icon: Brain, title: 'Automatic Clothing Classification',
    desc: 'Each garment is classified by category, color, fabric, style, and occasion for downstream reasoning.' },
  { icon: Layers, title: 'Hybrid Recommendation Algorithm',
    desc: 'Combines content-based filtering, collaborative filtering, trend boosts, and rule-based fashion knowledge.' },
  { icon: Share2, title: 'Social Collaborative Filtering',
    desc: 'Real cross-user signals (likes, ratings, saves) feed an online collaborative layer.' },
  { icon: Repeat, title: 'Frequency-Aware Recommendation',
    desc: 'A cooldown-based anti-repetition mechanism prevents over-recommending recently-worn items.' },
  { icon: Ruler, title: 'Size Adaptation System',
    desc: 'A drift-detection algorithm auto-updates user size from longitudinal fit feedback.' },
  { icon: Cloud, title: 'Context-Aware Outfit Planning',
    desc: 'Weather (temperature, humidity, UV, rain probability, wind) is fused into the recommendation score.' },
  { icon: Leaf, title: 'Sustainability-Oriented Optimisation',
    desc: 'Quantifies wardrobe utilisation, reuse intensity, and estimated avoided purchases.' },
  { icon: Sparkles, title: 'Wardrobe Gap Analysis',
    desc: 'AI-driven detection of missing categories and weather coverage in the user\'s wardrobe.' },
  { icon: Eye, title: 'Explainable AI Recommendations',
    desc: 'Every outfit ships with a transparent breakdown of factor contributions and fashion-rule rationale.' },
];

export default function AdminThesis() {
  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-2">
        <Award className="h-6 w-6 text-accent" />
        <h1 className="text-3xl font-display font-bold">Thesis Contributions</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Unique innovations of StyleSense — designed for panel presentation and academic defense.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {CONTRIBUTIONS.map((c, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-sm">
                <c.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-sm mb-1">
                  <span className="text-muted-foreground mr-1">{String(i + 1).padStart(2, '0')}.</span>
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-accent/5 border border-accent/30 p-6 rounded-sm">
        <p className="text-[10px] uppercase tracking-widest text-accent mb-2">Research Alignment</p>
        <p className="text-sm">
          StyleSense addresses personalisation, explainability, contextual intelligence,
          and sustainability — pillars of an image-based wardrobe and outfit recommendation system
          using hybrid recommendation algorithms. Each contribution maps to a concrete subsystem
          and an evaluation metric in the Research Analytics dashboard.
        </p>
      </div>
    </AdminLayout>
  );
}

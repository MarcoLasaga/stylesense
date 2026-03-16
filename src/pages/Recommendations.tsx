import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ClothingCard from '@/components/ClothingCard';
import { getProfile, getRatings } from '@/lib/store';
import { getRecommendations, contentBasedRecommend, collaborativeFilteringRecommend } from '@/lib/recommendation';
import { clothingItems } from '@/data/clothing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Users, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Recommendations() {
  const profile = getProfile();
  const ratings = getRatings();
  const [tab, setTab] = useState('hybrid');

  const hybrid = useMemo(() => getRecommendations(profile, ratings, 12), []);
  const contentBased = useMemo(() => contentBasedRecommend(profile, clothingItems, [], 12), []);
  const collaborative = useMemo(() => collaborativeFilteringRecommend(ratings, clothingItems, 12), []);

  const hasProfile = profile.name && profile.preferredStyles.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">For You</h1>
          <p className="text-muted-foreground">
            {hasProfile
              ? `Personalized recommendations based on your style preferences`
              : 'Set up your profile to get better recommendations'}
          </p>
          {!hasProfile && (
            <Link to="/profile" className="inline-block mt-3">
              <Button variant="outline" size="sm">Set Up Profile</Button>
            </Link>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="hybrid" className="gap-2">
              <Layers className="h-3.5 w-3.5" /> Hybrid
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Content-Based
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="gap-2">
              <Users className="h-3.5 w-3.5" /> Collaborative
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hybrid">
            <p className="text-sm text-muted-foreground mb-6">
              Combined recommendations using both algorithms (60% content-based, 40% collaborative).
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {hybrid.map((rec, i) => (
                <ClothingCard key={rec.item.id} item={rec.item} index={i} showReason={rec.reason} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content">
            <p className="text-sm text-muted-foreground mb-6">
              Recommendations based on matching your preferred colors, styles, categories, and occasions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {contentBased.map((rec, i) => (
                <ClothingCard key={rec.item.id} item={rec.item} index={i} showReason={rec.reason} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collaborative">
            <p className="text-sm text-muted-foreground mb-6">
              Items liked by users with similar rating patterns (cosine similarity).
              {collaborative.length === 0 && ' Like some items in the catalog to get collaborative recommendations!'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {collaborative.map((rec, i) => (
                <ClothingCard key={rec.item.id} item={rec.item} index={i} showReason={rec.reason} />
              ))}
            </div>
            {collaborative.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Like some items in the catalog first</p>
                <Link to="/catalog"><Button variant="outline">Go to Catalog</Button></Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

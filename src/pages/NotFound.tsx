import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MarketingNav from "@/components/marketing/MarketingNav";
import wardrobeImage from "@/assets/wardrobe-editorial.jpg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main className="container mx-auto grid min-h-screen items-center gap-12 px-4 pb-16 pt-28 md:px-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">404 · Missing page</p>
          <h1 className="font-display text-5xl leading-tight sm:text-6xl">LOOKS LIKE THIS OUTFIT DOESN'T EXIST.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            The page you're looking for may have moved, disappeared, or never made it into the wardrobe.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/"><Button size="lg" className="w-full rounded-full px-8 sm:w-auto">Back Home</Button></Link>
            <Link to="/features"><Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">Explore StyleSense</Button></Link>
          </div>
        </div>
        <img src={wardrobeImage} alt="Clothes arranged into possible outfits" className="aspect-[4/3] w-full rounded-3xl object-cover" width={1536} height={1024} />
      </main>
    </div>
  );
};

export default NotFound;

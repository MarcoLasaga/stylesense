
-- ─── Profiles (synced with auth.users) ────────────────────
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_initial TEXT NOT NULL DEFAULT '?',
  current_size TEXT NOT NULL DEFAULT 'M',
  preferred_styles TEXT[] NOT NULL DEFAULT ARRAY['casual']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ─── Roles (separate table for security) ──────────────────
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ─── Auto-create profile + default user role on signup ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_initial)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), 1))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Shared outfits (social feed) ─────────────────────────
CREATE TABLE public.shared_outfits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  caption TEXT,
  style TEXT NOT NULL,
  occasion TEXT NOT NULL,
  items JSONB NOT NULL,           -- snapshot of outfit items
  cover_image TEXT,                -- first item image
  like_count INT NOT NULL DEFAULT 0,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  save_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shared_outfits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shared outfits"
  ON public.shared_outfits FOR SELECT USING (true);
CREATE POLICY "Users can post their own outfits"
  ON public.shared_outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own outfits"
  ON public.shared_outfits FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete any shared outfit"
  ON public.shared_outfits FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ─── Outfit interactions (likes/ratings/saves) ────────────
CREATE TABLE public.outfit_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES public.shared_outfits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (outfit_id, user_id)
);
ALTER TABLE public.outfit_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by all" ON public.outfit_likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON public.outfit_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.outfit_likes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.outfit_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES public.shared_outfits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (outfit_id, user_id)
);
ALTER TABLE public.outfit_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings viewable by all" ON public.outfit_ratings FOR SELECT USING (true);
CREATE POLICY "Users can rate" ON public.outfit_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own rating" ON public.outfit_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own rating" ON public.outfit_ratings FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.outfit_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES public.shared_outfits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (outfit_id, user_id)
);
ALTER TABLE public.outfit_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Saves viewable by owner" ON public.outfit_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save" ON public.outfit_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave" ON public.outfit_saves FOR DELETE USING (auth.uid() = user_id);

-- ─── Triggers to keep aggregate counts fresh ──────────────
CREATE OR REPLACE FUNCTION public.recalc_outfit_aggregates()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  oid UUID;
BEGIN
  oid := COALESCE(NEW.outfit_id, OLD.outfit_id);
  UPDATE public.shared_outfits SET
    like_count = (SELECT COUNT(*) FROM public.outfit_likes WHERE outfit_id = oid),
    save_count = (SELECT COUNT(*) FROM public.outfit_saves WHERE outfit_id = oid),
    rating_count = (SELECT COUNT(*) FROM public.outfit_ratings WHERE outfit_id = oid),
    rating_avg = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM public.outfit_ratings WHERE outfit_id = oid), 0)
  WHERE id = oid;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_likes_recalc AFTER INSERT OR DELETE ON public.outfit_likes
  FOR EACH ROW EXECUTE FUNCTION public.recalc_outfit_aggregates();
CREATE TRIGGER trg_saves_recalc AFTER INSERT OR DELETE ON public.outfit_saves
  FOR EACH ROW EXECUTE FUNCTION public.recalc_outfit_aggregates();
CREATE TRIGGER trg_ratings_recalc AFTER INSERT OR UPDATE OR DELETE ON public.outfit_ratings
  FOR EACH ROW EXECUTE FUNCTION public.recalc_outfit_aggregates();

-- ─── Wear log (frequency tracker) ─────────────────────────
CREATE TABLE public.wear_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,           -- local wardrobe item id
  outfit_signature TEXT,           -- sorted item ids joined
  worn_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wear_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own wear log" ON public.wear_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own wear log" ON public.wear_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all wear logs" ON public.wear_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ─── Fit feedback (size adaptation) ───────────────────────
CREATE TABLE public.fit_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_size TEXT NOT NULL,         -- size of the item (XS-XXL)
  fit TEXT NOT NULL CHECK (fit IN ('too_tight','perfect','too_loose')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fit_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own fit feedback" ON public.fit_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own fit feedback" ON public.fit_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all fit feedback" ON public.fit_feedback FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

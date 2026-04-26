import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { signup as localSignup, login as localLogin, isAdmin, saveProfile, getProfile } from '@/lib/store';
import { syncLocalProfileFromCloud, isCloudAdmin } from '@/lib/socialStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

/**
 * Login page — bridges Supabase Auth (for social features) with the
 * existing localStorage profile (for the wardrobe). Signing in does both:
 *   1. Authenticates with Supabase (real session for the social feed)
 *   2. Syncs profile + role into localStorage so existing pages keep working
 *
 * The legacy admin (admin@stylesense.com / admin123) still works locally
 * if Supabase auth fails for that email — useful for offline demos.
 */
export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // If already authenticated with Supabase, skip the page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        syncLocalProfileFromCloud().then(() => {
          isCloudAdmin().then(adm => navigate(adm ? '/admin' : '/wardrobe'));
        });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      if (isSignup) {
        if (!name || !email || !password) { toast.error('All fields required'); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: redirectUrl, data: { display_name: name } },
        });
        if (error) { toast.error(error.message); return; }
        // Mirror locally so wardrobe page works even before cloud profile sync
        localSignup(name, email, password);
        await syncLocalProfileFromCloud();
        toast.success('Account created! Set up your style preferences.');
        navigate('/profile');
        return;
      }

      // Sign-in flow
      if (!email || !password) { toast.error('Email and password required'); return; }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback to legacy local admin so the demo account keeps working
        if (localLogin(email, password)) {
          toast.success('Signed in (local admin mode)');
          navigate(isAdmin() ? '/admin' : '/wardrobe');
          return;
        }
        toast.error(error.message);
        return;
      }
      await syncLocalProfileFromCloud();
      const cloudAdm = await isCloudAdmin();
      // Reflect role in local profile too
      const p = getProfile();
      if (cloudAdm && p.role !== 'admin') saveProfile({ ...p, role: 'admin' });
      toast.success('Welcome back!');
      navigate(cloudAdm ? '/admin' : '/wardrobe');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignup ? 'Start organizing your wardrobe' : 'Sign in to your digital closet'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Please wait…' : (isSignup ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>

          {!isSignup && (
            <div className="mt-4 p-3 bg-secondary/50 rounded-sm border border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Local Admin (Offline Demo)</p>
              <p className="text-xs text-muted-foreground">
                Email: <span className="font-medium text-foreground">admin@stylesense.com</span> · 
                Password: <span className="font-medium text-foreground">admin123</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                For the social feed, create a real account above.
              </p>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignup(!isSignup)} className="text-accent font-medium hover:underline">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

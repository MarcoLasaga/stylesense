import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { signup as localSignup, login as localLogin, isAdmin, saveProfile, getProfile } from '@/lib/store';
import { syncLocalProfileFromCloud, isCloudAdmin } from '@/lib/socialStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Sparkles, LogOut, ArrowRight } from 'lucide-react';
import { logout as localLogout } from '@/lib/store';

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [existingSession, setExistingSession] = useState<null | { email: string; admin: boolean }>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        await syncLocalProfileFromCloud();
        const adm = await isCloudAdmin();
        setExistingSession({ email: data.session.user.email ?? 'your account', admin: adm });
      }
    });
  }, []);

  const handleContinue = () => {
    navigate(existingSession?.admin ? '/admin' : '/wardrobe');
  };

  const handleSwitchAccount = async () => {
    setBusy(true);
    try {
      await supabase.auth.signOut().catch(() => {});
      localLogout();
      setExistingSession(null);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error('Google sign-in failed');
        return;
      }
      if (result.redirected) return; // browser will navigate away
      await syncLocalProfileFromCloud();
      const adm = await isCloudAdmin();
      const p = getProfile();
      if (adm && p.role !== 'admin') saveProfile({ ...p, role: 'admin' });
      toast.success('Welcome to StyleSense!');
      navigate(adm ? '/admin' : '/wardrobe');
    } finally {
      setBusy(false);
    }
  };

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
        localSignup(name, email, password);
        await syncLocalProfileFromCloud();
        toast.success('Account created! Set up your style preferences.');
        navigate('/profile');
        return;
      }
      if (!email || !password) { toast.error('Email and password required'); return; }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 mb-4">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">StyleSense</span>
            </div>
            <h1 className="font-display text-4xl mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignup ? 'Start organizing your wardrobe' : 'Sign in to your digital closet'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full h-12 rounded-full gap-3 mb-5 border-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px bg-border flex-1" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="h-11 rounded-xl" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-full" size="lg" disabled={busy}>
                {busy ? 'Please wait…' : (isSignup ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

            {!isSignup && (
              <div className="mt-5 p-3 bg-secondary/60 rounded-xl border border-border">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Local Admin (Offline Demo)</p>
                <p className="text-xs text-muted-foreground">
                  Email: <span className="font-semibold text-foreground">admin@stylesense.com</span> ·{' '}
                  Password: <span className="font-semibold text-foreground">admin123</span>
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignup(!isSignup)} className="text-accent font-semibold hover:underline">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

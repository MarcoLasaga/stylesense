import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (!name || !email || !password) { toast.error('All fields required'); return; }
      signup(name, email, password);
      toast.success('Account created! Set up your style preferences.');
      navigate('/profile');
    } else {
      if (!email || !password) { toast.error('Email and password required'); return; }
      login(email, password);
      toast.success('Welcome back!');
      navigate('/wardrobe');
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
            <Button type="submit" className="w-full" size="lg">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

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

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName || email },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Check your email!', description: 'We sent you a confirmation link.' });
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Check your email!', description: 'Password reset link sent.' });
    }
  };

  if (isForgot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="pixel-border bg-card rounded-lg p-6 w-full max-w-sm">
          <h1 className="text-lg font-pixel text-foreground text-center mb-4">Reset Password</h1>
          <form onSubmit={handleForgot} className="space-y-3">
            <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required className="font-orbitron text-sm h-9" />
            <Button type="submit" disabled={loading} className="w-full font-pixel text-xs h-9 pixel-button">{loading ? '...' : 'Send Reset Link'}</Button>
          </form>
          <button onClick={() => setIsForgot(false)} className="mt-3 text-xs font-pixel text-muted-foreground hover:text-foreground block mx-auto">← Back to login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="pixel-border bg-card rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-lg font-pixel text-foreground text-center mb-1">Achievement Tracker</h1>
        <p className="text-muted-foreground font-pixel text-[10px] text-center mb-4">🌟 {isLogin ? 'Welcome back!' : 'Create your account'}</p>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-3">
          {!isLogin && (
            <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name" className="font-orbitron text-sm h-9" />
          )}
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required className="font-orbitron text-sm h-9" />
          <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required minLength={6} className="font-orbitron text-sm h-9" />
          <Button type="submit" disabled={loading} className="w-full font-pixel text-xs h-9 pixel-button">
            {loading ? '...' : isLogin ? '🎮 Log In' : '🚀 Sign Up'}
          </Button>
        </form>

        <div className="mt-3 flex justify-between">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-pixel text-muted-foreground hover:text-foreground">
            {isLogin ? 'Need an account?' : 'Have an account?'}
          </button>
          {isLogin && (
            <button onClick={() => setIsForgot(true)} className="text-[10px] font-pixel text-muted-foreground hover:text-foreground">
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

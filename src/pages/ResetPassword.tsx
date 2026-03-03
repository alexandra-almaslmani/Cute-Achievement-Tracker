import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery type in URL hash
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated!', description: 'You can now log in.' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="pixel-border bg-card rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-lg font-pixel text-foreground text-center mb-4">New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="New password" required minLength={6} className="font-orbitron text-sm h-9" />
          <Button type="submit" disabled={loading} className="w-full font-pixel text-xs h-9 pixel-button">{loading ? '...' : 'Update Password'}</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

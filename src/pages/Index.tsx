import { useState, useEffect } from 'react';
import { Achievement } from '@/types/achievement';
import AchievementCalendar from '@/components/AchievementCalendar';
import AchievementForm from '@/components/AchievementForm';
import AchievementList from '@/components/AchievementList';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  // Load achievements from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Failed to fetch achievements:', error);
      } else {
        setAchievements(
          (data || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            date: a.date,
            type: a.type,
            createdAt: new Date(a.created_at),
          }))
        );
      }
      setLoading(false);
    };
    fetchAchievements();
  }, [user]);

  const handleSaveAchievement = async (achievementData: Omit<Achievement, 'id' | 'createdAt'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: user.id,
        title: achievementData.title,
        description: achievementData.description,
        date: achievementData.date,
        type: achievementData.type,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    const newAchievement: Achievement = {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      type: data.type as Achievement['type'],
      createdAt: new Date(data.created_at),
    };

    setAchievements(prev => [newAchievement, ...prev]);
    
    const typeEmoji = { win: '🏆', failure: '💔', event: '📅' }[achievementData.type];
    toast({ title: "Achievement Added!", description: `${typeEmoji} ${achievementData.title}` });
  };

  const handleDeleteAchievement = async (id: string) => {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Achievement Deleted", description: "The achievement has been removed." });
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 relative">
          <button
            onClick={signOut}
            className="absolute right-0 top-0 pixel-button bg-secondary text-secondary-foreground px-3 py-1 rounded font-pixel text-[10px] hover:scale-105 transition-transform"
          >
            Sign Out
          </button>
          <h1 className="text-2xl sm:text-3xl font-pixel text-foreground mb-2">
            Achievement Tracker
          </h1>
          <p className="text-muted-foreground font-orbitron text-sm">
            Track your daily wins, failures & events! 🌟
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <p className="font-pixel text-muted-foreground text-sm">Loading achievements...</p>
          </div>
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                <AchievementCalendar
                  achievements={achievements}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
              <div className="lg:col-span-1">
                <div className="pixel-border bg-card rounded-lg p-4 h-fit">
                  <h3 className="text-sm font-pixel text-foreground mb-3 text-center">Total Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 achievement-win rounded-sm"></div>
                        <span className="text-xs font-pixel">Wins</span>
                      </div>
                      <span className="text-sm font-pixel text-win-DEFAULT">
                        {achievements.filter(a => a.type === 'win').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 achievement-failure rounded-sm"></div>
                        <span className="text-xs font-pixel">Failures</span>
                      </div>
                      <span className="text-sm font-pixel text-failure-DEFAULT">
                        {achievements.filter(a => a.type === 'failure').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 achievement-event rounded-sm"></div>
                        <span className="text-xs font-pixel">Events</span>
                      </div>
                      <span className="text-sm font-pixel text-event-DEFAULT">
                        {achievements.filter(a => a.type === 'event').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form and List Grid */}
            <div className="grid lg:grid-cols-2 gap-4">
              <AchievementForm selectedDate={selectedDate} onSave={handleSaveAchievement} />
              <AchievementList achievements={achievements} selectedDate={selectedDate} onDelete={handleDeleteAchievement} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;

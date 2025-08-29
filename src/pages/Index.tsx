import { useState, useEffect } from 'react';
import { Achievement } from '@/types/achievement';
import AchievementCalendar from '@/components/AchievementCalendar';
import AchievementForm from '@/components/AchievementForm';
import AchievementList from '@/components/AchievementList';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  // Load achievements from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('achievements');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt)
        }));
        setAchievements(parsed);
      } catch (error) {
        console.error('Failed to parse achievements:', error);
      }
    }
  }, []);

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const handleSaveAchievement = (achievementData: Omit<Achievement, 'id' | 'createdAt'>) => {
    const newAchievement: Achievement = {
      ...achievementData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setAchievements(prev => [...prev, newAchievement]);
    
    const typeEmoji = {
      win: '🏆',
      failure: '💔',
      event: '📅'
    }[achievementData.type];
    
    toast({
      title: "Achievement Added!",
      description: `${typeEmoji} ${achievementData.title}`,
    });
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Achievement Deleted",
      description: "The achievement has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-pixel text-foreground mb-2">
            Achievement Tracker
          </h1>
          <p className="text-muted-foreground font-orbitron text-sm">
            Track your daily wins, failures & events! 🌟
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <AchievementCalendar
              achievements={achievements}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Stats Card */}
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
          <AchievementForm
            selectedDate={selectedDate}
            onSave={handleSaveAchievement}
          />
          
          <AchievementList
            achievements={achievements}
            selectedDate={selectedDate}
            onDelete={handleDeleteAchievement}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

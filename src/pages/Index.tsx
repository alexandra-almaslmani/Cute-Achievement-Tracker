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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-pixel text-foreground mb-4">
            Achievement Tracker
          </h1>
          <p className="text-muted-foreground font-orbitron text-lg">
            Track your daily wins, failures, and memorable events! 🌟
          </p>
        </header>

        {/* Calendar Section */}
        <div className="mb-8">
          <AchievementCalendar
            achievements={achievements}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Form and List Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
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

        {/* Stats Footer */}
        <footer className="mt-12 text-center">
          <div className="pixel-border bg-card rounded-lg p-6 inline-block">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-pixel text-win-DEFAULT">
                  {achievements.filter(a => a.type === 'win').length}
                </div>
                <div className="text-xs font-pixel text-muted-foreground mt-1">Wins</div>
              </div>
              <div>
                <div className="text-2xl font-pixel text-failure-DEFAULT">
                  {achievements.filter(a => a.type === 'failure').length}
                </div>
                <div className="text-xs font-pixel text-muted-foreground mt-1">Failures</div>
              </div>
              <div>
                <div className="text-2xl font-pixel text-event-DEFAULT">
                  {achievements.filter(a => a.type === 'event').length}
                </div>
                <div className="text-xs font-pixel text-muted-foreground mt-1">Events</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;

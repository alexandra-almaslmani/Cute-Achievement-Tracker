import { Achievement } from '@/types/achievement';
import { format, parseISO } from 'date-fns';

interface AchievementListProps {
  achievements: Achievement[];
  selectedDate: Date;
  onDelete: (id: string) => void;
}

const AchievementList = ({ achievements, selectedDate, onDelete }: AchievementListProps) => {
  const dayAchievements = achievements.filter(
    achievement => achievement.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const getTypeIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'win': return '🏆';
      case 'failure': return '💔';
      case 'event': return '📅';
    }
  };

  const getTypeClass = (type: Achievement['type']) => {
    switch (type) {
      case 'win': return 'achievement-win';
      case 'failure': return 'achievement-failure';
      case 'event': return 'achievement-event';
    }
  };

  if (dayAchievements.length === 0) {
    return (
      <div className="pixel-border bg-card rounded-lg p-6">
        <h3 className="text-lg font-pixel text-foreground mb-4">
          {format(selectedDate, 'MMM d, yyyy')}
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🌟</div>
          <p className="text-muted-foreground font-pixel text-sm">
            No achievements yet for this day.
          </p>
          <p className="text-muted-foreground font-pixel text-xs mt-2">
            Add your first achievement above!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-border bg-card rounded-lg p-6">
      <h3 className="text-lg font-pixel text-foreground mb-4">
        {format(selectedDate, 'MMM d, yyyy')} ({dayAchievements.length})
      </h3>
      
      <div className="space-y-3">
        {dayAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`pixel-border rounded-lg p-4 ${getTypeClass(achievement.type)} relative group`}
          >
            <button
              onClick={() => onDelete(achievement.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background rounded px-2 py-1 text-xs font-pixel"
            >
              ✕
            </button>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getTypeIcon(achievement.type)}</span>
              <div className="flex-1">
                <h4 className="font-pixel text-sm text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)] mb-1">
                  {achievement.title}
                </h4>
                {achievement.description && (
                  <p className="font-orbitron text-xs text-white/90 leading-relaxed">
                    {achievement.description}
                  </p>
                )}
                <div className="mt-2 text-xs font-pixel text-white/70">
                  Added {format(achievement.createdAt, 'h:mm a')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementList;
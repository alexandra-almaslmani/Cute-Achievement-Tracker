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
      <div className="pixel-border bg-card rounded-lg p-4">
        <h3 className="text-sm font-pixel text-foreground mb-3">
          {format(selectedDate, 'MMM d, yyyy')}
        </h3>
        <div className="text-center py-6">
          <div className="text-2xl mb-2">🌟</div>
          <p className="text-muted-foreground font-pixel text-xs">
            No achievements yet
          </p>
          <p className="text-muted-foreground font-pixel text-[10px] mt-1">
            Add one above!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-border bg-card rounded-lg p-4">
      <h3 className="text-sm font-pixel text-foreground mb-3">
        {format(selectedDate, 'MMM d')} ({dayAchievements.length})
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {dayAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`pixel-border rounded p-3 ${getTypeClass(achievement.type)} relative group hover:scale-[1.02] transition-transform`}
          >
            <button
              onClick={() => onDelete(achievement.id)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background rounded px-1 py-0.5 text-[10px] font-pixel hover:scale-110"
            >
              ✕
            </button>
            
            <div className="flex items-start gap-2">
              <span className="text-lg">{getTypeIcon(achievement.type)}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-pixel text-xs text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)] mb-1 truncate">
                  {achievement.title}
                </h4>
                {achievement.description && (
                  <p className="font-orbitron text-[10px] text-white/90 leading-relaxed line-clamp-2">
                    {achievement.description}
                  </p>
                )}
                <div className="mt-1 text-[9px] font-pixel text-white/70">
                  {format(achievement.createdAt, 'h:mm a')}
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
import { Achievement } from '@/types/achievement';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

interface AchievementCalendarProps {
  achievements: Achievement[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const AchievementCalendar = ({ achievements, selectedDate, onDateSelect }: AchievementCalendarProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAchievementsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return achievements.filter(achievement => achievement.date === dateStr);
  };

  const getDayColorClass = (dayAchievements: Achievement[]) => {
    if (dayAchievements.length === 0) return 'bg-card hover:bg-muted';
    
    const types = new Set(dayAchievements.map(a => a.type));
    
    if (types.size === 1) {
      const type = Array.from(types)[0];
      if (type === 'win') return 'achievement-win';
      if (type === 'failure') return 'achievement-failure';
      if (type === 'event') return 'achievement-event';
    }
    
    // Mixed achievements - create gradient effect
    return 'achievement-mixed';
  };

  return (
    <div className="pixel-border bg-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-pixel text-foreground">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            className="pixel-button bg-secondary text-secondary-foreground px-3 py-2 rounded font-pixel text-xs"
          >
            ←
          </button>
          <button
            onClick={() => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            className="pixel-button bg-secondary text-secondary-foreground px-3 py-2 rounded font-pixel text-xs"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-pixel text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const dayAchievements = getAchievementsForDay(date);
          const isSelected = isSameDay(date, selectedDate);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`
                aspect-square p-2 rounded-lg text-xs font-pixel transition-all duration-200
                pixel-button relative
                ${getDayColorClass(dayAchievements)}
                ${isSelected ? 'ring-2 ring-ring' : ''}
              `}
            >
              <span className={`${dayAchievements.length > 0 ? 'text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]' : 'text-foreground'}`}>
                {format(date, 'd')}
              </span>
              {dayAchievements.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-background border border-border rounded-full w-5 h-5 flex items-center justify-center text-[8px] font-pixel">
                  {dayAchievements.length}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-6 text-xs font-pixel">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 achievement-win rounded"></div>
          <span>Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 achievement-failure rounded"></div>
          <span>Failures</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 achievement-event rounded"></div>
          <span>Events</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementCalendar;
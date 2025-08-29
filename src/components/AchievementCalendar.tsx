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
    <div className="pixel-border bg-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-pixel text-foreground">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            className="pixel-button bg-secondary text-secondary-foreground px-2 py-1 rounded font-pixel text-xs hover:scale-105 transition-transform"
          >
            ←
          </button>
          <button
            onClick={() => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            className="pixel-button bg-secondary text-secondary-foreground px-2 py-1 rounded font-pixel text-xs hover:scale-105 transition-transform"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-[10px] font-pixel text-muted-foreground p-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((date) => {
          const dayAchievements = getAchievementsForDay(date);
          const isSelected = isSameDay(date, selectedDate);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`
                w-8 h-8 rounded text-[10px] font-pixel transition-all duration-200
                pixel-button relative hover:scale-110 active:scale-95
                ${getDayColorClass(dayAchievements)}
                ${isSelected ? 'ring-1 ring-ring scale-110' : ''}
              `}
            >
              <span className={`${dayAchievements.length > 0 ? 'text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]' : 'text-foreground'}`}>
                {format(date, 'd')}
              </span>
              {dayAchievements.length > 0 && (
                <div className="absolute -top-0.5 -right-0.5 bg-background border border-border rounded-full w-3 h-3 flex items-center justify-center text-[6px] font-pixel">
                  {dayAchievements.length}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-3 text-[10px] font-pixel">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 achievement-win rounded-sm"></div>
          <span>Wins</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 achievement-failure rounded-sm"></div>
          <span>Failures</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 achievement-event rounded-sm"></div>
          <span>Events</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementCalendar;
import { useState } from 'react';
import { Achievement, AchievementType } from '@/types/achievement';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AchievementFormProps {
  selectedDate: Date;
  onSave: (achievement: Omit<Achievement, 'id' | 'createdAt'>) => void;
}

const AchievementForm = ({ selectedDate, onSave }: AchievementFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AchievementType>('win');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      type,
    });
    
    setTitle('');
    setDescription('');
    setType('win');
  };

  return (
    <div className="pixel-border bg-card rounded-lg p-6">
      <h3 className="text-lg font-pixel text-foreground mb-4">
        Add Achievement for {format(selectedDate, 'MMM d, yyyy')}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-pixel text-foreground mb-2">
            Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you achieve?"
            className="font-orbitron"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-pixel text-foreground mb-2">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us more about it..."
            className="font-orbitron min-h-[80px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-pixel text-foreground mb-2">
            Type *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('win')}
              className={`
                pixel-button py-3 px-4 rounded font-pixel text-xs text-center transition-all
                ${type === 'win' 
                  ? 'achievement-win text-white' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              🏆 Win
            </button>
            <button
              type="button"
              onClick={() => setType('failure')}
              className={`
                pixel-button py-3 px-4 rounded font-pixel text-xs text-center transition-all
                ${type === 'failure' 
                  ? 'achievement-failure text-white' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              💔 Failure
            </button>
            <button
              type="button"
              onClick={() => setType('event')}
              className={`
                pixel-button py-3 px-4 rounded font-pixel text-xs text-center transition-all
                ${type === 'event' 
                  ? 'achievement-event text-white' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              📅 Event
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={!title.trim()}
          className="w-full pixel-button bg-primary hover:bg-primary/90 text-primary-foreground font-pixel"
        >
          Save Achievement
        </Button>
      </form>
    </div>
  );
};

export default AchievementForm;
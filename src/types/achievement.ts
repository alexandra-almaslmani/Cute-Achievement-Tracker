export type AchievementType = 'win' | 'failure' | 'event';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  type: AchievementType;
  createdAt: Date;
}

export interface DayAchievements {
  date: string;
  achievements: Achievement[];
  types: Set<AchievementType>;
}
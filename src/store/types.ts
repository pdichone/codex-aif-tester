export type GoalIntensity = 'light' | 'moderate' | 'intense';

export interface Step {
  id: string;
  goalId: string;
  title: string;
  notes?: string;
  completed: boolean;
  order: number;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  intensity: GoalIntensity;
  targetDate?: string;
  createdAt: string;
}

export interface GoalWithSteps extends Goal {
  steps: Step[];
}

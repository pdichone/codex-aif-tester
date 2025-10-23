import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal, GoalIntensity, GoalWithSteps, Step } from './types';
import { createId } from '../utils/id';

interface GoalState {
  goals: Goal[];
  steps: Step[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'> & { steps?: Omit<Step, 'id' | 'goalId' | 'order' | 'completed'>[] }) => void;
  updateGoal: (id: string, data: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;
  deleteGoal: (id: string) => void;
  addStep: (goalId: string, step: Omit<Step, 'id' | 'goalId' | 'order' | 'completed'>) => void;
  toggleStep: (id: string) => void;
  removeStep: (id: string) => void;
  reorderStep: (goalId: string, from: number, to: number) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      steps: [],
      addGoal: (goalInput) =>
        set((state) => {
          const goalId = createId();
          const createdAt = new Date().toISOString();
          const goal: Goal = {
            id: goalId,
            name: goalInput.name,
            description: goalInput.description,
            intensity: goalInput.intensity,
            targetDate: goalInput.targetDate,
            createdAt,
          };

          const newSteps: Step[] = (goalInput.steps ?? []).map((step, index) => ({
            id: createId(),
            goalId,
            title: step.title,
            notes: step.notes,
            completed: false,
            order: index,
          }));

          return {
            goals: [...state.goals, goal],
            steps: [...state.steps, ...newSteps],
          };
        }),
      updateGoal: (id, data) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  ...data,
                }
              : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
          steps: state.steps.filter((step) => step.goalId !== id),
        })),
      addStep: (goalId, stepInput) =>
        set((state) => {
          const stepsForGoal = state.steps.filter((step) => step.goalId === goalId);
          const step: Step = {
            id: createId(),
            goalId,
            title: stepInput.title,
            notes: stepInput.notes,
            completed: false,
            order: stepsForGoal.length,
          };

          return {
            steps: [...state.steps, step],
          };
        }),
      toggleStep: (id) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === id
              ? {
                  ...step,
                  completed: !step.completed,
                }
              : step
          ),
        })),
      removeStep: (id) =>
        set((state) => {
          const target = state.steps.find((step) => step.id === id);
          if (!target) {
            return {};
          }

          return {
            steps: state.steps
              .filter((step) => step.id !== id)
              .map((step) =>
                step.goalId === target.goalId && step.order > target.order
                  ? { ...step, order: step.order - 1 }
                  : step
              ),
          };
        }),
      reorderStep: (goalId, from, to) =>
        set((state) => {
          const stepsForGoal = state.steps.filter((step) => step.goalId === goalId).sort((a, b) => a.order - b.order);
          const moved = stepsForGoal.splice(from, 1)[0];
          stepsForGoal.splice(to, 0, moved);

          const updated = stepsForGoal.map((step, index) => ({ ...step, order: index }));

          return {
            steps: [
              ...state.steps.filter((step) => step.goalId !== goalId),
              ...updated,
            ],
          };
        }),
    }),
    {
      name: 'momentum-goals',
      partialize: (state) => ({ goals: state.goals, steps: state.steps }),
    }
  )
);

export const useGoals = (): GoalWithSteps[] => {
  const { goals, steps } = useGoalStore((state) => ({ goals: state.goals, steps: state.steps }));

  return goals
    .map((goal) => ({
      ...goal,
      steps: steps
        .filter((step) => step.goalId === goal.id)
        .sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const intensityLabel: Record<GoalIntensity, string> = {
  light: 'Light',
  moderate: 'Moderate',
  intense: 'Intense',
};

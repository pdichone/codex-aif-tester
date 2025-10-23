import { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import type { GoalWithSteps } from '../store/types';
import { intensityLabel } from '../store/useGoalStore';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface GoalCardProps {
  goal: GoalWithSteps;
  onAddStep: (goalId: string, payload: { title: string; notes?: string }) => void;
  onToggleStep: (stepId: string) => void;
  onRemoveStep: (stepId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalCard = ({ goal, onAddStep, onToggleStep, onRemoveStep, onDeleteGoal }: GoalCardProps) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const completed = goal.steps.filter((step) => step.completed).length;
  const total = goal.steps.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAddStep(goal.id, { title: title.trim(), notes: notes.trim() ? notes.trim() : undefined });
    setTitle('');
    setNotes('');
  };

  return (
    <article className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-card">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{goal.name}</h3>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
              {intensityLabel[goal.intensity]}
            </span>
          </div>
          {goal.description && <p className="mt-3 text-sm text-slate-400">{goal.description}</p>}
          {goal.targetDate && (
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-400">
              <Calendar className="h-4 w-4" /> Target {new Date(goal.targetDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete goal"
          onClick={() => onDeleteGoal(goal.id)}
          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </header>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Progress</span>
          <span className="text-sm font-semibold text-brand-300">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Steps</h4>
        <ul className="space-y-3">
          {goal.steps.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
              No steps yet. Start by adding your first milestone below.
            </li>
          )}
          {goal.steps.map((step) => (
            <li
              key={step.id}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-brand-400/60 hover:bg-slate-900/70"
            >
              <button
                className="flex flex-1 items-start gap-3 text-left"
                onClick={() => onToggleStep(step.id)}
                type="button"
              >
                {step.completed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                )}
                <div>
                  <p className={`text-sm font-medium ${step.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                    {step.title}
                  </p>
                  {step.notes && <p className="mt-1 text-xs text-slate-400">{step.notes}</p>}
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove step"
                onClick={() => onRemoveStep(step.id)}
                className="text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <h5 className="text-sm font-semibold text-slate-200">Add a step</h5>
        <Input placeholder="Step title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <Textarea
          placeholder="Optional notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!title.trim()}>
            Add step
          </Button>
        </div>
      </form>
    </article>
  );
};


import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Plus, X } from 'lucide-react';
import type { GoalIntensity } from '../store/types';
import { createId } from '../utils/id';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface StepDraft {
  id: string;
  title: string;
  notes: string;
}

interface AddGoalDialogProps {
  trigger: ReactNode;
  onSubmit: (payload: {
    name: string;
    description?: string;
    intensity: GoalIntensity;
    targetDate?: string;
    steps: { title: string; notes?: string }[];
  }) => void;
}

const intensityOptions: { value: GoalIntensity; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Perfect for stretching and active recovery goals.' },
  { value: 'moderate', label: 'Moderate', description: 'A balanced pace with a mix of strength and cardio.' },
  { value: 'intense', label: 'Intense', description: 'High-commitment goals that demand your best energy.' },
];

export const AddGoalDialog = ({ trigger, onSubmit }: AddGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [intensity, setIntensity] = useState<GoalIntensity>('moderate');
  const [steps, setSteps] = useState<StepDraft[]>([]);

  const reset = () => {
    setName('');
    setDescription('');
    setTargetDate('');
    setIntensity('moderate');
    setSteps([]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() ? description.trim() : undefined,
      intensity,
      targetDate: targetDate || undefined,
      steps: steps
        .filter((step) => step.title.trim())
        .map((step) => ({ title: step.title.trim(), notes: step.notes.trim() ? step.notes.trim() : undefined })),
    });
    reset();
    setOpen(false);
  };

  const addStepDraft = () => {
    setSteps((prev) => [...prev, { id: createId(), title: '', notes: '' }]);
  };

  const removeStepDraft = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const updateStepDraft = (id: string, update: Partial<Omit<StepDraft, 'id'>>) => {
    setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, ...update } : step)));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const triggerElement = isValidElement(trigger)
    ? (() => {
        const element = trigger as ReactElement<{ onClick?: (event: MouseEvent) => void }>;
        return cloneElement(element, {
          onClick: (event: MouseEvent) => {
            element.props.onClick?.(event);
            setOpen(true);
          },
        });
      })()
    : (
        <button type="button" onClick={() => setOpen(true)}>
          {trigger}
        </button>
      );

  const dialogContent = !open || !mounted
    ? null
    : createPortal(
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal
            className="relative z-50 w-[min(520px,90vw)] rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Create a fitness goal</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Define your objective, map the milestones, and Momentum will keep you accountable.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-slate-500 hover:text-slate-200"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="goal-name" className="text-sm font-medium text-slate-200">
                  Goal name
                </label>
                <Input
                  id="goal-name"
                  placeholder="Run a half marathon"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="goal-description" className="text-sm font-medium text-slate-200">
                  Description
                </label>
                <Textarea
                  id="goal-description"
                  placeholder="Add a short note about why this goal matters and how you&apos;ll approach it."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="target-date" className="text-sm font-medium text-slate-200">
                    Target date
                  </label>
                  <Input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(event) => setTargetDate(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-200">Training intensity</p>
                <div className="grid gap-3">
                  {intensityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        intensity === option.value
                          ? 'border-brand-400/70 bg-brand-500/10 text-brand-100'
                          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="intensity"
                        value={option.value}
                        checked={intensity === option.value}
                        onChange={() => setIntensity(option.value)}
                        className="mt-1 h-4 w-4 border-2 border-slate-500 text-brand-500 focus-visible:outline-none"
                      />
                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">Initial steps</p>
                  <Button type="button" variant="subtle" size="sm" onClick={addStepDraft}>
                    <Plus className="mr-2 h-4 w-4" /> Add step
                  </Button>
                </div>

                {steps.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
                    Add a few milestones to give yourself momentum right away. You can always add more later.
                  </p>
                )}

                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.id} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Step title</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => removeStepDraft(step.id)}
                          aria-label="Remove step"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Hit 5km without stopping"
                        value={step.title}
                        onChange={(event) => updateStepDraft(step.id, { title: event.target.value })}
                      />
                      <Textarea
                        placeholder="Notes or specifics for this milestone"
                        value={step.notes}
                        onChange={(event) => updateStepDraft(step.id, { notes: event.target.value })}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-400 hover:text-slate-200"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Create goal
              </Button>
            </div>
          </form>
        </div>,
        document.body,
      );

  return (
    <>
      {triggerElement}
      {dialogContent}
    </>
  );
};


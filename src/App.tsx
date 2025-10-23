import { Activity, ClipboardList, Clock, Plus } from 'lucide-react';
import { AddGoalDialog } from './components/AddGoalDialog';
import { Button } from './components/Button';
import { EmptyState } from './components/EmptyState';
import { GoalCard } from './components/GoalCard';
import { StatCard } from './components/StatCard';
import { useGoals, useGoalStore } from './store/useGoalStore';

const brandGradient = 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]';

const App = () => {
  const goals = useGoals();
  const addGoal = useGoalStore((state) => state.addGoal);
  const addStep = useGoalStore((state) => state.addStep);
  const toggleStep = useGoalStore((state) => state.toggleStep);
  const removeStep = useGoalStore((state) => state.removeStep);
  const deleteGoal = useGoalStore((state) => state.deleteGoal);

  const totalGoals = goals.length;
  const allSteps = goals.flatMap((goal) => goal.steps);
  const completedSteps = allSteps.filter((step) => step.completed).length;
  const activeSteps = allSteps.length - completedSteps;
  const nextTarget = goals
    .filter((goal) => goal.targetDate)
    .map((goal) => goal.targetDate as string)
    .sort()
    .at(0);

  return (
    <div className={`min-h-screen bg-slate-950 pb-20 text-slate-100 ${brandGradient}`}>
      <header className="border-b border-slate-900/60 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-200">
              Momentum
            </span>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Make your fitness vision feel actionable
            </h1>
            <p className="text-sm text-slate-400 md:text-base">
              Break big ambitions into meaningful milestones, track your weekly wins, and build a rhythm
              that keeps you motivated.
            </p>
            <div className="flex items-center gap-8 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" /> Consistent streaks
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-brand-400" /> Purpose-built reminders
              </div>
            </div>
          </div>
          <AddGoalDialog
            onSubmit={(payload) => addGoal(payload)}
            trigger={
              <Button className="h-12 px-6 text-base shadow-brand-500/20">
                <Plus className="mr-2 h-5 w-5" /> Create goal
              </Button>
            }
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6">
        <section className="-mt-12 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active goals"
            value={`${totalGoals}`}
            icon={<Activity className="h-6 w-6" />}
            accent="brand"
          />
          <StatCard
            label="Steps remaining"
            value={`${Math.max(activeSteps, 0)}`}
            icon={<ClipboardList className="h-6 w-6" />}
            accent="violet"
          />
          <StatCard
            label="Completed"
            value={`${completedSteps}`}
            icon={<Clock className="h-6 w-6" />}
            accent="emerald"
          />
        </section>

        {nextTarget && (
          <div className="mt-10 rounded-3xl border border-brand-500/30 bg-brand-500/5 p-6 text-sm text-brand-100">
            Your next target is <span className="font-semibold">{new Date(nextTarget).toLocaleDateString()}</span>.
            Plan your sessions to stay ahead.
          </div>
        )}

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {goals.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState />
            </div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddStep={addStep}
                onToggleStep={toggleStep}
                onRemoveStep={removeStep}
                onDeleteGoal={deleteGoal}
              />
            ))
          )}
        </section>
      </main>

      <footer className="mt-24 border-t border-slate-900/70 bg-slate-950/70 py-10 text-center text-xs text-slate-500">
        Built with intention • Stay kind to your body.
      </footer>
    </div>
  );
};

export default App;


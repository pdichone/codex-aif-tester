import { Sparkles } from 'lucide-react';

export const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
      <Sparkles className="h-8 w-8" />
    </div>
    <h2 className="mt-6 text-2xl font-semibold text-white">Let&apos;s build your next milestone</h2>
    <p className="mt-3 text-sm text-slate-400">
      Create a fitness goal, break it down into actionable steps, and Momentum will help you stay
      focused every day.
    </p>
  </div>
);

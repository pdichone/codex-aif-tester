import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: 'brand' | 'emerald' | 'violet' | 'orange';
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  brand: 'bg-brand-500/10 text-brand-300',
  emerald: 'bg-emerald-500/10 text-emerald-300',
  violet: 'bg-violet-500/10 text-violet-300',
  orange: 'bg-orange-500/10 text-orange-300',
};

export const StatCard = ({ label, value, icon, accent = 'brand' }: StatCardProps) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-card">
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', accentStyles[accent])}>{icon}</div>
    <dt className="mt-4 text-sm uppercase tracking-wide text-slate-400">{label}</dt>
    <dd className="mt-2 text-2xl font-semibold text-white">{value}</dd>
  </div>
);

import * as React from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-slate-950/40 transition focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

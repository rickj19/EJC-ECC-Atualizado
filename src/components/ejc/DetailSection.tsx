import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DetailSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function DetailSection({ title, icon: Icon, children, className }: DetailSectionProps) {
  return (
    <div className={cn(
      "institutional-card p-6 print:p-4",
      className
    )}>
      <div className="flex items-center gap-3 mb-6 border-b border-church-border/20 pb-4 print:mb-4 print:pb-2">
        <Icon size={18} strokeWidth={1.5} className="text-church-gold" />
        <h3 className="text-lg font-bold text-church-dark tracking-tight print:text-base">{title}</h3>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string | number | boolean | null | undefined;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export function DetailItem({ label, value, icon: Icon, fullWidth }: DetailItemProps) {
  const displayValue = value === true ? 'Sim' : value === false ? 'Não' : value || '-';
  
  return (
    <div className={cn("space-y-1", fullWidth && "col-span-full")}>
      <p className="institutional-label">{label}</p>
      <div className="flex items-start gap-2">
        {Icon && <Icon size={14} strokeWidth={1.5} className="text-stone-300 mt-0.5 print:hidden shrink-0" />}
        <p className="text-sm font-medium text-church-dark leading-snug print:text-sm">{displayValue}</p>
      </div>
    </div>
  );
}

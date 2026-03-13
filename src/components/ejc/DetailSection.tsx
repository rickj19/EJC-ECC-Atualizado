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
      "bg-white p-8 rounded-2xl border border-church-border shadow-sm print:shadow-none print:border-stone-200 print:p-6",
      className
    )}>
      <div className="flex items-center gap-3 mb-8 border-b border-church-border/50 pb-5 print:mb-4 print:pb-2">
        <div className="p-2.5 bg-church-bg rounded-xl text-church-dark print:p-0 print:bg-transparent">
          <Icon size={20} className="print:w-4 print:h-4" />
        </div>
        <h3 className="text-xl font-serif font-bold text-church-dark print:text-sm">{title}</h3>
      </div>
      {children}
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
  const displayValue = value === true ? 'Sim' : value === false ? 'Não' : value || 'Não informado';
  
  return (
    <div className={cn("space-y-1.5", fullWidth && "col-span-full")}>
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] print:text-[8px]">{label}</p>
      <div className="flex items-start gap-2.5">
        {Icon && <Icon size={14} className="text-stone-300 mt-1 print:hidden" />}
        <p className="text-sm font-bold text-church-dark leading-relaxed print:text-xs">{displayValue}</p>
      </div>
    </div>
  );
}

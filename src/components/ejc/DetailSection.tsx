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
      "bg-white p-6 rounded-2xl border border-stone-100 shadow-sm print:shadow-none print:border-stone-200 print:p-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-6 border-b border-stone-50 pb-4 print:mb-4 print:pb-2">
        <div className="p-2 bg-stone-50 rounded-lg text-stone-900 print:p-0 print:bg-transparent">
          <Icon size={20} className="print:w-4 print:h-4" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 uppercase tracking-tight print:text-sm">{title}</h3>
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
    <div className={cn("space-y-1", fullWidth && "col-span-full")}>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest print:text-[8px]">{label}</p>
      <div className="flex items-start gap-2">
        {Icon && <Icon size={14} className="text-stone-400 mt-0.5 print:hidden" />}
        <p className="text-sm font-medium text-stone-800 leading-tight print:text-xs">{displayValue}</p>
      </div>
    </div>
  );
}

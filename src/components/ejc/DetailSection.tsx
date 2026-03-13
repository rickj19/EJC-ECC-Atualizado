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
      "institutional-card p-8 print:p-6 bg-white shadow-xl shadow-church-dark/5 border border-church-border/20 rounded-3xl",
      className
    )}>
      <div className="flex items-center gap-4 mb-8 border-b border-church-border/10 pb-6 print:mb-4 print:pb-3">
        <div className="w-10 h-10 bg-church-bg rounded-xl flex items-center justify-center text-church-gold print:hidden">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-display font-bold text-church-dark tracking-tight uppercase print:text-base">{title}</h3>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
    <div className={cn("space-y-2", fullWidth && "col-span-full")}>
      <p className="text-[10px] font-bold text-church-brown/40 uppercase tracking-widest">{label}</p>
      <div className="flex items-start gap-3">
        {Icon && <Icon size={16} strokeWidth={1.5} className="text-church-gold/40 mt-0.5 print:hidden shrink-0" />}
        <p className="text-base font-medium text-church-dark leading-relaxed print:text-sm">{displayValue}</p>
      </div>
    </div>
  );
}

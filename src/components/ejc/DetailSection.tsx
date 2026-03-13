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
      "paper-card p-12 print:p-8 relative overflow-hidden",
      className
    )}>
      {/* Subtle background icon */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 text-church-bg/10 pointer-events-none">
        <Icon size={160} strokeWidth={0.5} />
      </div>

      <div className="flex items-center gap-6 mb-12 border-b border-church-border/30 pb-8 print:mb-6 print:pb-3 relative z-10">
        <div className="w-14 h-14 bg-church-bg/50 rounded-2xl text-church-gold flex items-center justify-center border border-church-border/30 shadow-inner print:w-8 print:h-8 print:bg-transparent print:border-none print:shadow-none">
          <Icon size={28} strokeWidth={1} className="print:w-5 print:h-5" />
        </div>
        <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight print:text-xl">{title}</h3>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
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
  const displayValue = value === true ? 'Sim' : value === false ? 'Não' : value || 'Não informado';
  
  return (
    <div className={cn("space-y-3", fullWidth && "col-span-full")}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-church-gold/30" />
        <p className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] print:text-[9px]">{label}</p>
      </div>
      <div className="flex items-start gap-4 pl-4">
        {Icon && <Icon size={18} strokeWidth={1} className="text-stone-300 mt-1 print:hidden shrink-0" />}
        <p className="text-lg font-serif font-bold text-church-dark leading-snug print:text-base">{displayValue}</p>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import { ArrowLeft, Edit2, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../lib/supabase/auth-context';

interface JovemDetailActionsProps {
  jovemId: string;
}

export function JovemDetailActions({ jovemId }: JovemDetailActionsProps) {
  const navigate = useNavigate();
  const { role, hasPermission } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <button
        onClick={() => navigate('/ejc/jovens')}
        className="flex items-center gap-2 text-stone-400 hover:text-church-gold transition-all font-bold uppercase tracking-widest text-[10px] group"
      >
        <ArrowLeft size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
        Retornar
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-church-border/40 text-stone-600 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all shadow-sm active:scale-95"
        >
          <Printer size={16} strokeWidth={1.5} />
          Imprimir
        </button>
        {hasPermission('can_edit_jovens') && (
          <button
            type="button"
            onClick={() => navigate(`/ejc/jovens/editar/${jovemId}`)}
            className="institutional-button-primary"
          >
            <Edit2 size={16} strokeWidth={1.5} />
            Editar
          </button>
        )}
      </div>
    </div>
  );
}

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 print:hidden">
      <button
        onClick={() => navigate('/ejc/jovens')}
        className="flex items-center gap-3 text-stone-400 hover:text-church-gold transition-all font-black uppercase tracking-[0.3em] text-[11px] group"
      >
        <ArrowLeft size={20} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
        Retornar ao Arquivo
      </button>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-3 px-8 py-4 bg-white border border-church-border text-church-dark rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 transition-all shadow-sm active:scale-95"
        >
          <Printer size={20} strokeWidth={1.5} />
          Imprimir Registro
        </button>
        {hasPermission('can_edit_jovens') && (
          <button
            type="button"
            onClick={() => navigate(`/ejc/jovens/editar/${jovemId}`)}
            className="institutional-button-primary px-10 py-4"
          >
            <Edit2 size={20} strokeWidth={1.5} />
            Retificar Dados
          </button>
        )}
      </div>
    </div>
  );
}

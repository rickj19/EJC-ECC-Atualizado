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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
      <button
        onClick={() => navigate('/ejc/jovens')}
        className="flex items-center gap-3 text-stone-400 hover:text-church-dark transition-all font-black uppercase tracking-[0.2em] text-[10px]"
      >
        <ArrowLeft size={18} />
        Retornar ao Arquivo
      </button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-church-border text-church-dark rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all shadow-sm active:scale-95"
        >
          <Printer size={18} />
          Imprimir Registro
        </button>
        {hasPermission('can_edit_jovens') && (
          <button
            type="button"
            onClick={() => navigate(`/ejc/jovens/editar/${jovemId}`)}
            className="flex items-center gap-3 px-8 py-3 bg-church-brown text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-church-dark transition-all shadow-xl shadow-church-brown/20 active:scale-95"
          >
            <Edit2 size={18} />
            Retificar Dados
          </button>
        )}
      </div>
    </div>
  );
}

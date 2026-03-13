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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden mb-10">
      <button
        onClick={() => navigate('/ejc/jovens')}
        className="flex items-center gap-3 text-church-brown/40 hover:text-church-brown transition-all font-bold uppercase tracking-[0.3em] text-[10px] group"
      >
        <div className="w-8 h-8 rounded-full border border-church-border/30 flex items-center justify-center group-hover:border-church-brown/30 transition-colors">
          <ArrowLeft size={14} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        Retornar ao Arquivo
      </button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-church-border/30 text-church-brown rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-church-bg transition-all shadow-lg shadow-church-dark/5 active:scale-95"
        >
          <Printer size={16} strokeWidth={2} className="text-church-gold" />
          Gerar Documento
        </button>
        {hasPermission('can_edit_jovens') && (
          <button
            type="button"
            onClick={() => navigate(`/ejc/jovens/editar/${jovemId}`)}
            className="institutional-button-primary px-8 py-3 rounded-2xl shadow-xl shadow-church-brown/20"
          >
            <Edit2 size={16} strokeWidth={2} />
            Editar Registro
          </button>
        )}
      </div>
    </div>
  );
}

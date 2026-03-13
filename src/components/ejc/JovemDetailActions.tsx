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
  const { role } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <button
        onClick={() => navigate('/ejc/jovens')}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Voltar para Lista
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-all shadow-sm active:scale-95"
        >
          <Printer size={18} />
          Imprimir Ficha
        </button>
        {role !== 'participante' && (
          <button
            type="button"
            onClick={() => navigate(`/ejc/jovens/editar/${jovemId}`)}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md active:scale-95"
          >
            <Edit2 size={18} />
            Editar Cadastro
          </button>
        )}
      </div>
    </div>
  );
}

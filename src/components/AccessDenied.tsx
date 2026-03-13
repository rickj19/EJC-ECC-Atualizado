import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  message?: string;
  permission?: string;
}

export function AccessDenied({ 
  message = 'Você não tem permissão para acessar esta página.', 
  permission 
}: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-black text-stone-800 uppercase tracking-tight mb-2">
        Acesso Negado
      </h2>
      <p className="text-stone-500 max-w-xs mx-auto">
        {message}
        {permission && (
          <span className="block mt-2 text-xs font-mono bg-stone-100 p-1 rounded">
            Requer: {permission}
          </span>
        )}
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all active:scale-95"
      >
        <ArrowLeft size={18} />
        Voltar
      </button>
    </div>
  );
}

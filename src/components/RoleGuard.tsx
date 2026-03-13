import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase/auth-context';
import { UserRole } from '../types/auth';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-stone-800 uppercase tracking-tight mb-2">
          Acesso Negado
        </h2>
        <p className="text-stone-500 max-w-xs mx-auto">
          Seu perfil de <strong>{role || 'visitante'}</strong> não tem permissão para acessar esta funcionalidade.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="mt-8 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all active:scale-95"
        >
          Voltar
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

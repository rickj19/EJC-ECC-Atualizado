import React from 'react';
import { useAuth } from '../lib/supabase/auth-context';
import { Profile } from '../types/auth';
import { ShieldAlert, Loader2 } from 'lucide-react';

type Permission = keyof Pick<Profile, 'can_view_jovens' | 'can_edit_jovens' | 'can_create_users' | 'can_manage_permissions'>;

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { hasPermission, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-stone-800 uppercase tracking-tight mb-2">
          Acesso Restrito
        </h2>
        <p className="text-stone-500 max-w-xs mx-auto">
          Você não tem a permissão específica (<strong>{permission}</strong>) necessária para acessar esta funcionalidade.
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

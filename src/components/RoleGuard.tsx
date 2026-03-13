import React from 'react';
import { useAuth } from '../lib/supabase/auth-context';
import { UserRole } from '../types/auth';
import { LoadingScreen } from './LoadingScreen';
import { AccessDenied } from './AccessDenied';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Verificando acesso..." />;
  }

  if (!role || !allowedRoles.includes(role)) {
    if (fallback) return <>{fallback}</>;
    return (
      <AccessDenied 
        message={`Seu perfil de ${role || 'visitante'} não tem permissão para acessar esta funcionalidade.`} 
      />
    );
  }

  return <>{children}</>;
}

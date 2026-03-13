import React from 'react';
import { useAuth } from '../lib/supabase/auth-context';
import { Profile } from '../types/auth';
import { LoadingScreen } from './LoadingScreen';
import { AccessDenied } from './AccessDenied';

type Permission = keyof Pick<Profile, 'can_view_jovens' | 'can_edit_jovens' | 'can_create_users' | 'can_manage_permissions'>;

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { hasPermission, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  if (!hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    return <AccessDenied permission={permission} />;
  }

  return <>{children}</>;
}

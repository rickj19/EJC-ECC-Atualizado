export type UserRole = 'admin' | 'equipe' | 'participante' | 'usuario';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  can_view_jovens: boolean;
  can_edit_jovens: boolean;
  can_create_users: boolean;
  can_manage_permissions: boolean;
  created_at: string;
  updated_at: string;
}

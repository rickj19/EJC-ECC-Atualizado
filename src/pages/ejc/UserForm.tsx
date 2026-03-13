import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Shield, 
  User, 
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { Profile, UserRole } from '../../types/auth';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';

export function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission, refreshProfile } = useAuth();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'usuario' as UserRole,
    can_view_jovens: true,
    can_edit_jovens: false,
    can_create_users: false,
    can_manage_permissions: false,
    password: '' // Only for new users
  });

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          email: data.email,
          full_name: data.full_name || '',
          role: data.role,
          can_view_jovens: data.can_view_jovens,
          can_edit_jovens: data.can_edit_jovens,
          can_create_users: data.can_create_users,
          can_manage_permissions: data.can_manage_permissions,
          password: ''
        });
      }
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      setError('Não foi possível carregar os dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (isEditing) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            can_view_jovens: formData.can_view_jovens,
            can_edit_jovens: formData.can_edit_jovens,
            can_create_users: formData.can_create_users,
            can_manage_permissions: formData.can_manage_permissions,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        // Create new user via signUp
        // Note: This will create the user in auth.users and the trigger should create the profile
        // Then we update the profile with the specific permissions
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('Erro ao criar usuário.');

        // Update the newly created profile with permissions
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: formData.role,
            can_view_jovens: formData.can_view_jovens,
            can_edit_jovens: formData.can_edit_jovens,
            can_create_users: formData.can_create_users,
            can_manage_permissions: formData.can_manage_permissions
          })
          .eq('id', signUpData.user.id);

        if (profileError) throw profileError;
      }

      setSuccess(true);
      setTimeout(() => navigate('/ejc/usuarios'), 2000);
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      setError(err.message || 'Ocorreu um erro ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-stone-500 font-medium">Carregando dados do usuário...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/ejc/usuarios')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Voltar para Lista
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-xl overflow-hidden">
        <div className="p-8 bg-stone-900 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Shield className="text-emerald-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                {isEditing ? 'Editar Permissões' : 'Novo Usuário'}
              </h1>
              <p className="text-stone-400 text-sm font-medium">
                {isEditing ? `Alterando acessos de ${formData.email}` : 'Cadastre um novo membro na equipe do sistema.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold">Usuário salvo com sucesso! Redirecionando...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  required
                  disabled={isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Senha Inicial</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Perfil (Role)</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              >
                <option value="usuario">Usuário Comum</option>
                <option value="participante">Participante</option>
                <option value="equipe">Equipe</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-stone-100">
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">Permissões Específicas</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PermissionToggle
                label="Visualizar Jovens"
                description="Permite ver a lista e detalhes dos jovens"
                active={formData.can_view_jovens}
                onChange={(val) => setFormData({ ...formData, can_view_jovens: val })}
              />
              <PermissionToggle
                label="Editar Jovens"
                description="Permite alterar dados e excluir cadastros"
                active={formData.can_edit_jovens}
                onChange={(val) => setFormData({ ...formData, can_edit_jovens: val })}
              />
              <PermissionToggle
                label="Criar Usuários"
                description="Permite cadastrar novos membros no sistema"
                active={formData.can_create_users}
                onChange={(val) => setFormData({ ...formData, can_create_users: val })}
              />
              <PermissionToggle
                label="Gerenciar Permissões"
                description="Permite alterar níveis de acesso de outros"
                active={formData.can_manage_permissions}
                onChange={(val) => setFormData({ ...formData, can_manage_permissions: val })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PermissionToggle({ label, description, active, onChange }: { 
  label: string, 
  description: string, 
  active: boolean, 
  onChange: (val: boolean) => void 
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
        active 
          ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200" 
          : "bg-stone-50 border-stone-200 hover:border-stone-300"
      )}
    >
      <div className="pr-4">
        <p className={cn("text-sm font-bold transition-colors", active ? "text-emerald-900" : "text-stone-700")}>
          {label}
        </p>
        <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
          {description}
        </p>
      </div>
      <div className={cn(
        "w-10 h-6 rounded-full relative transition-colors shrink-0",
        active ? "bg-emerald-500" : "bg-stone-300"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
          active ? "left-5" : "left-1"
        )} />
      </div>
    </button>
  );
}

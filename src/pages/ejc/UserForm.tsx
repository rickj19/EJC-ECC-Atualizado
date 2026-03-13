import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Shield, 
  User, 
  Mail,
  Check,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { Profile, UserRole } from '../../types/auth';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';

export function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, refreshProfile } = useAuth();
  
  const isViewing = location.pathname.includes('/visualizar/');
  const isEditing = !!id && !isViewing;
  const isCreating = !id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    nome: '',
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
          nome: data.nome || '',
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
        console.log('[UserForm] Updating user:', id);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            role: formData.role,
            can_view_jovens: formData.can_view_jovens,
            can_edit_jovens: formData.can_edit_jovens,
            can_create_users: formData.can_create_users,
            can_manage_permissions: formData.can_manage_permissions,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (updateError) throw updateError;
        console.log('[UserForm] User updated successfully');
      } else {
        // Create new user via Supabase Edge Function
        console.log('[UserForm] Creating new user via Edge Function:', formData.email);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch('/functions/v1/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            permissions: {
              can_view_jovens: formData.can_view_jovens,
              can_edit_jovens: formData.can_edit_jovens,
              can_create_users: formData.can_create_users,
              can_manage_permissions: formData.can_manage_permissions,
            }
          }),
        });

        let result;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const errorText = await response.text();
          console.error('[UserForm] Non-JSON response from server:', errorText);
          throw new Error('O servidor retornou uma resposta inválida (não JSON).');
        }

        if (!response.ok) {
          console.error('[UserForm] Server error:', result.error);
          throw new Error(result.error || 'Erro ao criar usuário no servidor.');
        }
        
        console.log('[UserForm] User created successfully:', result.user?.id);
      }

      setSuccess(true);
      // Wait a bit to show success message before navigating
      setTimeout(() => {
        navigate('/ejc/usuarios');
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      setError(err.message || 'Ocorreu um erro ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-church-gold" size={32} strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-church-dark font-display text-xl">Consultando Arquivo</p>
          <p className="text-church-gold text-[9px] font-bold uppercase tracking-widest mt-1">Localizando prontuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/ejc/usuarios')}
          className="flex items-center gap-2 text-stone-400 hover:text-church-gold transition-all font-bold uppercase tracking-widest text-[9px] group"
        >
          <ArrowLeft size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
          Retornar à Chancelaria
        </button>
      </div>

      <div className="bg-white rounded-xl border border-church-border/30 shadow-sm overflow-hidden">
        <div className="p-8 bg-church-dark text-white">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <Shield className="text-church-gold" size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-display tracking-tight">
                {isViewing ? 'Registro de Oficial' : isEditing ? 'Retificação de Atribuições' : 'Nomeação de Oficial'}
              </h1>
              <p className="text-church-beige/60 text-sm mt-1 font-serif italic">
                {isViewing ? `Prontuário de ${formData.email}` : isEditing ? `Ajustando autoridade de ${formData.email}` : 'Iniciando processo de nomeação administrativa.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} strokeWidth={1.5} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-church-green/10 border border-church-green/20 rounded-lg flex items-center gap-3 text-church-green animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={20} strokeWidth={1.5} />
              <p className="text-sm font-bold">
                {isEditing ? 'Registro retificado com sucesso.' : 'Novo oficial nomeado com sucesso.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-church-gold uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-church-gold/30" size={18} strokeWidth={1.5} />
                <input
                  type="text"
                  required
                  disabled={isViewing}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="institutional-input pl-11 h-11"
                  placeholder="Ex: João da Silva"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-church-gold uppercase tracking-widest ml-1">E-mail (ID)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-church-gold/30" size={18} strokeWidth={1.5} />
                <input
                  type="email"
                  required
                  disabled={isViewing || isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="institutional-input pl-11 h-11"
                  placeholder="oficial@paroquia.org"
                />
              </div>
            </div>

            {isCreating && (
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-church-gold uppercase tracking-widest ml-1">Senha Inicial</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="institutional-input h-11"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-church-gold uppercase tracking-widest ml-1">Função Hierárquica</label>
              <div className="relative">
                <select
                  disabled={isViewing}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="institutional-input appearance-none pr-11 h-11"
                >
                  <option value="usuario">Colaborador</option>
                  <option value="participante">Participante</option>
                  <option value="equipe">Equipe</option>
                  <option value="admin">Administrador</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-church-gold/40">
                  <Shield size={16} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-church-border/20">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-church-bg/5 rounded-lg text-church-gold">
                <Shield size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-[10px] font-bold text-church-dark uppercase tracking-widest">Atribuições Administrativas</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PermissionToggle
                label="Consulta"
                description="Visualização do arquivo de jovens"
                active={formData.can_view_jovens}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_view_jovens: val })}
              />
              <PermissionToggle
                label="Retificação"
                description="Alteração e exclusão de cadastros"
                active={formData.can_edit_jovens}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_edit_jovens: val })}
              />
              <PermissionToggle
                label="Nomeação"
                description="Cadastro de novos membros"
                active={formData.can_create_users}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_create_users: val })}
              />
              <PermissionToggle
                label="Chancelaria"
                description="Gestão de permissões"
                active={formData.can_manage_permissions}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_manage_permissions: val })}
              />
            </div>
          </div>

          {!isViewing && (
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                disabled={saving}
                className="institutional-button-primary px-10 h-12"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} strokeWidth={1.5} />
                ) : (
                  <Save size={18} strokeWidth={1.5} />
                )}
                {saving ? 'Processando...' : 'Confirmar Registro'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function PermissionToggle({ label, description, active, disabled, onChange }: { 
  label: string, 
  description: string, 
  active: boolean, 
  disabled?: boolean,
  onChange: (val: boolean) => void 
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!active)}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all text-left group disabled:opacity-50",
        active 
          ? "bg-church-brown/5 border-church-brown/20" 
          : "bg-white border-church-border/30 hover:border-church-gold/30"
      )}
    >
      <div className="pr-4">
        <p className={cn(
          "text-sm font-bold transition-colors tracking-tight", 
          active ? "text-church-dark" : "text-stone-400 group-hover:text-church-brown"
        )}>
          {label}
        </p>
        <p className="text-[11px] font-serif italic text-stone-500 mt-0.5">
          {description}
        </p>
      </div>
      <div className={cn(
        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out",
        active ? "bg-church-brown" : "bg-stone-200"
      )}>
        <span
          className={cn(
            "pointer-events-none flex items-center justify-center h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out",
            active ? "translate-x-5" : "translate-x-0"
          )}
        >
          {active ? (
            <Check className="w-2.5 h-2.5 text-church-brown" strokeWidth={4} />
          ) : (
            <X className="w-2.5 h-2.5 text-stone-300" strokeWidth={4} />
          )}
        </span>
      </div>
    </button>
  );
}

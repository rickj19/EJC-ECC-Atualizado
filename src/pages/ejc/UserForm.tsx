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
      <div className="flex flex-col items-center justify-center py-40 gap-8">
        <Loader2 className="animate-spin text-church-gold" size={56} strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-church-dark font-display text-3xl font-bold tracking-tight">Acessando Arquivo</p>
          <p className="text-church-gold text-[11px] font-black uppercase tracking-[0.3em] mt-3">Localizando prontuário do oficial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/ejc/usuarios')}
          className="flex items-center gap-3 text-stone-400 hover:text-church-gold transition-all font-black uppercase tracking-[0.3em] text-[11px] group"
        >
          <ArrowLeft size={20} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
          Retornar à Chancelaria
        </button>
      </div>

      <div className="paper-card overflow-hidden">
        <div className="p-12 bg-church-dark text-white relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
              <Shield className="text-church-gold" size={40} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight">
                {isViewing ? 'Registro de Oficial' : isEditing ? 'Retificação de Atribuições' : 'Nomeação de Novo Oficial'}
              </h1>
              <p className="text-church-beige/60 text-lg mt-2 font-serif italic">
                {isViewing ? `Visualizando prontuário administrativo de ${formData.email}` : isEditing ? `Ajustando níveis de autoridade de ${formData.email}` : 'Iniciando processo de nomeação para a equipe administrativa.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-5 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={28} strokeWidth={1.5} />
              <p className="text-base font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-6 bg-church-green/10 border border-church-green/20 rounded-2xl flex items-center gap-5 text-church-green animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={28} strokeWidth={1.5} />
              <p className="text-base font-bold">
                {isEditing ? 'Registro retificado com sucesso no sistema.' : 'Novo oficial nomeado com sucesso. Redirecionando aos arquivos...'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Nome Completo do Oficial</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-church-gold/30" size={20} strokeWidth={1.5} />
                <input
                  type="text"
                  required
                  disabled={isViewing}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="institutional-input pl-14"
                  placeholder="Ex: Sr. João da Silva"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Endereço Eletrônico (ID)</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-church-gold/30" size={20} strokeWidth={1.5} />
                <input
                  type="email"
                  required
                  disabled={isViewing || isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="institutional-input pl-14"
                  placeholder="oficial@paroquia.org"
                />
              </div>
            </div>

            {isCreating && (
              <div className="space-y-3">
                <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Senha de Acesso Inicial</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="institutional-input"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Função Hierárquica (Role)</label>
              <div className="relative">
                <select
                  disabled={isViewing}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="institutional-input appearance-none pr-12"
                >
                  <option value="usuario">Colaborador Comum</option>
                  <option value="participante">Participante Registrado</option>
                  <option value="equipe">Membro da Equipe</option>
                  <option value="admin">Administrador / Chanceler</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-church-gold/40">
                  <Shield size={18} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-12 border-t border-church-border/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-church-bg rounded-lg text-church-gold">
                <Shield size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-[12px] font-black text-church-dark uppercase tracking-[0.3em]">Atribuições e Autoridades Administrativas</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PermissionToggle
                label="Consulta de Registros"
                description="Autoriza a visualização do arquivo de jovens"
                active={formData.can_view_jovens}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_view_jovens: val })}
              />
              <PermissionToggle
                label="Retificação de Dados"
                description="Autoriza a alteração e exclusão de cadastros"
                active={formData.can_edit_jovens}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_edit_jovens: val })}
              />
              <PermissionToggle
                label="Nomeação de Oficiais"
                description="Autoriza o cadastro de novos membros na equipe"
                active={formData.can_create_users}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_create_users: val })}
              />
              <PermissionToggle
                label="Chancelaria de Acessos"
                description="Autoriza a gestão de permissões de outros oficiais"
                active={formData.can_manage_permissions}
                disabled={isViewing}
                onChange={(val) => setFormData({ ...formData, can_manage_permissions: val })}
              />
            </div>
          </div>

          {!isViewing && (
            <div className="flex justify-end pt-12">
              <button
                type="submit"
                disabled={saving}
                className="institutional-button-primary px-16 py-5"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} strokeWidth={1.5} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Save size={20} strokeWidth={1.5} />
                    Confirmar Registro
                  </>
                )}
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
        "flex items-center justify-between p-8 rounded border transition-all text-left group disabled:opacity-50 relative overflow-hidden",
        active 
          ? "bg-church-brown/5 border-church-brown/20 shadow-lg" 
          : "bg-white border-church-border hover:border-church-gold/30"
      )}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-church-brown" />
      )}
      <div className="pr-10">
        <p className={cn(
          "text-xl font-display font-bold transition-colors tracking-tight", 
          active ? "text-church-dark" : "text-stone-400 group-hover:text-church-brown"
        )}>
          {label}
        </p>
        <p className="text-base font-serif italic text-stone-500 leading-relaxed mt-2">
          {description}
        </p>
      </div>
      <div className={cn(
        "relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out",
        active ? "bg-church-brown" : "bg-stone-200"
      )}>
        <span
          className={cn(
            "pointer-events-none flex items-center justify-center h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
            active ? "translate-x-10" : "translate-x-0"
          )}
        >
          {active ? (
            <Check className="w-5 h-5 text-church-brown" strokeWidth={3} />
          ) : (
            <X className="w-5 h-5 text-stone-300" strokeWidth={3} />
          )}
        </span>
      </div>
    </button>
  );
}

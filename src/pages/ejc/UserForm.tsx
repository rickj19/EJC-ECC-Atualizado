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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-church-gold" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Consultando Arquivos do Oficial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/ejc/usuarios')}
          className="flex items-center gap-3 text-stone-400 hover:text-church-dark transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft size={16} />
          Retornar à Chancelaria
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-church-border shadow-2xl overflow-hidden">
        <div className="p-10 bg-church-dark text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <Shield className="text-church-gold" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">
                {isViewing ? 'Registro de Oficial' : isEditing ? 'Retificação de Atribuições' : 'Nomeação de Novo Oficial'}
              </h1>
              <p className="text-stone-400 text-sm mt-1 font-medium italic opacity-80">
                {isViewing ? `Visualizando prontuário administrativo de ${formData.email}` : isEditing ? `Ajustando níveis de autoridade de ${formData.email}` : 'Iniciando processo de nomeação para a equipe administrativa.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {error && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={24} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-5 bg-church-green/10 border border-church-green/20 rounded-2xl flex items-center gap-4 text-church-green animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={24} />
              <p className="text-sm font-bold">
                {isEditing ? 'Registro retificado com sucesso no sistema.' : 'Novo oficial nomeado com sucesso. Redirecionando aos arquivos...'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Nome Completo do Oficial</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input
                  type="text"
                  required
                  disabled={isViewing}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50/50 border border-church-border rounded-xl focus:outline-none focus:ring-2 focus:ring-church-gold/20 focus:border-church-gold transition-all font-medium text-church-dark placeholder:text-stone-300 disabled:opacity-70"
                  placeholder="Ex: Sr. João da Silva"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Endereço Eletrônico (ID)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input
                  type="email"
                  required
                  disabled={isViewing || isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50/50 border border-church-border rounded-xl focus:outline-none focus:ring-2 focus:ring-church-gold/20 focus:border-church-gold transition-all font-medium text-church-dark placeholder:text-stone-300 disabled:opacity-70"
                  placeholder="oficial@paroquia.org"
                />
              </div>
            </div>

            {isCreating && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Senha de Acesso Inicial</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 bg-stone-50/50 border border-church-border rounded-xl focus:outline-none focus:ring-2 focus:ring-church-gold/20 focus:border-church-gold transition-all font-medium text-church-dark placeholder:text-stone-300"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Função Hierárquica (Role)</label>
              <select
                disabled={isViewing}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-5 py-4 bg-stone-50/50 border border-church-border rounded-xl focus:outline-none focus:ring-2 focus:ring-church-gold/20 focus:border-church-gold transition-all font-medium text-church-dark disabled:opacity-70 appearance-none"
              >
                <option value="usuario">Colaborador Comum</option>
                <option value="participante">Participante Registrado</option>
                <option value="equipe">Membro da Equipe</option>
                <option value="admin">Administrador / Chanceler</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-church-border">
            <div className="flex items-center gap-3">
              <Shield className="text-church-gold" size={18} />
              <h3 className="text-[11px] font-black text-church-dark uppercase tracking-[0.2em]">Atribuições e Autoridades Administrativas</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <div className="flex justify-end pt-10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 px-12 py-4 bg-church-brown text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-church-dark transition-all shadow-2xl shadow-church-brown/20 active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
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
        "flex items-center justify-between p-5 rounded-2xl border transition-all text-left group disabled:opacity-50",
        active 
          ? "bg-church-beige-light/30 border-church-gold/30 ring-1 ring-church-gold/20" 
          : "bg-stone-50/50 border-church-border hover:border-church-gold/30"
      )}
    >
      <div className="pr-4">
        <p className={cn("text-xs font-bold uppercase tracking-wider transition-colors", active ? "text-church-dark" : "text-stone-500")}>
          {label}
        </p>
        <p className="text-[9px] text-stone-400 font-medium leading-tight mt-1 uppercase tracking-wide">
          {description}
        </p>
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full relative transition-colors shrink-0 border border-transparent",
        active ? "bg-church-green" : "bg-stone-200"
      )}>
        <div className={cn(
          "absolute top-1 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-md",
          active ? "left-6" : "left-1"
        )} />
      </div>
    </button>
  );
}

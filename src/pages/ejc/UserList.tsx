import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  MoreHorizontal,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  X,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { Profile } from '../../types/auth';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';

export function UserList() {
  const navigate = useNavigate();
  const { hasPermission, role: currentUserRole } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      console.log('[UserList] Deleting user:', deleteId);
      
      const response = await fetch(`/api/admin/delete-user/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erro ao excluir usuário no servidor.');
      }

      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
      console.log('[UserList] User deleted successfully');
    } catch (err: any) {
      console.error('[UserList] Error deleting user:', err);
      alert(err.message || 'Erro ao excluir usuário.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PermissionBadge = ({ active, label }: { active: boolean, label: string }) => (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider",
      active ? "bg-church-green/10 text-church-green border border-church-green/20" : "bg-stone-50 text-stone-300 border border-stone-100"
    )}>
      {active ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
      {label}
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-display font-bold text-church-dark tracking-tight">Secretaria e Chancelaria</h1>
          <p className="text-stone-500 mt-2 font-serif italic text-lg">Gestão de oficiais, colaboradores e níveis de acesso administrativo paroquial.</p>
        </div>
        
        {hasPermission('can_create_users') && (
          <button
            onClick={() => navigate('/ejc/usuarios/novo')}
            className="institutional-button-primary"
          >
            <UserPlus size={18} strokeWidth={1.5} />
            Nomear Novo Oficial
          </button>
        )}
      </div>

      {/* Filtros e Busca - Institutional Style */}
      <div className="paper-card p-6 flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-church-gold/40" size={20} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou endereço eletrônico nos arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="institutional-input pl-14"
          />
        </div>
      </div>

      {/* Tabela de Usuários - Institutional Ledger */}
      <div className="paper-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-church-bg/10 border-b border-church-border/30">
                <th className="px-10 py-6 text-[10px] font-black text-church-gold uppercase tracking-[0.3em]">Oficial / Colaborador</th>
                <th className="px-10 py-6 text-[10px] font-black text-church-gold uppercase tracking-[0.3em]">Função Canônica</th>
                <th className="px-10 py-6 text-[10px] font-black text-church-gold uppercase tracking-[0.3em]">Atribuições de Acesso</th>
                <th className="px-10 py-6 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-church-border/20">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-church-gold">
                      <Loader2 className="animate-spin" size={40} strokeWidth={1.5} />
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">Consultando Arquivos da Chancelaria...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-church-bg/5 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded bg-church-beige-light flex items-center justify-center text-church-dark font-display text-2xl font-bold overflow-hidden border border-church-border/30 shadow-inner">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.nome || ''} className="w-full h-full object-cover" />
                          ) : (
                            user.nome?.charAt(0) || user.email.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-display font-bold text-church-dark leading-tight">{user.nome || 'Oficial não identificado'}</p>
                          <p className="text-sm text-stone-400 font-serif italic mt-1">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className={cn(
                        "inline-flex items-center gap-2.5 px-4 py-2 rounded text-[10px] font-black uppercase tracking-[0.2em]",
                        user.role === 'admin' ? "bg-red-50 text-red-700 border border-red-100" : 
                        user.role === 'equipe' ? "bg-church-brown/5 text-church-brown border border-church-brown/10" : 
                        "bg-stone-50 text-stone-500 border border-stone-100"
                      )}>
                        {user.role === 'admin' ? <ShieldCheck size={16} strokeWidth={1.5} /> : 
                         user.role === 'equipe' ? <Shield size={16} strokeWidth={1.5} /> : 
                         <ShieldAlert size={16} strokeWidth={1.5} />}
                        {user.role === 'admin' ? 'Administrador' : user.role === 'equipe' ? 'Equipe de Apoio' : 'Participante'}
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-wrap gap-3">
                        <PermissionBadge active={user.can_view_jovens} label="Consulta" />
                        <PermissionBadge active={user.can_edit_jovens} label="Retificação" />
                        <PermissionBadge active={user.can_create_users} label="Nomeação" />
                        <PermissionBadge active={user.can_manage_permissions} label="Chancelaria" />
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/ejc/usuarios/visualizar/${user.id}`)}
                          className="p-3 text-stone-400 hover:text-church-dark hover:bg-stone-100 rounded border border-transparent hover:border-church-border transition-all"
                          title="Visualizar Prontuário"
                        >
                          <Eye size={20} strokeWidth={1.5} />
                        </button>
                        {hasPermission('can_manage_permissions') && (
                          <button
                            onClick={() => navigate(`/ejc/usuarios/editar/${user.id}`)}
                            className="p-3 text-stone-400 hover:text-church-gold hover:bg-church-gold/5 rounded border border-transparent hover:border-church-gold/20 transition-all"
                            title="Retificar Atribuições"
                          >
                            <Edit2 size={20} strokeWidth={1.5} />
                          </button>
                        )}
                        {currentUserRole === 'admin' && (
                          <button
                            onClick={() => setDeleteId(user.id)}
                            className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"
                            title="Revogar Nomeação"
                          >
                            <Trash2 size={20} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-stone-300">
                      <AlertCircle size={56} strokeWidth={1} />
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">Nenhum oficial localizado nos registros paroquiais.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão - Institutional Style */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-church-dark/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-white rounded w-full max-w-lg p-12 shadow-2xl border border-church-border animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-8 mb-12">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded flex items-center justify-center border border-red-100 shadow-inner">
                <AlertCircle size={48} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-4xl font-display font-bold text-church-dark tracking-tight">Revogar Nomeação?</h3>
                <p className="text-lg font-serif italic text-stone-500 mt-4 leading-relaxed">
                  Esta ação removerá permanentemente o oficial dos registros administrativos desta secretaria. O acesso técnico deve ser revogado manualmente no console central da chancelaria.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-12 py-4 text-stone-400 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 rounded transition-all border border-transparent hover:border-stone-200"
              >
                Manter Registro
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full sm:w-auto px-12 py-4 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} strokeWidth={1.5} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} strokeWidth={1.5} />
                    Confirmar Revogação
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

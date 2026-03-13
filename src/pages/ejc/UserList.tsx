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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-church-dark">Secretaria e Chancelaria</h1>
          <p className="text-stone-500 mt-1">Gestão de oficiais, colaboradores e níveis de acesso administrativo.</p>
        </div>
        
        {hasPermission('can_create_users') && (
          <button
            onClick={() => navigate('/ejc/usuarios/novo')}
            className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-church-brown text-white font-black uppercase tracking-widest text-[10px] hover:bg-church-dark transition-all shadow-xl shadow-church-brown/20 active:scale-95"
          >
            <UserPlus size={18} />
            Nomear Novo Oficial
          </button>
        )}
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-5 rounded-2xl border border-church-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou endereço eletrônico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-stone-50/50 border border-church-border rounded-xl focus:outline-none focus:ring-2 focus:ring-church-gold/20 focus:border-church-gold transition-all text-church-dark placeholder:text-stone-300"
          />
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-2xl border border-church-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-church-border">
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Oficial / Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Função (Role)</th>
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Atribuições</th>
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-church-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-church-gold">
                      <Loader2 className="animate-spin" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Consultando Arquivos...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-church-beige-light flex items-center justify-center text-church-dark font-serif text-xl font-bold overflow-hidden border border-church-border shadow-sm">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.nome || ''} className="w-full h-full object-cover" />
                          ) : (
                            user.nome?.charAt(0) || user.email.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-church-dark">{user.nome || 'Oficial não identificado'}</p>
                          <p className="text-xs text-stone-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        user.role === 'admin' ? "bg-red-50 text-red-700 border border-red-100" : 
                        user.role === 'equipe' ? "bg-church-brown/10 text-church-brown border border-church-brown/20" : 
                        "bg-stone-100 text-stone-500 border border-stone-200"
                      )}>
                        {user.role === 'admin' ? <ShieldCheck size={14} /> : 
                         user.role === 'equipe' ? <Shield size={14} /> : 
                         <ShieldAlert size={14} />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2">
                        <PermissionBadge active={user.can_view_jovens} label="Consulta" />
                        <PermissionBadge active={user.can_edit_jovens} label="Retificação" />
                        <PermissionBadge active={user.can_create_users} label="Nomeação" />
                        <PermissionBadge active={user.can_manage_permissions} label="Chancelaria" />
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/ejc/usuarios/visualizar/${user.id}`)}
                          className="p-2.5 text-stone-400 hover:text-church-dark hover:bg-stone-100 rounded-xl transition-all"
                          title="Visualizar Detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        {hasPermission('can_manage_permissions') && (
                          <button
                            onClick={() => navigate(`/ejc/usuarios/editar/${user.id}`)}
                            className="p-2.5 text-stone-400 hover:text-church-gold hover:bg-church-gold/5 rounded-xl transition-all"
                            title="Retificar Atribuições"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        {currentUserRole === 'admin' && (
                          <button
                            onClick={() => setDeleteId(user.id)}
                            className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Remover Oficial"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-stone-300">
                      <AlertCircle size={48} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Nenhum oficial localizado nos registros.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-church-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md p-10 shadow-2xl border border-church-border animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6 mb-10">
              <div className="p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                <AlertCircle size={48} />
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold text-church-dark">Revogar Acesso?</h3>
                <p className="text-stone-500 mt-3 leading-relaxed">
                  Esta ação removerá permanentemente o oficial dos registros administrativos. O acesso técnico deve ser revogado manualmente no console central.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-10 py-3.5 text-stone-400 font-black uppercase tracking-widest text-[10px] hover:bg-stone-50 rounded-xl transition-all"
              >
                Manter Registro
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full sm:w-auto px-10 py-3.5 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Confirmar Remoção
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

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
      "flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider",
      active ? "bg-church-green/5 text-church-green border border-church-green/10" : "bg-stone-50 text-stone-300 border border-stone-100"
    )}>
      {active ? <Check size={8} strokeWidth={3} /> : <X size={8} strokeWidth={3} />}
      {label}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-church-dark">Secretaria e Chancelaria</h1>
          <p className="text-stone-500 font-serif italic text-sm">Gestão de oficiais e níveis de acesso administrativo.</p>
        </div>
        
        {hasPermission('can_create_users') && (
          <button
            onClick={() => navigate('/ejc/usuarios/novo')}
            className="institutional-button-primary"
          >
            <UserPlus size={16} strokeWidth={1.5} />
            Nomear Oficial
          </button>
        )}
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-xl border border-church-border/30 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-church-gold/40" size={18} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="institutional-input pl-11 h-11"
          />
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-xl border border-church-border/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-church-bg/5 border-b border-church-border/20">
                <th className="px-6 py-4 text-[9px] font-bold text-church-gold uppercase tracking-widest">Oficial</th>
                <th className="px-6 py-4 text-[9px] font-bold text-church-gold uppercase tracking-widest">Função</th>
                <th className="px-6 py-4 text-[9px] font-bold text-church-gold uppercase tracking-widest">Atribuições</th>
                <th className="px-6 py-4 text-[9px] font-bold text-church-gold uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-church-border/10">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-church-gold">
                      <Loader2 className="animate-spin" size={24} strokeWidth={1.5} />
                      <p className="text-[9px] font-bold uppercase tracking-widest">Consultando arquivos...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-church-bg/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-church-beige-light flex items-center justify-center text-church-dark font-display text-lg font-bold overflow-hidden border border-church-border/20">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.nome || ''} className="w-full h-full object-cover" />
                          ) : (
                            user.nome?.charAt(0) || user.email.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-church-dark leading-tight">{user.nome || 'Oficial'}</p>
                          <p className="text-[11px] text-stone-400 font-serif italic">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider",
                        user.role === 'admin' ? "bg-red-50 text-red-700 border border-red-100" : 
                        user.role === 'equipe' ? "bg-church-brown/5 text-church-brown border border-church-brown/10" : 
                        "bg-stone-50 text-stone-500 border border-stone-100"
                      )}>
                        {user.role === 'admin' ? <ShieldCheck size={12} strokeWidth={1.5} /> : 
                         user.role === 'equipe' ? <Shield size={12} strokeWidth={1.5} /> : 
                         <ShieldAlert size={12} strokeWidth={1.5} />}
                        {user.role === 'admin' ? 'Admin' : user.role === 'equipe' ? 'Equipe' : 'Membro'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <PermissionBadge active={user.can_view_jovens} label="Ver" />
                        <PermissionBadge active={user.can_edit_jovens} label="Editar" />
                        <PermissionBadge active={user.can_create_users} label="Criar" />
                        <PermissionBadge active={user.can_manage_permissions} label="Gestão" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/ejc/usuarios/visualizar/${user.id}`)}
                          className="p-2 text-stone-400 hover:text-church-dark hover:bg-stone-100 rounded-lg transition-all"
                          title="Visualizar"
                        >
                          <Eye size={16} strokeWidth={1.5} />
                        </button>
                        {hasPermission('can_manage_permissions') && (
                          <button
                            onClick={() => navigate(`/ejc/usuarios/editar/${user.id}`)}
                            className="p-2 text-stone-400 hover:text-church-gold hover:bg-church-gold/5 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={16} strokeWidth={1.5} />
                          </button>
                        )}
                        {currentUserRole === 'admin' && (
                          <button
                            onClick={() => setDeleteId(user.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={16} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-stone-300">
                      <AlertCircle size={32} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum oficial localizado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-church-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl border border-church-border/30 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
                <AlertCircle size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-church-dark">Revogar Nomeação?</h3>
                <p className="text-sm font-serif italic text-stone-500 mt-2">
                  Esta ação removerá permanentemente o oficial dos registros administrativos.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-stone-400 font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 rounded-lg transition-all border border-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={14} strokeWidth={1.5} />
                ) : (
                  <Trash2 size={14} strokeWidth={1.5} />
                )}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

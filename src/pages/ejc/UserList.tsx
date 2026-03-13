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
  X
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

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PermissionBadge = ({ active, label }: { active: boolean, label: string }) => (
    <div className={cn(
      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-stone-50 text-stone-400 border border-stone-100"
    )}>
      {active ? <Check size={10} /> : <X size={10} />}
      {label}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight uppercase">Gerenciamento de Usuários</h1>
          <p className="text-stone-500 font-medium">Controle quem acessa o sistema e quais são suas permissões.</p>
        </div>
        
        {hasPermission('can_create_users') && (
          <button
            onClick={() => navigate('/ejc/usuarios/novo')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 active:scale-95"
          >
            <UserPlus size={20} />
            Novo Usuário
          </button>
        )}
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Perfil (Role)</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Permissões</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-stone-400">
                      <Loader2 className="animate-spin" size={32} />
                      <p className="text-sm font-medium">Carregando usuários...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold overflow-hidden border border-stone-200">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.full_name || ''} className="w-full h-full object-cover" />
                          ) : (
                            user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-800">{user.full_name || 'Sem nome'}</p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight",
                        user.role === 'admin' ? "bg-red-50 text-red-700" : 
                        user.role === 'equipe' ? "bg-blue-50 text-blue-700" : 
                        "bg-stone-100 text-stone-600"
                      )}>
                        {user.role === 'admin' ? <ShieldCheck size={14} /> : 
                         user.role === 'equipe' ? <Shield size={14} /> : 
                         <ShieldAlert size={14} />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <PermissionBadge active={user.can_view_jovens} label="Ver Jovens" />
                        <PermissionBadge active={user.can_edit_jovens} label="Editar Jovens" />
                        <PermissionBadge active={user.can_create_users} label="Criar Usuários" />
                        <PermissionBadge active={user.can_manage_permissions} label="Gerir Permissões" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {hasPermission('can_manage_permissions') && (
                          <button
                            onClick={() => navigate(`/ejc/usuarios/editar/${user.id}`)}
                            className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Editar Permissões"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-stone-400">
                      <AlertCircle size={40} />
                      <p className="text-sm font-medium">Nenhum usuário encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

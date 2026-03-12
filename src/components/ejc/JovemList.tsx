import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  Plus, 
  X, 
  AlertCircle,
  Loader2,
  ChevronDown,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { cn } from '../../lib/utils';
import { Jovem } from '../../types/jovem';

export function JovemList() {
  const navigate = useNavigate();
  const [jovens, setJovens] = useState<Jovem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBairro, setFilterBairro] = useState('');
  const [filterSacramento, setFilterSacramento] = useState('');
  const [filterPastoral, setFilterPastoral] = useState('');
  const [filterVivenciou, setFilterVivenciou] = useState<boolean | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Modal de Exclusão
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchJovens();
  }, []);

  const fetchJovens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jovens')
        .select('*')
        .order('nome_completo', { ascending: true });

      if (error) throw error;
      setJovens(data || []);
    } catch (err) {
      console.error('Erro ao buscar jovens:', err);
      setError('Não foi possível carregar a lista de jovens.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('jovens')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setJovens(prev => prev.filter(j => j.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Erro ao excluir jovem:', err);
      alert('Erro ao excluir o registro. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredJovens = useMemo(() => {
    return jovens.filter(j => {
      const matchesSearch = j.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (j.nome_chamado?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesBairro = !filterBairro || j.bairro === filterBairro;
      
      const matchesSacramento = !filterSacramento || j.sacramentos?.includes(filterSacramento);
      
      const matchesPastoral = !filterPastoral || 
                             (j.membro_pastoral && (j.qual_pastoral || '').toLowerCase().includes(filterPastoral.toLowerCase()));
      
      const matchesVivenciou = filterVivenciou === 'all' || j.vivenciou_ejc === filterVivenciou;

      return matchesSearch && matchesBairro && matchesSacramento && matchesPastoral && matchesVivenciou;
    });
  }, [jovens, searchTerm, filterBairro, filterSacramento, filterPastoral, filterVivenciou]);

  const uniqueBairros = useMemo(() => {
    const bairros = jovens.map(j => j.bairro).filter(Boolean);
    return Array.from(new Set(bairros)).sort();
  }, [jovens]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-zinc-900" size={40} />
        <p className="text-zinc-500 font-medium">Carregando jovens...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou apelido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all",
              showFilters 
                ? "bg-zinc-900 border-zinc-900 text-white" 
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            )}
          >
            <Filter size={18} />
            Filtros
            <ChevronDown size={16} className={cn("transition-transform", showFilters && "rotate-180")} />
          </button>
          
          <button
            onClick={() => navigate('/ejc/jovens/novo')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all shadow-sm"
          >
            <Plus size={18} />
            Novo Jovem
          </button>
        </div>
      </div>

      {/* Filtros Expandidos */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bairro</label>
            <select
              value={filterBairro}
              onChange={(e) => setFilterBairro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos os bairros</option>
              {uniqueBairros.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sacramento</label>
            <select
              value={filterSacramento}
              onChange={(e) => setFilterSacramento(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos</option>
              <option value="Batismo">Batismo</option>
              <option value="Eucaristia">Eucaristia</option>
              <option value="Crisma">Crisma</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Vivenciou EJC</label>
            <select
              value={String(filterVivenciou)}
              onChange={(e) => {
                const val = e.target.value;
                setFilterVivenciou(val === 'all' ? 'all' : val === 'true');
              }}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="all">Todos</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pastoral</label>
            <input
              type="text"
              placeholder="Qual pastoral?"
              value={filterPastoral}
              onChange={(e) => setFilterPastoral(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 border-bottom border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Jovem</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Bairro</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">EJC</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredJovens.length > 0 ? (
                filteredJovens.map((jovem) => (
                  <tr key={jovem.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                          {jovem.foto_url ? (
                            <img 
                              src={jovem.foto_url} 
                              alt={jovem.nome_completo} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{jovem.nome_completo}</p>
                          {jovem.nome_chamado && (
                            <p className="text-xs text-zinc-500">"{jovem.nome_chamado}"</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-600">{jovem.contato}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-600">{jovem.bairro || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        jovem.vivenciou_ejc 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-zinc-100 text-zinc-600"
                      )}>
                        {jovem.vivenciou_ejc ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/ejc/jovens/visualizar/${jovem.id}`)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/ejc/jovens/editar/${jovem.id}`)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(jovem.id)}
                          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {/* Mobile Actions */}
                      <div className="md:hidden">
                         <button className="p-2 text-zinc-400">
                           <MoreHorizontal size={20} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <AlertCircle size={40} />
                      <p className="text-sm font-medium">Nenhum jovem encontrado com esses filtros.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold">Excluir Jovem?</h3>
            </div>
            
            <p className="text-zinc-600 mb-6">
              Esta ação não pode ser desfeita. Todos os dados deste jovem serão removidos permanentemente do sistema.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Excluindo...
                  </>
                ) : (
                  'Sim, Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

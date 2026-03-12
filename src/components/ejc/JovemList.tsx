import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Jovem } from '../../types/jovem';
import { jovemService, JovemFilters as JovemFiltersType } from '../../services/jovemService';
import { JovemFilters, JovemFiltersData } from './JovemFilters';
import { JovemTable } from './JovemTable';

export function JovemList() {
  const navigate = useNavigate();
  const [jovens, setJovens] = useState<Jovem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [bairros, setBairros] = useState<string[]>([]);
  
  // Estados de Filtro e Paginação
  const [filters, setFilters] = useState<JovemFiltersData>({
    searchTerm: '',
    bairro: '',
    vivenciou_ejc: 'all',
    pastoral: '',
    sacramento: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'nome_completo' | 'created_at'>('nome_completo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 10;

  // Modal de Exclusão
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJovens = useCallback(async () => {
    try {
      setLoading(true);
      const { data, count } = await jovemService.getJovens({
        ...filters,
        sortBy,
        sortOrder,
        page,
        pageSize
      });
      setJovens(data);
      setTotalCount(count);
    } catch (err) {
      console.error('Erro ao buscar jovens:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder, page]);

  const fetchBairros = async () => {
    try {
      const uniqueBairros = await jovemService.getUniqueBairros();
      setBairros(uniqueBairros);
    } catch (err) {
      console.error('Erro ao buscar bairros:', err);
    }
  };

  useEffect(() => {
    fetchJovens();
  }, [fetchJovens]);

  useEffect(() => {
    fetchBairros();
  }, []);

  const handleSort = (field: 'nome_completo' | 'created_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await jovemService.deleteJovem(deleteId);
      setDeleteId(null);
      fetchJovens();
    } catch (err) {
      console.error('Erro ao excluir jovem:', err);
      alert('Erro ao excluir o registro. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (newFilters: JovemFiltersData) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Jovens Cadastrados</h1>
          <p className="text-sm text-zinc-500">Gerencie a ficha de todos os jovens do EJC.</p>
        </div>
        
        <button
          onClick={() => navigate('/ejc/jovens/novo')}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 active:scale-95"
        >
          <Plus size={20} />
          Novo Cadastro
        </button>
      </div>

      {/* Filtros */}
      <JovemFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        bairros={bairros}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Tabela ou Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-3xl border border-zinc-100 shadow-sm">
          <Loader2 className="animate-spin text-zinc-900" size={48} />
          <div className="text-center">
            <p className="text-zinc-900 font-bold">Buscando jovens...</p>
            <p className="text-zinc-400 text-xs">Isso pode levar alguns segundos.</p>
          </div>
        </div>
      ) : (
        <JovemTable 
          jovens={jovens}
          onView={(id) => navigate(`/ejc/jovens/visualizar/${id}`)}
          onEdit={(id) => navigate(`/ejc/jovens/editar/${id}`)}
          onDelete={(id) => setDeleteId(id)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          page={page}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                <AlertTriangle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Confirmar Exclusão</h3>
                <p className="text-zinc-500 mt-2">
                  Você tem certeza que deseja excluir este jovem? Esta ação removerá todos os dados permanentemente e não pode ser desfeita.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-8 py-3 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    Sim, Excluir
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

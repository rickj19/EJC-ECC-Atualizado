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

import { useAuth } from '../../lib/supabase/auth-context';

export function JovemList() {
  const navigate = useNavigate();
  const { role, hasPermission } = useAuth();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-church-dark">Arquivo de Jovens</h1>
          <p className="text-sm text-stone-500 mt-1">Gestão administrativa dos registros da comunidade.</p>
        </div>
        
        {hasPermission('can_edit_jovens') && (
          <button
            onClick={() => navigate('/ejc/jovens/novo')}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-church-brown text-white font-black uppercase tracking-widest hover:bg-church-dark transition-all shadow-xl shadow-church-brown/20 active:scale-[0.98]"
          >
            <Plus size={20} />
            Novo Registro
          </button>
        )}
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
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-2xl border border-church-border shadow-sm">
          <Loader2 className="animate-spin text-church-brown" size={48} />
          <div className="text-center">
            <p className="text-church-dark font-serif text-xl font-bold">Consultando Arquivos</p>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-black mt-2">Aguarde um momento...</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-church-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-church-border">
            <div className="flex flex-col items-center text-center gap-6 mb-10">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
                <AlertTriangle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-church-dark">Confirmar Exclusão</h3>
                <p className="text-stone-500 mt-3 text-sm leading-relaxed">
                  Esta ação é irreversível e removerá permanentemente o registro do arquivo paroquial. Deseja prosseguir?
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-10 py-4 text-stone-400 font-black uppercase tracking-widest hover:text-church-dark hover:bg-stone-100 rounded-xl transition-all text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 disabled:opacity-50 text-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
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

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
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (newFilters: JovemFiltersData) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-church-dark tracking-tight">Arquivo de Jovens</h1>
          <p className="text-stone-400 text-sm mt-1">Gestão e catalogação dos registros paroquiais.</p>
        </div>
        
        {hasPermission('can_edit_jovens') && (
          <button
            onClick={() => navigate('/ejc/jovens/novo')}
            className="institutional-button-primary"
          >
            <Plus size={18} strokeWidth={1.5} />
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
        <div className="institutional-card flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-church-gold" size={32} strokeWidth={1.5} />
          <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Consultando Arquivos...</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-church-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-church-border/30">
            <div className="flex flex-col items-center text-center gap-6 mb-10">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
                <AlertTriangle size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-church-dark">Confirmar Exclusão</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Deseja remover permanentemente este registro do arquivo paroquial? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-8 py-3 text-stone-400 font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} strokeWidth={1.5} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} strokeWidth={1.5} />
                    Confirmar
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

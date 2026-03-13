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
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-church-gold/30" />
            <p className="text-[10px] text-church-gold uppercase font-bold tracking-[0.4em]">Gestão de Registros</p>
          </div>
          <h1 className="text-6xl font-display font-bold text-church-dark tracking-tighter">Arquivo de Jovens</h1>
          <p className="text-church-brown/40 text-lg max-w-xl leading-relaxed font-serif italic">Catalogação institucional e administração dos registros paroquiais do Encontro de Jovens com Cristo.</p>
        </div>
        
        {hasPermission('can_edit_jovens') && (
          <button
            onClick={() => navigate('/ejc/jovens/novo')}
            className="institutional-button-primary"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Novo Registro</span>
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="relative z-20">
        <JovemFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          bairros={bairros}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      {/* Tabela ou Loading */}
      <div className="relative z-10">
        {loading ? (
          <div className="institutional-card flex flex-col items-center justify-center py-48 gap-6 bg-white rounded-3xl shadow-2xl shadow-church-dark/5 border border-church-border/10">
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-church-gold/20 rounded-full" />
              <Loader2 className="animate-spin text-church-gold relative z-10" size={40} strokeWidth={1.5} />
            </div>
            <p className="text-church-brown/30 text-[10px] uppercase tracking-[0.4em] font-bold">Consultando Arquivos...</p>
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
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-church-dark/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-16 shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 border border-church-border/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-bl-full -mr-20 -mt-20 opacity-50" />
            
            <div className="flex flex-col items-center text-center gap-10 mb-12 relative z-10">
              <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center border border-red-100 shadow-xl shadow-red-600/5 group">
                <AlertTriangle size={40} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight">Confirmar Exclusão</h3>
                <p className="text-church-brown/50 text-sm leading-relaxed max-w-xs mx-auto">
                  Deseja remover permanentemente este registro do arquivo paroquial? Esta ação é <span className="text-red-600 font-bold">irreversível</span>.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-10 py-5 text-church-brown/40 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-church-bg rounded-2xl transition-all duration-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-red-700 transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl shadow-red-600/30 disabled:opacity-50 group"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} strokeWidth={2} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} strokeWidth={2} className="group-hover:-translate-y-0.5 transition-transform" />
                    Confirmar Exclusão
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

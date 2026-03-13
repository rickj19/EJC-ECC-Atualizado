import React from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface JovemFiltersData {
  searchTerm: string;
  bairro: string;
  vivenciou_ejc: boolean | 'all';
  pastoral: string;
  sacramento: string;
}

interface JovemFiltersProps {
  filters: JovemFiltersData;
  onFilterChange: (filters: JovemFiltersData) => void;
  bairros: string[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function JovemFilters({ 
  filters, 
  onFilterChange, 
  bairros, 
  showFilters, 
  setShowFilters 
}: JovemFiltersProps) {
  
  const handleChange = (key: keyof JovemFiltersData, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      searchTerm: '',
      bairro: '',
      vivenciou_ejc: 'all',
      pastoral: '',
      sacramento: '',
    });
  };

  const hasActiveFilters = filters.bairro || filters.vivenciou_ejc !== 'all' || filters.pastoral || filters.sacramento;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-church-gold/40" size={20} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou apelido nos arquivos..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="institutional-input pl-14"
          />
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-4 px-8 py-4 rounded border font-black uppercase tracking-[0.25em] text-[11px] transition-all",
              showFilters || hasActiveFilters
                ? "bg-church-dark border-church-dark text-white shadow-xl shadow-church-dark/20" 
                : "bg-white border-church-border text-stone-600 hover:bg-stone-50"
            )}
          >
            <Filter size={18} strokeWidth={1.5} />
            Filtros Administrativos
            {hasActiveFilters && (
              <span className="ml-2 w-2.5 h-2.5 bg-church-gold rounded-full animate-pulse" />
            )}
            <ChevronDown size={16} className={cn("transition-transform ml-2", showFilters && "rotate-180")} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-stone-400 hover:text-red-600 p-3 transition-colors flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"
              title="Limpar todos os filtros"
            >
              <X size={18} strokeWidth={1.5} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="paper-card p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 animate-in slide-in-from-top-6 duration-500 bg-church-bg/5">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold/30" />
              Bairro / Localidade
            </label>
            <select
              value={filters.bairro}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="institutional-input h-[56px] bg-white"
            >
              <option value="">Todas as localidades</option>
              {bairros.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold/30" />
              Iniciação Cristã
            </label>
            <select
              value={filters.sacramento}
              onChange={(e) => handleChange('sacramento', e.target.value)}
              className="institutional-input h-[56px] bg-white"
            >
              <option value="">Todos os sacramentos</option>
              <option value="Batismo">Batismo</option>
              <option value="Eucaristia">Eucaristia</option>
              <option value="Crisma">Crisma</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold/30" />
              Vínculo EJC
            </label>
            <select
              value={String(filters.vivenciou_ejc)}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('vivenciou_ejc', val === 'all' ? 'all' : val === 'true');
              }}
              className="institutional-input h-[56px] bg-white"
            >
              <option value="all">Todos os vínculos</option>
              <option value="true">Vivenciou EJC</option>
              <option value="false">Não vivenciou</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold/30" />
              Pastoral / Movimento
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Coroinhas, Catequese..."
                value={filters.pastoral}
                onChange={(e) => handleChange('pastoral', e.target.value)}
                className="institutional-input h-[56px] bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

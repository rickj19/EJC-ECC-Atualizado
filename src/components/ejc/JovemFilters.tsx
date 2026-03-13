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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-church-gold/30" size={16} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou apelido..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="institutional-input pl-11"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all",
              showFilters || hasActiveFilters
                ? "bg-church-dark border-church-dark text-white shadow-lg shadow-church-dark/10" 
                : "bg-white border-church-border/40 text-stone-600 hover:bg-stone-50"
            )}
          >
            <Filter size={14} strokeWidth={1.5} />
            Filtros
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 bg-church-gold rounded-full" />
            )}
            <ChevronDown size={14} className={cn("transition-transform", showFilters && "rotate-180")} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-stone-400 hover:text-red-600 p-2 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              title="Limpar todos os filtros"
            >
              <X size={14} strokeWidth={1.5} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="institutional-card p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="institutional-label">Bairro / Localidade</label>
            <select
              value={filters.bairro}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="institutional-input bg-white"
            >
              <option value="">Todas as localidades</option>
              {bairros.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="institutional-label">Iniciação Cristã</label>
            <select
              value={filters.sacramento}
              onChange={(e) => handleChange('sacramento', e.target.value)}
              className="institutional-input bg-white"
            >
              <option value="">Todos os sacramentos</option>
              <option value="Batismo">Batismo</option>
              <option value="Eucaristia">Eucaristia</option>
              <option value="Crisma">Crisma</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="institutional-label">Vínculo EJC</label>
            <select
              value={String(filters.vivenciou_ejc)}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('vivenciou_ejc', val === 'all' ? 'all' : val === 'true');
              }}
              className="institutional-input bg-white"
            >
              <option value="all">Todos os vínculos</option>
              <option value="true">Vivenciou EJC</option>
              <option value="false">Não vivenciou</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="institutional-label">Pastoral / Movimento</label>
            <input
              type="text"
              placeholder="Ex: Coroinhas..."
              value={filters.pastoral}
              onChange={(e) => handleChange('pastoral', e.target.value)}
              className="institutional-input bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou apelido..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all",
              showFilters || hasActiveFilters
                ? "bg-zinc-900 border-zinc-900 text-white" 
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            )}
          >
            <Filter size={18} />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center">
                !
              </span>
            )}
            <ChevronDown size={16} className={cn("transition-transform", showFilters && "rotate-180")} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-zinc-400 hover:text-zinc-600 p-2 transition-colors"
              title="Limpar filtros"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bairro</label>
            <select
              value={filters.bairro}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              <option value="">Todos os bairros</option>
              {bairros.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sacramento</label>
            <select
              value={filters.sacramento}
              onChange={(e) => handleChange('sacramento', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
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
              value={String(filters.vivenciou_ejc)}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('vivenciou_ejc', val === 'all' ? 'all' : val === 'true');
              }}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
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
              value={filters.pastoral}
              onChange={(e) => handleChange('pastoral', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}

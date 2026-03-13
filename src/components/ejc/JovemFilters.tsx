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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou apelido..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown/20 focus:border-church-brown outline-none transition-all bg-white/50 text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all",
              showFilters || hasActiveFilters
                ? "bg-church-dark border-church-dark text-white shadow-lg shadow-church-dark/20" 
                : "bg-white border-church-border text-stone-600 hover:bg-stone-50"
            )}
          >
            <Filter size={16} />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 bg-church-gold rounded-full animate-pulse" />
            )}
            <ChevronDown size={14} className={cn("transition-transform ml-1", showFilters && "rotate-180")} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-stone-400 hover:text-red-600 p-2 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              title="Limpar filtros"
            >
              <X size={16} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white rounded-2xl border border-church-border shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Bairro / Localidade</label>
            <select
              value={filters.bairro}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-church-border outline-none focus:ring-2 focus:ring-church-brown/20 focus:border-church-brown bg-stone-50 text-sm font-medium text-church-dark"
            >
              <option value="">Todas as localidades</option>
              {bairros.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Sacramento</label>
            <select
              value={filters.sacramento}
              onChange={(e) => handleChange('sacramento', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-church-border outline-none focus:ring-2 focus:ring-church-brown/20 focus:border-church-brown bg-stone-50 text-sm font-medium text-church-dark"
            >
              <option value="">Todos os sacramentos</option>
              <option value="Batismo">Batismo</option>
              <option value="Eucaristia">Eucaristia</option>
              <option value="Crisma">Crisma</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Vínculo EJC</label>
            <select
              value={String(filters.vivenciou_ejc)}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('vivenciou_ejc', val === 'all' ? 'all' : val === 'true');
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-church-border outline-none focus:ring-2 focus:ring-church-brown/20 focus:border-church-brown bg-stone-50 text-sm font-medium text-church-dark"
            >
              <option value="all">Todos os vínculos</option>
              <option value="true">Vivenciou EJC</option>
              <option value="false">Não vivenciou</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Pastoral / Movimento</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Coroinhas..."
                value={filters.pastoral}
                onChange={(e) => handleChange('pastoral', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-church-border outline-none focus:ring-2 focus:ring-church-brown/20 focus:border-church-brown bg-stone-50 text-sm font-medium text-church-dark"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

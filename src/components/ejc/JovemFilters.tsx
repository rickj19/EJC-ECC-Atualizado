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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="relative flex-1 max-w-2xl group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-church-gold/30 group-focus-within:text-church-gold group-focus-within:scale-110 transition-all duration-500">
            <Search size={20} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Pesquisar no arquivo por nome ou apelido..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="institutional-input pl-16 py-5 bg-white shadow-sm border-church-border/10 focus:border-church-gold/30 rounded-[1.5rem] text-base placeholder:text-church-brown/20"
          />
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-4 px-10 py-5 rounded-[1.5rem] border text-[9px] font-bold uppercase tracking-[0.25em] transition-all duration-500",
              showFilters || hasActiveFilters
                ? "bg-church-dark border-church-dark text-white shadow-lg shadow-church-dark/10" 
                : "bg-white border-church-border/10 text-church-brown/60 hover:bg-church-bg hover:border-church-gold/30 shadow-sm"
            )}
          >
            <Filter size={14} strokeWidth={2} className={cn("transition-transform duration-500", showFilters && "rotate-180")} />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-church-gold rounded-full animate-pulse shadow-lg shadow-church-gold/50" />
            )}
            <ChevronDown size={14} className={cn("transition-transform duration-500", showFilters && "rotate-180")} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-church-brown/40 hover:text-red-600 p-3 transition-all duration-500 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105"
              title="Limpar todos os filtros"
            >
              <X size={16} strokeWidth={2} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="institutional-card p-12 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in slide-in-from-top-6 duration-700 shadow-sm border border-church-border/10 rounded-[2rem]">
          <div className="space-y-4">
            <label className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest ml-1">Bairro / Localidade</label>
            <select
              value={filters.bairro}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="institutional-input bg-church-bg/20 border-transparent focus:bg-white focus:border-church-gold/30 rounded-xl py-4"
            >
              <option value="">Todas as localidades</option>
              {bairros.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest ml-1">Iniciação Cristã</label>
            <select
              value={filters.sacramento}
              onChange={(e) => handleChange('sacramento', e.target.value)}
              className="institutional-input bg-church-bg/20 border-transparent focus:bg-white focus:border-church-gold/30 rounded-xl py-4"
            >
              <option value="">Todos os sacramentos</option>
              <option value="Batismo">Batismo</option>
              <option value="Eucaristia">Eucaristia</option>
              <option value="Crisma">Crisma</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest ml-1">Vínculo EJC</label>
            <select
              value={String(filters.vivenciou_ejc)}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('vivenciou_ejc', val === 'all' ? 'all' : val === 'true');
              }}
              className="institutional-input bg-church-bg/20 border-transparent focus:bg-white focus:border-church-gold/30 rounded-xl py-4"
            >
              <option value="all">Todos os vínculos</option>
              <option value="true">Vivenciou EJC</option>
              <option value="false">Não vivenciou</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest ml-1">Pastoral / Movimento</label>
            <input
              type="text"
              placeholder="Ex: Coroinhas..."
              value={filters.pastoral}
              onChange={(e) => handleChange('pastoral', e.target.value)}
              className="institutional-input bg-church-bg/20 border-transparent focus:bg-white focus:border-church-gold/30 rounded-xl py-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}

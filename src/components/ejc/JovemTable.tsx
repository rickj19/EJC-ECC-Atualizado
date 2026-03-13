import React from 'react';
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Jovem } from '../../types/jovem';
import { useAuth } from '../../lib/supabase/auth-context';

interface JovemTableProps {
  jovens: Jovem[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: any) => void;
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function JovemTable({
  jovens,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  page,
  totalCount,
  pageSize,
  onPageChange
}: JovemTableProps) {
  const { role, hasPermission } = useAuth();
  const totalPages = Math.ceil(totalCount / pageSize);

  const SortButton = ({ field, label }: { field: string, label: string }) => (
    <button 
      onClick={() => onSort(field)}
      className="flex items-center gap-3 hover:text-church-brown transition-all group/sort uppercase tracking-[0.25em] text-[9px] font-bold"
    >
      {label}
      <div className={cn(
        "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500",
        sortBy === field ? "bg-church-gold/10 text-church-gold" : "bg-church-bg text-stone-300 group-hover/sort:bg-church-gold/5 group-hover/sort:text-church-gold/40"
      )}>
        <ArrowUpDown size={10} className={cn(sortBy === field ? "opacity-100" : "opacity-40")} />
      </div>
    </button>
  );

  return (
    <div className="institutional-card bg-white overflow-hidden shadow-2xl shadow-church-dark/5 border border-church-border/10 rounded-[2rem]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="institutional-table w-full border-collapse">
          <thead>
            <tr className="bg-church-bg/20">
              <th className="w-24 pl-12 py-8">
                <span className="uppercase tracking-[0.25em] text-[9px] font-bold text-church-brown/40">Oficial</span>
              </th>
              <th className="py-8">
                <SortButton field="nome_completo" label="Identificação" />
              </th>
              <th className="py-8 uppercase tracking-[0.25em] text-[9px] font-bold text-church-brown/40 text-left">Localidade</th>
              <th className="py-8 uppercase tracking-[0.25em] text-[9px] font-bold text-church-brown/40 text-left">Contato</th>
              <th className="py-8 text-center uppercase tracking-[0.25em] text-[9px] font-bold text-church-brown/40">Vínculo</th>
              <th className="py-8 uppercase tracking-[0.25em] text-[9px] font-bold text-church-brown/40 text-left">Pastoral</th>
              <th className="py-8 text-right pr-12 uppercase tracking-[0.25em] text-[9px] font-bold text-church-brown/40">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-church-border/5">
            {jovens.length > 0 ? (
              jovens.map((jovem) => (
                <tr key={jovem.id} className="group hover:bg-church-bg/40 transition-all duration-700">
                  <td className="pl-12 py-8">
                    <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-church-border/20 flex-shrink-0 p-1.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-lg shadow-church-dark/5">
                      {jovem.foto_url ? (
                        <img 
                          src={jovem.foto_url} 
                          alt={jovem.nome_completo} 
                          className="w-full h-full object-cover rounded-xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-church-gold/30 bg-church-bg/50 rounded-xl">
                          <User size={28} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-church-dark group-hover:text-church-brown transition-colors duration-500 tracking-tight">{jovem.nome_completo}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-church-brown/30 uppercase tracking-[0.15em] font-bold">{jovem.nome_chamado || '-'}</span>
                        {jovem.vivenciou_ejc && (
                          <div className="w-1 h-1 bg-church-gold rounded-full opacity-40" />
                        )}
                        {jovem.vivenciou_ejc && (
                          <span className="text-[8px] text-church-gold uppercase font-bold tracking-widest">Membro</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-4 text-stone-500">
                      <div className="w-8 h-8 rounded-xl bg-church-bg flex items-center justify-center text-church-gold shadow-inner group-hover:bg-white group-hover:shadow-lg group-hover:shadow-church-dark/5 transition-all duration-500">
                        <MapPin size={14} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-bold tracking-tight text-church-dark/60">{jovem.bairro || '-'}</span>
                    </div>
                  </td>
                  <td className="py-8">
                    <span className="text-sm text-church-dark font-mono font-bold tracking-tight opacity-40 group-hover:opacity-100 transition-opacity duration-500">{jovem.contato}</span>
                  </td>
                  <td className="text-center py-8">
                    <span className={cn(
                      "inline-flex items-center px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border transition-all duration-700",
                      jovem.vivenciou_ejc 
                        ? "bg-church-brown text-white border-church-brown shadow-lg shadow-church-brown/20" 
                        : "bg-white text-stone-300 border-stone-100 group-hover:border-church-border/30"
                    )}>
                      {jovem.vivenciou_ejc ? 'Vivenciou' : 'Não Consta'}
                    </span>
                  </td>
                  <td className="py-8">
                    <div className="flex flex-col">
                      <p className="text-sm text-church-dark/70 font-bold tracking-tight" title={jovem.qual_pastoral || ''}>
                        {jovem.membro_pastoral ? (jovem.qual_pastoral || 'Sim') : 'Nenhuma'}
                      </p>
                      <span className="text-[9px] text-church-brown/20 uppercase font-bold tracking-widest mt-1">Engajamento</span>
                    </div>
                  </td>
                  <td className="text-right pr-12 py-8">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 translate-x-6 group-hover:translate-x-0 transition-all duration-700">
                      <button
                        onClick={() => onView(jovem.id)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl text-church-brown/30 hover:text-church-gold hover:bg-white transition-all duration-500 border border-transparent hover:border-church-border/20 shadow-lg shadow-church-dark/5"
                        title="Visualizar"
                      >
                        <Eye size={20} strokeWidth={1.5} />
                      </button>
                      {hasPermission('can_edit_jovens') && (
                        <button
                          onClick={() => onEdit(jovem.id)}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl text-church-brown/30 hover:text-church-brown hover:bg-white transition-all duration-500 border border-transparent hover:border-church-border/20 shadow-lg shadow-church-dark/5"
                          title="Editar"
                        >
                          <Edit2 size={20} strokeWidth={1.5} />
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          onClick={() => onDelete(jovem.id)}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl text-church-brown/30 hover:text-red-600 hover:bg-white transition-all duration-500 border border-transparent hover:border-church-border/20 shadow-lg shadow-church-dark/5"
                          title="Excluir"
                        >
                          <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-64 text-center">
                  <div className="flex flex-col items-center gap-10 text-stone-200">
                    <div className="relative">
                      <div className="absolute inset-0 bg-church-bg rounded-full blur-3xl opacity-50" />
                      <div className="w-32 h-32 rounded-[2.5rem] bg-church-bg/30 flex items-center justify-center text-church-gold/20 relative z-10 border border-church-border/10">
                        <AlertCircle size={64} strokeWidth={1} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-church-brown/30 uppercase tracking-[0.5em]">Arquivo Vazio</p>
                      <p className="text-stone-300 text-sm italic">Nenhum registro localizado nesta consulta.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="px-12 py-12 bg-church-bg/20 border-t border-church-border/10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-8">
            <div className="w-14 h-14 rounded-2xl bg-white border border-church-border/20 flex items-center justify-center text-church-gold shadow-2xl shadow-church-dark/5">
              <MoreHorizontal size={24} strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.4em] leading-none">Status do Arquivo</p>
              <p className="text-base font-bold text-church-dark uppercase tracking-[0.1em]">
                Exibindo <span className="text-church-gold font-display text-xl mx-1">{jovens.length}</span> de <span className="text-church-gold font-display text-xl mx-1">{totalCount}</span> registros
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border border-church-border/20 bg-white text-church-brown/40 disabled:opacity-20 hover:bg-white hover:text-church-gold hover:border-church-gold/40 transition-all duration-500 shadow-2xl shadow-church-dark/5 group"
            >
              <ChevronLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="flex items-center gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "w-14 h-14 rounded-2xl border text-sm font-bold transition-all duration-700 shadow-2xl",
                    page === p 
                      ? "bg-church-brown border-church-brown text-white shadow-church-brown/40 scale-110" 
                      : "bg-white border-church-border/20 text-church-brown/40 hover:border-church-gold/40 hover:text-church-gold shadow-church-dark/5"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border border-church-border/20 bg-white text-church-brown/40 disabled:opacity-20 hover:bg-white hover:text-church-gold hover:border-church-gold/40 transition-all duration-500 shadow-2xl shadow-church-dark/5 group"
            >
              <ChevronRight size={24} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

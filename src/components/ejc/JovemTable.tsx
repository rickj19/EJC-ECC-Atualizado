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
  ArrowUpDown
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
      className="flex items-center gap-2 hover:text-church-brown transition-colors group/sort"
    >
      {label}
      <ArrowUpDown size={12} className={cn(sortBy === field ? "text-church-brown" : "text-stone-300 group-hover/sort:text-stone-400")} />
    </button>
  );

  return (
    <div className="paper-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-church-bg/10 border-b border-church-border/30">
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0">Foto</th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0">
                <SortButton field="nome_completo" label="Nome Completo" />
              </th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0">Nome Social</th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0">Localidade</th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0">Contato</th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0 text-center">Vínculo EJC</th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] border-r border-church-border/10 last:border-r-0">Pastoral</th>
              <th className="px-10 py-8 text-[10px] font-black text-church-gold uppercase tracking-[0.3em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-church-border/10">
            {jovens.length > 0 ? (
              jovens.map((jovem) => (
                <tr key={jovem.id} className="hover:bg-church-bg/5 transition-colors group">
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0">
                    <div className="w-16 h-16 rounded bg-church-beige-light overflow-hidden border border-church-border/30 flex-shrink-0 shadow-inner">
                      {jovem.foto_url ? (
                        <img 
                          src={jovem.foto_url} 
                          alt={jovem.nome_completo} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-church-dark/20">
                          <User size={32} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0">
                    <p className="text-lg font-bold text-church-dark font-display tracking-tight leading-tight">{jovem.nome_completo}</p>
                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em] mt-1.5 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-church-gold/40" />
                      Assentamento: {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </td>
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0">
                    <p className="text-base text-stone-600 font-serif italic">{jovem.nome_chamado || '-'}</p>
                  </td>
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0">
                    <p className="text-base text-stone-600 font-medium tracking-tight">{jovem.bairro || '-'}</p>
                  </td>
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0">
                    <p className="text-base text-stone-600 font-mono tracking-tighter">{jovem.contato}</p>
                  </td>
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0 text-center">
                    <span className={cn(
                      "inline-flex items-center px-5 py-2 rounded text-[9px] font-black uppercase tracking-[0.25em] border transition-all",
                      jovem.vivenciou_ejc 
                        ? "bg-church-brown/10 text-church-brown border-church-brown/30 shadow-sm" 
                        : "bg-stone-50 text-stone-400 border-stone-200"
                    )}>
                      {jovem.vivenciou_ejc ? 'Vivenciou' : 'Não Consta'}
                    </span>
                  </td>
                  <td className="px-10 py-7 border-r border-church-border/5 last:border-r-0">
                    <p className="text-base text-stone-600 truncate max-w-[180px] font-serif italic" title={jovem.qual_pastoral || ''}>
                      {jovem.membro_pastoral ? (jovem.qual_pastoral || 'Sim') : 'Nenhuma'}
                    </p>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => onView(jovem.id)}
                        className="p-3 text-stone-400 hover:text-church-dark hover:bg-stone-100 rounded border border-transparent hover:border-church-border/30 transition-all"
                        title="Visualizar Prontuário"
                      >
                        <Eye size={20} strokeWidth={1.5} />
                      </button>
                      {hasPermission('can_edit_jovens') && (
                        <button
                          onClick={() => onEdit(jovem.id)}
                          className="p-3 text-stone-400 hover:text-church-gold hover:bg-church-gold/5 rounded border border-transparent hover:border-church-gold/20 transition-all"
                          title="Retificar Registro"
                        >
                          <Edit2 size={20} strokeWidth={1.5} />
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          onClick={() => onDelete(jovem.id)}
                          className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-all"
                          title="Remover do Arquivo"
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
                <td colSpan={8} className="px-10 py-32 text-center">
                  <div className="flex flex-col items-center gap-8 text-stone-300">
                    <AlertCircle size={72} strokeWidth={1} />
                    <div className="space-y-4">
                      <p className="text-3xl font-display font-bold text-stone-400 tracking-tight">Nenhum registro localizado</p>
                      <p className="text-lg text-stone-300 font-serif italic">A consulta aos arquivos da secretaria não retornou resultados para os critérios informados.</p>
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
        <div className="px-12 py-10 bg-church-bg/10 border-t border-church-border/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-10 bg-church-gold/30 rounded-full" />
            <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">
              Exibindo <span className="text-church-dark font-bold">{jovens.length}</span> de <span className="text-church-dark font-bold">{totalCount}</span> assentamentos paroquiais
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-4 rounded border border-church-border/30 bg-white text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "w-14 h-14 rounded border text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                    page === p 
                      ? "bg-church-dark border-church-dark text-white shadow-2xl shadow-church-dark/30 scale-110 z-10" 
                      : "bg-white border-church-border/30 text-stone-400 hover:bg-stone-50 hover:border-church-border"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-4 rounded border border-church-border/30 bg-white text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-all shadow-sm hover:shadow-md"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

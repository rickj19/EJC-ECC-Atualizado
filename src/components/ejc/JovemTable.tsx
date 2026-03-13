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
      className="flex items-center gap-2 hover:text-church-brown transition-colors group/sort"
    >
      {label}
      <ArrowUpDown size={12} className={cn(sortBy === field ? "text-church-brown" : "text-stone-300 group-hover/sort:text-stone-400")} />
    </button>
  );

  return (
    <div className="institutional-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="institutional-table">
          <thead>
            <tr>
              <th className="w-16">Oficial</th>
              <th>
                <SortButton field="nome_completo" label="Identificação" />
              </th>
              <th>Localidade</th>
              <th>Contato</th>
              <th className="text-center">Vínculo</th>
              <th>Pastoral</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {jovens.length > 0 ? (
              jovens.map((jovem) => (
                <tr key={jovem.id} className="group">
                  <td>
                    <div className="w-10 h-10 rounded-full bg-church-beige-light overflow-hidden border border-church-border/30 flex-shrink-0 p-0.5">
                      {jovem.foto_url ? (
                        <img 
                          src={jovem.foto_url} 
                          alt={jovem.nome_completo} 
                          className="w-full h-full object-cover rounded-full grayscale-[0.2]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <User size={20} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <p className="text-sm font-bold text-church-dark leading-tight">{jovem.nome_completo}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-tighter mt-0.5">{jovem.nome_chamado || '-'}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-stone-500">
                      <MapPin size={12} className="text-church-gold/60" />
                      <span className="text-xs">{jovem.bairro || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-stone-500 font-mono">{jovem.contato}</span>
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter border",
                      jovem.vivenciou_ejc 
                        ? "bg-church-brown/5 text-church-brown border-church-brown/20" 
                        : "bg-stone-50 text-stone-400 border-stone-200"
                    )}>
                      {jovem.vivenciou_ejc ? 'Vivenciou' : 'Não Consta'}
                    </span>
                  </td>
                  <td>
                    <p className="text-xs text-stone-500 truncate max-w-[150px]" title={jovem.qual_pastoral || ''}>
                      {jovem.membro_pastoral ? (jovem.qual_pastoral || 'Sim') : 'Nenhuma'}
                    </p>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => onView(jovem.id)}
                        className="p-2 text-stone-300 hover:text-church-gold transition-all"
                        title="Visualizar"
                      >
                        <Eye size={16} strokeWidth={1.5} />
                      </button>
                      {hasPermission('can_edit_jovens') && (
                        <button
                          onClick={() => onEdit(jovem.id)}
                          className="p-2 text-stone-300 hover:text-church-brown transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} strokeWidth={1.5} />
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          onClick={() => onDelete(jovem.id)}
                          className="p-2 text-stone-300 hover:text-red-600 transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 text-stone-300">
                    <AlertCircle size={32} strokeWidth={1.5} />
                    <p className="text-sm font-bold text-stone-400">Nenhum registro localizado</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="px-8 py-6 bg-church-bg/30 border-t border-church-border/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Exibindo <span className="text-church-dark">{jovens.length}</span> de <span className="text-church-dark">{totalCount}</span> registros
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md border border-church-border/30 bg-white text-stone-400 disabled:opacity-30 hover:bg-stone-50 transition-all"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "w-8 h-8 rounded-md border text-[10px] font-bold transition-all",
                    page === p 
                      ? "bg-church-dark border-church-dark text-white shadow-md" 
                      : "bg-white border-church-border/30 text-stone-400 hover:border-church-gold/40"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-church-border/30 bg-white text-stone-400 disabled:opacity-30 hover:bg-stone-50 transition-all"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

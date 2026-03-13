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
    <div className="bg-white rounded-2xl border border-church-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 border-b border-church-border">
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Foto</th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                <SortButton field="nome_completo" label="Nome Completo" />
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Nome Social</th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Localidade</th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Contato</th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-center">Vínculo EJC</th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Pastoral</th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-church-border">
            {jovens.length > 0 ? (
              jovens.map((jovem) => (
                <tr key={jovem.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-church-border flex-shrink-0 shadow-sm">
                      {jovem.foto_url ? (
                        <img 
                          src={jovem.foto_url} 
                          alt={jovem.nome_completo} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-church-dark font-serif">{jovem.nome_completo}</p>
                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider mt-0.5">
                      Registro: {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600 italic">{jovem.nome_chamado || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600 font-medium">{jovem.bairro || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600">{jovem.contato}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      jovem.vivenciou_ejc 
                        ? "bg-church-brown/10 text-church-brown border border-church-brown/20" 
                        : "bg-stone-100 text-stone-500 border border-stone-200"
                    )}>
                      {jovem.vivenciou_ejc ? 'Vivenciou' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600 truncate max-w-[150px]" title={jovem.qual_pastoral || ''}>
                      {jovem.membro_pastoral ? (jovem.qual_pastoral || 'Sim') : 'Nenhuma'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(jovem.id)}
                        className="p-2.5 text-stone-400 hover:text-church-dark hover:bg-stone-100 rounded-xl transition-all"
                        title="Visualizar Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                      {hasPermission('can_edit_jovens') && (
                        <button
                          onClick={() => onEdit(jovem.id)}
                          className="p-2.5 text-stone-400 hover:text-church-brown hover:bg-church-brown/5 rounded-xl transition-all"
                          title="Editar Registro"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          onClick={() => onDelete(jovem.id)}
                          className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Excluir Registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    {/* Mobile Actions */}
                    <div className="md:hidden">
                       <button className="p-2 text-stone-400">
                         <MoreHorizontal size={20} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-stone-300">
                    <AlertCircle size={48} strokeWidth={1.5} />
                    <div className="space-y-1">
                      <p className="text-lg font-serif font-bold text-stone-400">Nenhum registro encontrado</p>
                      <p className="text-sm text-stone-300">Tente ajustar os filtros de pesquisa.</p>
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
        <div className="px-8 py-5 bg-stone-50/50 border-t border-church-border flex items-center justify-between">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            Exibindo <span className="text-church-dark">{jovens.length}</span> de <span className="text-church-dark">{totalCount}</span> registros
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-church-border bg-white text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-xs font-black transition-all",
                    page === p 
                      ? "bg-church-dark text-white shadow-lg shadow-church-dark/20" 
                      : "bg-white border border-church-border text-stone-400 hover:bg-stone-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl border border-church-border bg-white text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

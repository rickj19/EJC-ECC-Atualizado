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
      className="flex items-center gap-3 hover:text-church-brown transition-colors group/sort"
    >
      {label}
      <ArrowUpDown size={14} className={cn(sortBy === field ? "text-church-brown" : "text-stone-300 group-hover/sort:text-stone-400")} />
    </button>
  );

  return (
    <div className="paper-card overflow-hidden border-church-border/40 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-church-beige-light/50 border-b border-church-border">
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] border-r border-church-border/10 last:border-r-0 w-32">Oficial</th>
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] border-r border-church-border/10 last:border-r-0">
                <SortButton field="nome_completo" label="Identificação do Jovem" />
              </th>
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] border-r border-church-border/10 last:border-r-0">Localidade</th>
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] border-r border-church-border/10 last:border-r-0">Contato</th>
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] border-r border-church-border/10 last:border-r-0 text-center">Vínculo EJC</th>
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] border-r border-church-border/10 last:border-r-0">Pastoral</th>
              <th className="px-12 py-8 text-[11px] font-black text-church-gold uppercase tracking-[0.5em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-church-border/10">
            {jovens.length > 0 ? (
              jovens.map((jovem) => (
                <tr key={jovem.id} className="hover:bg-church-beige-light/20 transition-all group">
                  <td className="px-12 py-10 border-r border-church-border/5 last:border-r-0">
                    <div className="w-20 h-20 rounded-sm bg-white overflow-hidden border border-church-border/30 flex-shrink-0 shadow-inner p-1 group-hover:border-church-gold transition-colors">
                      {jovem.foto_url ? (
                        <img 
                          src={jovem.foto_url} 
                          alt={jovem.nome_completo} 
                          className="w-full h-full object-cover rounded-sm grayscale-[0.3] group-hover:grayscale-0 transition-all"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-church-dark/20">
                          <User size={40} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-12 py-10 border-r border-church-border/5 last:border-r-0">
                    <p className="text-2xl font-bold text-church-dark font-display tracking-tight leading-tight group-hover:text-church-brown transition-colors">{jovem.nome_completo}</p>
                    <p className="text-[11px] text-stone-400 uppercase font-black tracking-[0.3em] mt-3 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-church-gold/40" />
                      Assentamento: {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-base text-church-gold font-serif italic mt-2">{jovem.nome_chamado || 'Sem alcunha oficial'}</p>
                  </td>
                  <td className="px-12 py-10 border-r border-church-border/5 last:border-r-0">
                    <div className="flex items-center gap-3 text-stone-600">
                      <MapPin size={16} className="text-church-gold" />
                      <span className="text-lg font-medium tracking-tight">{jovem.bairro || 'Não catalogado'}</span>
                    </div>
                  </td>
                  <td className="px-12 py-10 border-r border-church-border/5 last:border-r-0">
                    <p className="text-lg text-stone-600 font-mono tracking-tighter">{jovem.contato}</p>
                  </td>
                  <td className="px-12 py-10 border-r border-church-border/5 last:border-r-0 text-center">
                    <span className={cn(
                      "inline-flex items-center px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                      jovem.vivenciou_ejc 
                        ? "bg-church-brown/10 text-church-brown border-church-brown/30 shadow-sm" 
                        : "bg-stone-50 text-stone-400 border-stone-200"
                    )}>
                      {jovem.vivenciou_ejc ? 'Vivenciou' : 'Não Consta'}
                    </span>
                  </td>
                  <td className="px-12 py-10 border-r border-church-border/5 last:border-r-0">
                    <p className="text-lg text-stone-600 truncate max-w-[200px] font-serif italic" title={jovem.qual_pastoral || ''}>
                      {jovem.membro_pastoral ? (jovem.qual_pastoral || 'Sim') : 'Nenhuma'}
                    </p>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => onView(jovem.id)}
                        className="p-4 bg-white border border-church-border rounded-sm text-church-gold hover:text-church-brown hover:border-church-brown hover:shadow-xl transition-all"
                        title="Visualizar Prontuário"
                      >
                        <Eye size={22} strokeWidth={1.2} />
                      </button>
                      {hasPermission('can_edit_jovens') && (
                        <button
                          onClick={() => onEdit(jovem.id)}
                          className="p-4 bg-white border border-church-border rounded-sm text-church-gold hover:text-church-brown hover:border-church-brown hover:shadow-xl transition-all"
                          title="Retificar Registro"
                        >
                          <Edit2 size={22} strokeWidth={1.2} />
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          onClick={() => onDelete(jovem.id)}
                          className="p-4 bg-white border border-church-border rounded-sm text-red-300 hover:text-red-600 hover:border-red-600 hover:shadow-xl transition-all"
                          title="Remover do Arquivo"
                        >
                          <Trash2 size={22} strokeWidth={1.2} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-12 py-48 text-center">
                  <div className="flex flex-col items-center gap-10 text-stone-300">
                    <div className="w-24 h-24 bg-church-beige-light rounded-full flex items-center justify-center text-church-gold border border-church-border shadow-inner">
                      <AlertCircle size={48} strokeWidth={1} />
                    </div>
                    <div className="space-y-6">
                      <p className="text-4xl font-display font-bold text-stone-400 tracking-tight">Nenhum registro localizado</p>
                      <p className="text-xl text-stone-300 font-serif italic">A consulta aos arquivos da secretaria não retornou resultados para os critérios informados.</p>
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
        <div className="px-16 py-12 bg-church-beige-light/30 border-t border-church-border flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="w-1.5 h-12 bg-church-gold/40 rounded-full" />
            <p className="text-[12px] font-black text-stone-400 uppercase tracking-[0.4em]">
              Exibindo <span className="text-church-dark font-bold">{jovens.length}</span> de <span className="text-church-dark font-bold">{totalCount}</span> assentamentos paroquiais
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-5 rounded-sm border border-church-border bg-white text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-all shadow-sm hover:shadow-xl active:scale-95"
            >
              <ChevronLeft size={24} strokeWidth={1.2} />
            </button>
            
            <div className="flex items-center gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "w-16 h-16 rounded-sm border text-[12px] font-black uppercase tracking-widest transition-all duration-300",
                    page === p 
                      ? "bg-church-dark border-church-dark text-white shadow-2xl scale-110 z-10" 
                      : "bg-white border-church-border text-stone-400 hover:bg-stone-50 hover:border-church-gold"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-5 rounded-sm border border-church-border bg-white text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-all shadow-sm hover:shadow-xl active:scale-95"
            >
              <ChevronRight size={24} strokeWidth={1.2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { supabase } from '../lib/supabase/client';
import { Jovem } from '../types/jovem';

export interface JovemFilters {
  searchTerm?: string;
  bairro?: string;
  vivenciou_ejc?: boolean | 'all';
  pastoral?: string;
  sacramento?: string;
  sortBy?: 'nome_completo' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const jovemService = {
  async getJovens(filters: JovemFilters = {}) {
    const {
      searchTerm,
      bairro,
      vivenciou_ejc,
      pastoral,
      sacramento,
      sortBy = 'nome_completo',
      sortOrder = 'asc',
      page = 1,
      pageSize = 10,
    } = filters;

    let query = supabase.from('jovens').select('*', { count: 'exact' });

    // Filtros
    if (searchTerm) {
      query = query.or(`nome_completo.ilike.%${searchTerm}%,nome_chamado.ilike.%${searchTerm}%`);
    }

    if (bairro) {
      query = query.eq('bairro', bairro);
    }

    if (vivenciou_ejc !== undefined && vivenciou_ejc !== 'all') {
      query = query.eq('vivenciou_ejc', vivenciou_ejc);
    }

    if (pastoral) {
      query = query.ilike('qual_pastoral', `%${pastoral}%`);
    }

    if (sacramento) {
      query = query.contains('sacramentos', [sacramento]);
    }

    // Ordenação
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Paginação
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as Jovem[],
      count: count || 0,
    };
  },

  async deleteJovem(id: string) {
    const { error } = await supabase.from('jovens').delete().eq('id', id);
    if (error) throw error;
  },

  async getUniqueBairros() {
    const { data, error } = await supabase.from('jovens').select('bairro');
    if (error) throw error;
    
    const bairros = data
      .map(item => item.bairro)
      .filter((bairro): bairro is string => !!bairro);
      
    return Array.from(new Set(bairros)).sort();
  }
};

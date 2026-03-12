import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Star, 
  UserMinus, 
  Music, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Loader2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { cn } from '../../lib/utils';
import { Jovem } from '../../types/jovem';

export function EJCDashboard() {
  const navigate = useNavigate();
  const [jovens, setJovens] = useState<Jovem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jovens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJovens(data || []);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = jovens.length;
    const vivenciou = jovens.filter(j => j.vivenciou_ejc).length;
    const naoVivenciou = total - vivenciou;
    const comAptidao = jovens.filter(j => j.aptidao_artistica).length;

    // Sacramentos
    const sacramentosCount: Record<string, number> = {
      'Batismo': 0,
      'Eucaristia': 0,
      'Crisma': 0
    };
    jovens.forEach(j => {
      j.sacramentos?.forEach(s => {
        if (sacramentosCount[s] !== undefined) sacramentosCount[s]++;
      });
    });

    // Bairros (Top 5)
    const bairrosMap: Record<string, number> = {};
    jovens.forEach(j => {
      if (j.bairro) {
        bairrosMap[j.bairro] = (bairrosMap[j.bairro] || 0) + 1;
      }
    });
    const topBairros = Object.entries(bairrosMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total,
      vivenciou,
      naoVivenciou,
      comAptidao,
      sacramentosCount,
      topBairros
    };
  }, [jovens]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-zinc-900" size={40} />
        <p className="text-zinc-500 font-medium">Processando estatísticas...</p>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-4">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-zinc-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Resumo de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Jovens" 
          value={stats.total} 
          icon={Users} 
          colorClass="bg-zinc-100 text-zinc-900" 
        />
        <StatCard 
          title="Vivenciaram EJC" 
          value={stats.vivenciou} 
          icon={Star} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Não Vivenciaram" 
          value={stats.naoVivenciou} 
          icon={UserMinus} 
          colorClass="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Aptidão Artística" 
          value={stats.comAptidao} 
          icon={Music} 
          colorClass="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sacramentos & Bairros */}
        <div className="lg:col-span-1 space-y-8">
          {/* Sacramentos */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight mb-6 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Sacramentos
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.sacramentosCount).map(([sac, count]) => (
                <div key={sac} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-zinc-600">{sac}</span>
                    <span className="text-zinc-900">{count as number}</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-900 transition-all duration-1000" 
                      style={{ width: `${((count as number) / (stats.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bairros */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" />
              Top Bairros
            </h3>
            <div className="space-y-3">
              {stats.topBairros.length > 0 ? (
                stats.topBairros.map(([bairro, count], index) => (
                  <div key={bairro} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-zinc-300">0{index + 1}</span>
                      <span className="text-sm font-semibold text-zinc-700">{bairro}</span>
                    </div>
                    <span className="px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-400 text-center py-4 italic">Nenhum bairro registrado</p>
              )}
            </div>
          </div>
        </div>

        {/* Últimos Cadastros */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                Últimos Cadastros
              </h3>
              <button 
                onClick={() => navigate('/ejc/jovens')}
                className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1"
              >
                Ver todos
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Jovem</th>
                    <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Bairro</th>
                    <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data</th>
                    <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {jovens.slice(0, 6).map((jovem) => (
                    <tr key={jovem.id} className="hover:bg-zinc-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{jovem.nome_completo}</p>
                          <p className="text-[10px] text-zinc-400 uppercase font-medium">{jovem.nome_chamado || 'Sem apelido'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-zinc-600">{jovem.bairro || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-zinc-500">
                          {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/ejc/jovens/visualizar/${jovem.id}`)}
                          className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-all"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jovens.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic text-sm">
                        Nenhum jovem cadastrado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-zinc-50/50 border-t border-zinc-50">
              <div className="flex items-center gap-2 text-emerald-600">
                <TrendingUp size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Crescimento constante</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

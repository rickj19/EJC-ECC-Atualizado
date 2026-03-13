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

import { useAuth } from '../../lib/supabase/auth-context';

export function EJCDashboard() {
  const navigate = useNavigate();
  const { role } = useAuth();
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
    <div className="paper-card p-10 flex items-center gap-10 transition-all hover:border-church-gold group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={120} strokeWidth={1} />
      </div>
      <div className={cn("w-20 h-20 rounded flex items-center justify-center shadow-inner border border-black/5 shrink-0 relative z-10", colorClass)}>
        <Icon size={36} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] mb-2">{title}</p>
        <p className="text-5xl font-display font-bold text-church-dark tracking-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      {/* Resumo de Cards - Institutional Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard 
          title="Total de Registros" 
          value={stats.total} 
          icon={Users} 
          colorClass="bg-church-bg text-church-brown" 
        />
        <StatCard 
          title="Vivência EJC" 
          value={stats.vivenciou} 
          icon={Star} 
          colorClass="bg-church-beige-light text-church-gold" 
        />
        {role && role !== 'participante' && (
          <>
            <StatCard 
              title="Aguardando Encontro" 
              value={stats.naoVivenciou} 
              icon={UserMinus} 
              colorClass="bg-stone-50 text-stone-400" 
            />
            <StatCard 
              title="Aptidão Artística" 
              value={stats.comAptidao} 
              icon={Music} 
              colorClass="bg-church-dark text-church-beige" 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Sacramentos & Bairros - Institutional Columns */}
        <div className="lg:col-span-1 space-y-16">
          {/* Sacramentos */}
          {role && role !== 'participante' && (
            <div className="paper-card p-12">
              <h3 className="text-xs font-black text-church-dark uppercase tracking-[0.4em] mb-12 flex items-center gap-5">
                <div className="w-12 h-12 bg-church-green/5 rounded flex items-center justify-center text-church-green border border-church-green/10 shadow-sm">
                  <CheckCircle2 size={24} strokeWidth={1.5} />
                </div>
                Iniciação Cristã
              </h3>
              <div className="space-y-10">
                {Object.entries(stats.sacramentosCount).map(([sac, count]) => (
                  <div key={sac} className="space-y-5">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-serif italic text-stone-600">{sac}</span>
                      <span className="text-2xl font-display font-bold text-church-dark">{count as number}</span>
                    </div>
                    <div className="h-2.5 bg-church-bg rounded-full overflow-hidden border border-church-border/20 shadow-inner">
                      <div 
                        className="h-full bg-church-brown transition-all duration-1000 shadow-sm" 
                        style={{ width: `${((count as number) / (stats.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Bairros */}
          <div className="paper-card p-12">
            <h3 className="text-xs font-black text-church-dark uppercase tracking-[0.4em] mb-12 flex items-center gap-5">
              <div className="w-12 h-12 bg-church-gold/5 rounded flex items-center justify-center text-church-gold border border-church-gold/10 shadow-sm">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              Distribuição Geográfica
            </h3>
            <div className="space-y-5">
              {stats.topBairros.length > 0 ? (
                stats.topBairros.map(([bairro, count], index) => (
                  <div key={bairro} className="flex items-center justify-between p-6 bg-church-bg/20 border border-church-border/10 rounded hover:bg-church-bg/40 transition-all group cursor-default">
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] font-black text-church-gold/30 group-hover:text-church-gold/60 transition-colors tracking-[0.3em]">0{index + 1}</span>
                      <span className="text-lg font-serif text-stone-700">{bairro}</span>
                    </div>
                    <span className="px-5 py-2 bg-white border border-church-border rounded text-xs font-black text-church-brown shadow-sm group-hover:border-church-gold transition-colors">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-base font-serif italic text-stone-400 text-center py-12">Nenhum bairro catalogado no arquivo.</p>
              )}
            </div>
          </div>
        </div>

        {/* Últimos Cadastros - Institutional Ledger */}
        <div className="lg:col-span-2">
          <div className="paper-card overflow-hidden h-full flex flex-col">
            <div className="p-12 border-b border-church-border flex items-center justify-between bg-stone-50/30">
              <h3 className="text-xs font-black text-church-dark uppercase tracking-[0.4em] flex items-center gap-5">
                <div className="w-12 h-12 bg-church-brown/5 rounded flex items-center justify-center text-church-brown border border-church-brown/10 shadow-sm">
                  <Clock size={24} strokeWidth={1.5} />
                </div>
                Assentamentos Recentes
              </h3>
              {role && role !== 'participante' && (
                <button 
                  onClick={() => navigate('/ejc/jovens')}
                  className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] hover:text-church-brown transition-all flex items-center gap-4 group border border-church-border/50 px-6 py-3 rounded bg-white hover:shadow-md"
                >
                  Consultar Arquivo Completo
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-church-bg/10">
                    <th className="px-12 py-6 text-[11px] font-black text-church-gold uppercase tracking-[0.3em] border-b border-church-border/20">Registro</th>
                    <th className="px-12 py-6 text-[11px] font-black text-church-gold uppercase tracking-[0.3em] border-b border-church-border/20">Localidade</th>
                    <th className="px-12 py-6 text-[11px] font-black text-church-gold uppercase tracking-[0.3em] border-b border-church-border/20">Data de Inscrição</th>
                    {role && role !== 'participante' && <th className="px-12 py-6 text-[11px] font-black text-church-gold uppercase tracking-[0.3em] border-b border-church-border/20 text-right">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-church-border/20">
                  {jovens.slice(0, 10).map((jovem) => (
                    <tr key={jovem.id} className="hover:bg-church-bg/5 transition-colors group">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-church-beige-light rounded flex items-center justify-center text-church-brown font-display font-bold text-xl border border-church-border/30 shadow-inner">
                            {jovem.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-lg font-display font-bold text-church-dark leading-tight">{jovem.nome_completo}</p>
                            <p className="text-[11px] text-church-gold uppercase font-black tracking-[0.3em] mt-2">{jovem.nome_chamado || 'Sem alcunha'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <span className="text-base font-serif italic text-stone-600">{jovem.bairro || 'Não informado'}</span>
                      </td>
                      <td className="px-12 py-8">
                        <span className="text-base text-stone-500 font-medium font-serif">
                          {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      {role && role !== 'participante' && (
                        <td className="px-12 py-8 text-right">
                          <button 
                            onClick={() => navigate(`/ejc/jovens/visualizar/${jovem.id}`)}
                            className="p-4 bg-white border border-church-border rounded text-church-gold hover:text-church-brown hover:border-church-brown hover:shadow-md transition-all"
                            title="Ver Prontuário"
                          >
                            <ArrowRight size={20} strokeWidth={1.5} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {jovens.length === 0 && (
                    <tr>
                      <td colSpan={role && role === 'participante' ? 3 : 4} className="px-12 py-32 text-center text-stone-400 font-serif italic text-xl">
                        Nenhum registro encontrado nos arquivos da secretaria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-12 bg-stone-50/30 border-t border-church-border">
              <div className="flex items-center gap-5 text-church-green">
                <TrendingUp size={24} strokeWidth={1.5} />
                <span className="text-[12px] font-black uppercase tracking-[0.4em]">Crescimento constante da comunidade paroquial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="bg-white p-8 rounded-2xl border border-church-border shadow-sm flex items-center gap-6 transition-all hover:shadow-md group">
      <div className={cn("p-4 rounded-xl shadow-inner border border-black/5", colorClass)}>
        <Icon size={28} className="group-hover:scale-110 transition-transform" />
      </div>
      <div>
        <p className="text-[10px] font-black text-church-gold uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-3xl font-serif font-bold text-church-dark">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      {/* Resumo de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Jovens" 
          value={stats.total} 
          icon={Users} 
          colorClass="bg-church-bg text-church-brown" 
        />
        <StatCard 
          title="Vivenciaram EJC" 
          value={stats.vivenciou} 
          icon={Star} 
          colorClass="bg-church-beige text-church-gold" 
        />
        {role && role !== 'participante' && (
          <>
            <StatCard 
              title="Não Vivenciaram" 
              value={stats.naoVivenciou} 
              icon={UserMinus} 
              colorClass="bg-stone-100 text-stone-500" 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sacramentos & Bairros */}
        <div className="lg:col-span-1 space-y-10">
          {/* Sacramentos */}
          {role && role !== 'participante' && (
            <div className="bg-white p-8 rounded-2xl border border-church-border shadow-sm">
              <h3 className="text-xs font-black text-church-dark uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-church-green/10 rounded-lg flex items-center justify-center text-church-green">
                  <CheckCircle2 size={18} />
                </div>
                Sacramentos
              </h3>
              <div className="space-y-6">
                {Object.entries(stats.sacramentosCount).map(([sac, count]) => (
                  <div key={sac} className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-stone-600">{sac}</span>
                      <span className="text-church-dark">{count as number}</span>
                    </div>
                    <div className="h-2.5 bg-church-bg rounded-full overflow-hidden border border-church-border/30">
                      <div 
                        className="h-full bg-church-brown transition-all duration-1000 rounded-full" 
                        style={{ width: `${((count as number) / (stats.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Bairros */}
          <div className="bg-white p-8 rounded-2xl border border-church-border shadow-sm">
            <h3 className="text-xs font-black text-church-dark uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-church-gold/10 rounded-lg flex items-center justify-center text-church-gold">
                <MapPin size={18} />
              </div>
              Bairros de Atuação
            </h3>
            <div className="space-y-4">
              {stats.topBairros.length > 0 ? (
                stats.topBairros.map(([bairro, count], index) => (
                  <div key={bairro} className="flex items-center justify-between p-4 bg-church-bg/30 border border-church-border/20 rounded-xl hover:bg-church-bg/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-church-gold/40">0{index + 1}</span>
                      <span className="text-sm font-bold text-stone-700">{bairro}</span>
                    </div>
                    <span className="px-3 py-1 bg-white border border-church-border rounded-lg text-xs font-black text-church-brown shadow-sm">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-400 text-center py-6 italic">Nenhum bairro registrado</p>
              )}
            </div>
          </div>
        </div>

        {/* Últimos Cadastros */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-church-border shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-8 border-b border-church-border flex items-center justify-between bg-stone-50/30">
              <h3 className="text-xs font-black text-church-dark uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 bg-church-brown/10 rounded-lg flex items-center justify-center text-church-brown">
                  <Clock size={18} />
                </div>
                Registros Recentes
              </h3>
              {role && role !== 'participante' && (
                <button 
                  onClick={() => navigate('/ejc/jovens')}
                  className="text-[10px] font-black text-church-gold uppercase tracking-widest hover:text-church-brown transition-colors flex items-center gap-2 group"
                >
                  Ver arquivo completo
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-church-bg/20">
                    <th className="px-8 py-4 text-[10px] font-black text-church-gold uppercase tracking-[0.2em]">Jovem</th>
                    <th className="px-8 py-4 text-[10px] font-black text-church-gold uppercase tracking-[0.2em]">Bairro</th>
                    <th className="px-8 py-4 text-[10px] font-black text-church-gold uppercase tracking-[0.2em]">Data de Registro</th>
                    {role && role !== 'participante' && <th className="px-8 py-4 text-[10px] font-black text-church-gold uppercase tracking-[0.2em] text-right">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-church-border/30">
                  {jovens.slice(0, 8).map((jovem) => (
                    <tr key={jovem.id} className="hover:bg-church-bg/10 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-church-beige rounded-xl flex items-center justify-center text-church-brown font-black text-xs border border-church-border/50">
                            {jovem.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-church-dark leading-tight">{jovem.nome_completo}</p>
                            <p className="text-[10px] text-church-gold uppercase font-black tracking-widest mt-1">{jovem.nome_chamado || 'Sem apelido'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-stone-600">{jovem.bairro || '-'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs text-stone-500 font-medium">
                          {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      {role && role !== 'participante' && (
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => navigate(`/ejc/jovens/visualizar/${jovem.id}`)}
                            className="p-2.5 bg-white border border-church-border rounded-xl text-church-gold hover:text-church-brown hover:border-church-brown hover:shadow-md transition-all"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {jovens.length === 0 && (
                    <tr>
                      <td colSpan={role && role === 'participante' ? 3 : 4} className="px-8 py-16 text-center text-stone-400 italic text-sm">
                        Nenhum registro encontrado na secretaria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-stone-50/50 border-t border-church-border">
              <div className="flex items-center gap-3 text-church-green">
                <TrendingUp size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Crescimento constante da comunidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-church-gold" size={32} strokeWidth={1.5} />
        <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Processando dados...</p>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="institutional-card p-8 flex flex-col gap-4 group hover:border-church-gold/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-church-beige-light flex items-center justify-center text-church-gold border border-church-border/20">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="h-px flex-1 bg-church-border/10 mx-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-church-brown/40 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-display font-bold text-church-dark tracking-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-church-dark tracking-tight">Visão Geral do Arquivo</h2>
          <p className="text-stone-400 text-sm mt-1">Resumo administrativo dos registros paroquiais.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-church-border/30 rounded-full shadow-sm">
          <Clock className="text-church-gold w-4 h-4" strokeWidth={1.5} />
          <span className="text-[10px] font-bold text-church-brown/60 uppercase tracking-wider">
            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date())}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Registros" 
          value={stats.total} 
          icon={Users} 
        />
        <StatCard 
          title="Vivência EJC" 
          value={stats.vivenciou} 
          icon={Star} 
        />
        {role && role !== 'participante' && (
          <>
            <StatCard 
              title="Aguardando" 
              value={stats.naoVivenciou} 
              icon={UserMinus} 
            />
            <StatCard 
              title="Aptidão Artística" 
              value={stats.comAptidao} 
              icon={Music} 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sacramentos & Bairros */}
        <div className="space-y-8">
          {/* Iniciação Cristã */}
          {role && role !== 'participante' && (
            <div className="institutional-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-church-green/5 rounded flex items-center justify-center text-church-green border border-church-green/10">
                  <CheckCircle2 size={16} strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-bold text-church-dark uppercase tracking-widest">Iniciação Cristã</h3>
              </div>
              <div className="space-y-6">
                {Object.entries(stats.sacramentosCount).map(([sac, count]) => (
                  <div key={sac} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">{sac}</span>
                      <span className="text-sm font-bold text-church-dark">{count as number}</span>
                    </div>
                    <div className="h-1.5 bg-church-bg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((count as number) / (stats.total || 1)) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-church-brown/60 rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distribuição Geográfica */}
          <div className="institutional-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-church-gold/5 rounded flex items-center justify-center text-church-gold border border-church-gold/10">
                <MapPin size={16} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold text-church-dark uppercase tracking-widest">Localidades</h3>
            </div>
            <div className="space-y-3">
              {stats.topBairros.length > 0 ? (
                stats.topBairros.map(([bairro, count]) => (
                  <div key={bairro} className="flex items-center justify-between p-3 bg-church-bg/30 rounded-lg border border-church-border/10 group">
                    <span className="text-sm text-stone-600">{bairro}</span>
                    <span className="text-[10px] font-bold text-church-brown bg-white px-2 py-1 rounded border border-church-border/30">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic text-center py-4">Nenhum registro.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Records */}
        <div className="lg:col-span-2">
          <div className="institutional-card overflow-hidden h-full flex flex-col">
            <div className="p-8 border-b border-church-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-church-brown/5 rounded flex items-center justify-center text-church-brown border border-church-brown/10">
                  <Clock size={16} strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-bold text-church-dark uppercase tracking-widest">Registros Recentes</h3>
              </div>
              {role && role !== 'participante' && (
                <button 
                  onClick={() => navigate('/ejc/jovens')}
                  className="text-[10px] font-bold text-church-gold uppercase tracking-widest hover:text-church-brown transition-all flex items-center gap-2 group"
                >
                  Ver Tudo
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="institutional-table">
                <thead>
                  <tr>
                    <th>Nome Completo</th>
                    <th>Bairro</th>
                    <th>Admissão</th>
                    {role && role !== 'participante' && <th className="text-right">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {jovens.slice(0, 6).map((jovem) => (
                    <tr key={jovem.id} className="group">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-church-beige-light rounded-full flex items-center justify-center text-church-brown font-bold text-xs border border-church-border/30">
                            {jovem.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-church-dark">{jovem.nome_completo}</p>
                            <p className="text-[10px] text-stone-400 uppercase tracking-tighter">{jovem.nome_chamado || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-stone-500">{jovem.bairro || '-'}</span>
                      </td>
                      <td>
                        <span className="text-xs text-stone-400">
                          {new Date(jovem.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      {role && role !== 'participante' && (
                        <td className="text-right">
                          <button 
                            onClick={() => navigate(`/ejc/jovens/visualizar/${jovem.id}`)}
                            className="p-2 text-stone-300 hover:text-church-gold transition-all"
                          >
                            <ArrowRight size={16} strokeWidth={1.5} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {jovens.length === 0 && (
                    <tr>
                      <td colSpan={role && role === 'participante' ? 3 : 4} className="py-20 text-center text-stone-400 italic text-sm">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

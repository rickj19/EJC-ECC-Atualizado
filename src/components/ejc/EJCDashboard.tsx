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

  const StatCard = ({ title, value, icon: Icon, trend, color = 'brown' }: any) => (
    <div className="institutional-card p-10 flex flex-col gap-8 group hover:border-church-gold/30 transition-all duration-500 relative overflow-hidden bg-white">
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-12 -mt-12 transition-all duration-700 group-hover:scale-125 opacity-[0.03] group-hover:opacity-[0.08]",
        color === 'gold' ? "bg-church-gold" : "bg-church-brown"
      )} />
      <div className="flex items-center justify-between relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm",
          color === 'gold' ? "bg-church-gold/5 text-church-gold border border-church-gold/10" : "bg-church-brown/5 text-church-brown border border-church-brown/10"
        )}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-church-green bg-church-green/5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-church-green/10">
            <TrendingUp size={10} />
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-church-brown/30 uppercase tracking-[0.25em] mb-2.5">{title}</p>
        <div className="flex items-baseline gap-2.5">
          <p className="text-5xl font-display font-bold text-church-dark tracking-tighter group-hover:text-church-brown transition-colors duration-500">{value}</p>
          <div className="w-1.5 h-1.5 bg-church-gold rounded-full mb-3 opacity-40" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-church-gold/30" />
            <p className="text-[10px] text-church-gold uppercase font-bold tracking-[0.4em]">Visão Geral</p>
          </div>
          <h2 className="text-6xl font-display font-bold text-church-dark tracking-tighter">Arquivo Paroquial</h2>
          <p className="text-church-brown/40 text-lg max-w-xl leading-relaxed font-serif italic">Catalogação institucional e gestão centralizada dos registros do Encontro de Jovens com Cristo.</p>
        </div>
        <div className="flex items-center gap-6 px-10 py-6 bg-white border border-church-border/10 rounded-[2.5rem] shadow-sm backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-church-bg flex items-center justify-center text-church-brown">
            <Clock size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[9px] text-church-brown/30 uppercase font-bold tracking-[0.2em] leading-none mb-2">Última Atualização</p>
            <p className="text-sm font-bold text-church-dark uppercase tracking-[0.15em]">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total de Registros" 
          value={stats.total} 
          icon={Users} 
          trend="+12%"
          color="brown"
        />
        <StatCard 
          title="Vivência EJC" 
          value={stats.vivenciou} 
          icon={Star} 
          color="gold"
        />
        {role && role !== 'participante' && (
          <>
            <StatCard 
              title="Aguardando" 
              value={stats.naoVivenciou} 
              icon={UserMinus} 
              color="brown"
            />
            <StatCard 
              title="Aptidão Artística" 
              value={stats.comAptidao} 
              icon={Music} 
              color="gold"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Sacramentos & Bairros */}
        <div className="space-y-16">
          {/* Iniciação Cristã */}
          {role && role !== 'participante' && (
            <div className="institutional-card p-12 bg-white relative overflow-hidden rounded-3xl shadow-2xl shadow-church-dark/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-church-bg rounded-bl-full -mr-20 -mt-20 z-0 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-12">
                  <div className="w-12 h-12 bg-church-green/5 rounded-2xl flex items-center justify-center text-church-green border border-church-green/10 shadow-inner">
                    <CheckCircle2 size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-church-dark uppercase tracking-[0.2em]">Iniciação Cristã</h3>
                    <p className="text-[10px] text-church-brown/30 font-bold mt-1.5 uppercase tracking-widest">Status dos Sacramentos</p>
                  </div>
                </div>
                <div className="space-y-10">
                  {Object.entries(stats.sacramentosCount).map(([sac, count]) => (
                    <div key={sac} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-church-brown/60 uppercase tracking-[0.2em]">{sac}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-church-dark">{count as number}</span>
                          <span className="text-[10px] text-church-brown/20 font-bold uppercase">Jovens</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-church-bg rounded-full overflow-hidden border border-church-border/5 shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((count as number) / (stats.total || 1)) * 100}%` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className="h-full bg-gradient-to-r from-church-brown to-church-brown-medium rounded-full shadow-[0_0_10px_rgba(122,83,50,0.2)]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Distribuição Geográfica */}
          <div className="institutional-card p-12 bg-white rounded-3xl shadow-2xl shadow-church-dark/5">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-12 h-12 bg-church-gold/5 rounded-2xl flex items-center justify-center text-church-gold border border-church-gold/10 shadow-inner">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-church-dark uppercase tracking-[0.2em]">Localidades</h3>
                <p className="text-[10px] text-church-brown/30 font-bold mt-1.5 uppercase tracking-widest">Distribuição Geográfica</p>
              </div>
            </div>
            <div className="space-y-5">
              {stats.topBairros.length > 0 ? (
                stats.topBairros.map(([bairro, count]) => (
                  <div key={bairro} className="flex items-center justify-between p-5 bg-church-bg/30 rounded-2xl border border-church-border/5 group hover:border-church-gold/30 hover:bg-white hover:shadow-xl hover:shadow-church-dark/5 transition-all duration-500 cursor-default">
                    <span className="text-sm font-bold text-church-brown/70 tracking-tight">{bairro}</span>
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-12 bg-church-border/10 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-church-gold/30 rounded-full" style={{ width: `${((count as number) / (stats.total || 1)) * 100}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-church-brown bg-white px-4 py-1.5 rounded-xl border border-church-border/20 shadow-sm group-hover:border-church-gold/40 transition-colors duration-500">
                        {count}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                  <PieChartIcon className="w-16 h-16 text-church-bg mx-auto mb-6" strokeWidth={1} />
                  <p className="text-[11px] text-church-brown/20 uppercase font-bold tracking-widest italic">Nenhum registro localizado.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Records */}
        <div className="lg:col-span-2">
          <div className="institutional-card bg-white overflow-hidden h-full flex flex-col shadow-2xl shadow-church-dark/5 rounded-3xl border border-church-border/10">
            <div className="p-12 border-b border-church-border/10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-church-brown/5 rounded-2xl flex items-center justify-center text-church-brown border border-church-brown/10 shadow-inner">
                  <Clock size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-church-dark uppercase tracking-[0.2em]">Registros Recentes</h3>
                  <p className="text-[10px] text-church-brown/30 font-bold mt-1.5 uppercase tracking-widest">Últimas Admissões no Arquivo</p>
                </div>
              </div>
              {role && role !== 'participante' && (
                <button 
                  onClick={() => navigate('/ejc/jovens')}
                  className="px-8 py-4 bg-church-bg text-[10px] font-bold text-church-brown uppercase tracking-[0.3em] hover:bg-church-dark hover:text-white transition-all duration-500 flex items-center gap-4 group rounded-2xl border border-church-border/10 shadow-lg shadow-church-dark/5"
                >
                  Ver Arquivo Completo
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-500" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="institutional-table w-full">
                <thead>
                  <tr className="bg-church-bg/20">
                    <th className="pl-12 py-6 text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] text-left">Nome Completo</th>
                    <th className="py-6 text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] text-left">Bairro</th>
                    <th className="py-6 text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] text-left">Admissão</th>
                    {role && role !== 'participante' && <th className="text-right pr-12 py-6 text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em]">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-church-border/5">
                  {jovens.slice(0, 8).map((jovem) => (
                    <tr key={jovem.id} className="group hover:bg-church-bg/40 transition-all duration-500">
                      <td className="pl-12 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-church-bg rounded-2xl flex items-center justify-center text-church-brown font-display font-bold text-lg border border-church-border/10 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-church-dark/5 transition-all duration-500 shadow-inner">
                            {jovem.nome_completo.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-church-dark group-hover:text-church-brown transition-colors duration-500 tracking-tight">{jovem.nome_completo}</p>
                            <p className="text-[10px] text-church-brown/30 uppercase tracking-widest font-bold mt-1">{jovem.nome_chamado || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-3 text-church-brown/60">
                          <MapPin size={14} className="text-church-gold/40" />
                          <span className="text-xs font-bold tracking-tight">{jovem.bairro || '-'}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-church-dark/60">
                            {new Date(jovem.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] text-church-brown/20 uppercase tracking-widest font-bold mt-1">Data de Cadastro</span>
                        </div>
                      </td>
                      {role && role !== 'participante' && (
                        <td className="text-right pr-12 py-6">
                          <button 
                            onClick={() => navigate(`/ejc/jovens/visualizar/${jovem.id}`)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl text-church-brown/20 hover:text-church-gold hover:bg-white transition-all duration-500 border border-transparent hover:border-church-border/20 hover:shadow-xl hover:shadow-church-dark/5"
                          >
                            <ArrowRight size={20} strokeWidth={1.5} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {jovens.length === 0 && (
                    <tr>
                      <td colSpan={role && role === 'participante' ? 3 : 4} className="py-48 text-center">
                        <div className="flex flex-col items-center gap-6 text-church-bg">
                          <Users size={64} strokeWidth={1} className="opacity-50" />
                          <p className="text-[11px] font-bold text-church-brown/20 uppercase tracking-[0.4em] italic">Nenhum registro encontrado no arquivo.</p>
                        </div>
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

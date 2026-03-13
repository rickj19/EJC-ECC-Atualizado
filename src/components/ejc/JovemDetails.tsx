"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  Printer, 
  Calendar, 
  Phone, 
  MapPin, 
  User, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Music, 
  Users, 
  Star, 
  FileText,
  Loader2,
  Clock,
  Church
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { Jovem } from '../../types/jovem';
import { DetailSection, DetailItem } from './DetailSection';
import { JovemDetailActions } from './JovemDetailActions';
import { formatDate, formatDateTime, formatList } from '../../lib/formatters';

export function JovemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jovem, setJovem] = useState<Jovem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchJovem();
    }
  }, [id]);

  const fetchJovem = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jovens')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setJovem(data);
    } catch (err) {
      console.error('Erro ao buscar detalhes do jovem:', err);
      setError('Jovem não encontrado ou erro na conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-church-gold" size={32} strokeWidth={1.5} />
        <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Acessando Arquivo...</p>
      </div>
    );
  }

  if (error || !jovem) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
        <div className="w-16 h-16 bg-stone-50 text-stone-300 rounded-full flex items-center justify-center border border-church-border/30">
          <ArrowLeft size={32} strokeWidth={1.5} onClick={() => navigate('/ejc/jovens')} className="cursor-pointer" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-church-dark">{error || 'Registro não localizado'}</h2>
          <p className="text-stone-400 text-sm">O documento solicitado não consta em nossa base de dados.</p>
        </div>
        <button 
          onClick={() => navigate('/ejc/jovens')}
          className="institutional-button-primary"
        >
          Retornar ao Arquivo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 print:pb-0 print:max-w-none print:m-0 animate-in fade-in duration-700">
      {/* Estilos de Impressão */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            background-color: white !important;
            color: #141414 !important;
            -webkit-print-color-adjust: exact;
          }
          .print-no-break {
            break-inside: avoid;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />

      {/* Header Ações (Escondido na impressão) */}
      <JovemDetailActions jovemId={jovem.id} />

      {/* Ficha Principal */}
      <div id="printable-area" className="space-y-10 print:space-y-6 relative">
        {/* Subtle Church Watermark for Details */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none grayscale mix-blend-multiply flex items-center justify-center z-0">
          <Church size={600} strokeWidth={0.5} className="text-church-brown" />
        </div>

        {/* Cabeçalho / Perfil */}
        <div className="institutional-card p-12 bg-white flex flex-col md:flex-row items-center md:items-start gap-12 shadow-2xl shadow-church-dark/5 border border-church-border/20 rounded-3xl print:border-b-2 print:border-church-dark print:shadow-none print:p-6 print:rounded-none relative z-10">
          <div className="w-56 h-56 rounded-3xl overflow-hidden border-4 border-white flex-shrink-0 shadow-2xl print:w-40 print:h-40 relative group">
            <div className="absolute inset-0 border-2 border-church-gold/20 rounded-2xl m-2 pointer-events-none z-10" />
            {jovem.foto_url ? (
              <img 
                src={jovem.foto_url} 
                alt={jovem.nome_completo} 
                className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-church-bg flex items-center justify-center text-church-gold/30">
                <User size={80} strokeWidth={1} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-6 pt-4 relative">
            {/* Institutional Seal */}
            <div className="absolute -top-10 -right-4 w-32 h-32 opacity-10 pointer-events-none hidden md:block">
              <Church size={128} strokeWidth={0.5} className="text-church-brown" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-church-gold uppercase tracking-[0.4em] mb-1">Ficha de Assentamento</p>
                  <h1 className="text-4xl font-display font-bold text-church-dark tracking-tight print:text-3xl">{jovem.nome_completo}</h1>
                </div>
                {jovem.vivenciou_ejc && (
                  <span className="inline-flex items-center px-4 py-1.5 bg-church-brown text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-church-brown/20 self-center md:self-auto print:bg-stone-50 print:text-stone-600 print:shadow-none">
                    Membro Ativo EJC
                  </span>
                )}
              </div>
              {jovem.nome_chamado && (
                <p className="text-church-brown font-serif italic text-2xl opacity-80 print:text-stone-500 print:text-xl">"{jovem.nome_chamado}"</p>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-10 mt-8 pt-8 border-t border-church-border/10 print:mt-4 print:pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest">Contato Direto</span>
                <div className="flex items-center gap-3 text-church-dark">
                  <Phone size={18} strokeWidth={1.5} className="text-church-gold" />
                  <span className="text-lg font-mono font-bold tracking-tight">{jovem.contato}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest">Data de Nascimento</span>
                <div className="flex items-center gap-3 text-church-dark">
                  <Calendar size={18} strokeWidth={1.5} className="text-church-gold" />
                  <span className="text-lg font-medium tracking-tight">{formatDate(jovem.data_nascimento)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-church-brown/40 uppercase tracking-widest">Localidade</span>
                <div className="flex items-center gap-3 text-church-dark">
                  <MapPin size={18} strokeWidth={1.5} className="text-church-gold" />
                  <span className="text-lg font-medium tracking-tight">{jovem.bairro || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 print:grid-cols-2 print:gap-8">
          {/* Coluna Esquerda: Dados Pessoais & Vida na Igreja */}
          <div className="md:col-span-2 space-y-10 print:space-y-8">
            <DetailSection title="Registro de Identificação" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <DetailItem label="Endereço Residencial" value={jovem.endereco} icon={MapPin} />
                <DetailItem label="Ponto de Referência" value={jovem.ponto_referencia} />
                <DetailItem label="Escolaridade / Formação" value={jovem.escolaridade} icon={GraduationCap} />
                <DetailItem label="Ocupação / Profissão" value={jovem.profissao} icon={Briefcase} />
                <DetailItem label="Data de Nascimento" value={formatDate(jovem.data_nascimento)} icon={Calendar} />
                <DetailItem label="WhatsApp de Contato" value={jovem.contato} icon={Phone} />
              </div>
            </DetailSection>

            <DetailSection title="Vida Eclesial & Comunitária" icon={Heart}>
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-bold text-church-brown/40 uppercase tracking-widest mb-4">Sacramentos da Iniciação Cristã</p>
                  <div className="flex flex-wrap gap-4">
                    {jovem.sacramentos?.length > 0 ? (
                      jovem.sacramentos.map(sac => (
                        <span key={sac} className="px-5 py-2 bg-church-bg text-church-brown text-[11px] font-bold rounded-xl border border-church-border/30 uppercase tracking-wider shadow-sm">
                          {sac}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400 italic">Nenhum sacramento informado no assentamento</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-church-border/10">
                  <DetailItem 
                    label="Engajamento em Pastoral?" 
                    value={jovem.membro_pastoral ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Pastoral ou Movimento" 
                    value={jovem.qual_pastoral} 
                  />
                  <DetailItem 
                    label="Possui Aptidões Artísticas?" 
                    value={jovem.aptidao_artistica ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Descrição das Aptidões" 
                    value={jovem.qual_aptidao} 
                  />
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Observações Administrativas" icon={FileText} className="print-no-break">
              <div className="p-6 bg-church-bg/10 rounded-2xl border border-church-border/20">
                <p className="text-base text-stone-600 leading-relaxed whitespace-pre-wrap font-serif italic">
                  {jovem.observacoes || 'Nenhuma observação adicional registrada neste assentamento.'}
                </p>
              </div>
            </DetailSection>
          </div>

          {/* Coluna Direita: EJC & Equipes */}
          <div className="space-y-10 print:space-y-8">
            <DetailSection title="Histórico EJC" icon={Star}>
              {jovem.vivenciou_ejc ? (
                <div className="space-y-6">
                  <div className="p-8 bg-church-dark text-white rounded-3xl shadow-xl shadow-church-dark/20 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                      <Star size={100} strokeWidth={1} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-church-beige-light/40 uppercase tracking-widest mb-1">Ano do Encontro</p>
                      <p className="text-4xl font-display font-bold">{jovem.ano_ejc}</p>
                    </div>
                    <div className="text-right relative z-10">
                      <p className="text-[10px] font-bold text-church-beige-light/40 uppercase tracking-widest mb-1">Círculo</p>
                      <p className="text-2xl font-display font-bold uppercase tracking-tight">{jovem.circulo_ejc}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 text-center">
                  <p className="text-sm text-stone-400 italic">Ainda não vivenciou o encontro oficial</p>
                </div>
              )}
            </DetailSection>

            <DetailSection title="Equipes de Trabalho" icon={Users} className="print-no-break">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-church-gold rounded-full" />
                    <p className="text-[10px] font-bold text-church-brown/40 uppercase tracking-widest">Equipes de Serviço</p>
                  </div>
                  <p className="text-base font-medium text-church-dark leading-relaxed">{formatList(jovem.equipes_servidas)}</p>
                </div>
                <div className="pt-8 border-t border-church-border/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-church-brown rounded-full" />
                    <p className="text-[10px] font-bold text-church-brown/40 uppercase tracking-widest">Equipes de Coordenação</p>
                  </div>
                  <p className="text-base font-medium text-church-brown leading-relaxed">{formatList(jovem.equipes_coordenadas)}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Metadados" icon={Clock} className="print:hidden">
              <div className="space-y-4">
                <DetailItem label="Data do Assentamento" value={formatDateTime(jovem.created_at)} />
                <div className="pt-4 border-t border-church-border/10">
                  <DetailItem label="ID de Registro" value={jovem.id.substring(0, 8).toUpperCase()} />
                </div>
              </div>
            </DetailSection>
          </div>
        </div>
      </div>

      {/* Footer Ficha (Apenas Impressão) */}
      <div className="hidden print:block mt-12 pt-6 border-t border-church-dark text-center">
        <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">
          Secretaria Paroquial • EJC • {formatDateTime(new Date())}
        </p>
      </div>
    </div>
  );
}

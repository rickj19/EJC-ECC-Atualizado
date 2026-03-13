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
  Clock
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
      <div className="flex flex-col items-center justify-center py-40 gap-8">
        <Loader2 className="animate-spin text-church-gold" size={56} strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-church-dark font-display text-3xl font-bold tracking-tight">Acessando Arquivo</p>
          <p className="text-church-gold text-[11px] font-black uppercase tracking-[0.3em] mt-3">Localizando registro paroquial...</p>
        </div>
      </div>
    );
  }

  if (error || !jovem) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-8 text-center">
        <div className="w-24 h-24 bg-church-bg text-church-gold rounded-full flex items-center justify-center border border-church-border shadow-inner">
          <ArrowLeft size={40} strokeWidth={1.5} onClick={() => navigate('/ejc/jovens')} className="cursor-pointer hover:scale-110 transition-transform" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-display font-bold text-church-dark tracking-tight">{error || 'Registro não localizado'}</h2>
          <p className="text-stone-500 font-serif italic text-lg">O documento solicitado não consta em nossa base de dados.</p>
        </div>
        <button 
          onClick={() => navigate('/ejc/jovens')}
          className="institutional-button-primary px-12 py-4"
        >
          Retornar ao Arquivo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 print:pb-0 print:max-w-none print:m-0 animate-in fade-in duration-1000">
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
            font-family: 'Cormorant Garamond', serif;
          }
          .print-no-break {
            break-inside: avoid;
          }
          .print-hidden {
            display: none !important;
          }
          .church-header-print {
            display: block !important;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px double #3E2A1B;
            padding-bottom: 15px;
          }
        }
      `}} />

      {/* Header Ações (Escondido na impressão) */}
      <JovemDetailActions jovemId={jovem.id} />

      {/* Ficha Principal */}
      <div id="printable-area" className="space-y-12 print:space-y-8">
        {/* Cabeçalho / Perfil */}
        <div className="bg-church-dark rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden print:bg-white print:text-church-dark print:border-b-4 print:border-church-dark print:shadow-none print:p-8 print:rounded-none">
          {/* Subtle background texture/pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] print:hidden"></div>
          
          <div className="relative z-10 w-56 h-56 rounded-3xl overflow-hidden border-4 border-white/10 flex-shrink-0 shadow-2xl print:border-stone-200 print:w-40 print:h-40 print:shadow-none">
            {jovem.foto_url ? (
              <img 
                src={jovem.foto_url} 
                alt={jovem.nome_completo} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600 print:bg-stone-50">
                <User size={96} strokeWidth={1} className="print:w-20 print:h-20" />
              </div>
            )}
          </div>

          <div className="relative z-10 flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight print:text-4xl">{jovem.nome_completo}</h1>
              {jovem.vivenciou_ejc && (
                <span className="inline-flex items-center px-5 py-2 bg-church-gold text-church-dark text-[11px] font-black uppercase tracking-[0.2em] rounded-full self-center md:self-auto shadow-lg shadow-church-gold/20 print:bg-stone-100 print:text-stone-700 print:shadow-none">
                  Membro EJC
                </span>
              )}
            </div>
            {jovem.nome_chamado && (
              <p className="text-church-beige/80 text-3xl font-serif italic print:text-stone-500 print:text-xl">"{jovem.nome_chamado}"</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-10 mt-10 pt-10 border-t border-white/10 print:border-stone-100 print:mt-6 print:pt-6 print:gap-8">
              <div className="flex items-center gap-4">
                <Phone size={24} strokeWidth={1.5} className="text-church-gold print:w-5 print:h-5" />
                <span className="font-display font-bold tracking-tight text-xl print:text-base">{jovem.contato}</span>
              </div>
              <div className="flex items-center gap-4">
                <Calendar size={24} strokeWidth={1.5} className="text-church-gold print:w-5 print:h-5" />
                <span className="font-display font-bold tracking-tight text-xl print:text-base">
                  {formatDate(jovem.data_nascimento)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={24} strokeWidth={1.5} className="text-church-gold print:w-5 print:h-5" />
                <span className="font-display font-bold tracking-tight text-xl print:text-base">{jovem.bairro || 'Bairro não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 print:grid-cols-2 print:gap-8">
          {/* Coluna Esquerda: Dados Pessoais & Vida na Igreja */}
          <div className="md:col-span-2 space-y-10 print:space-y-8">
            <DetailSection title="Assentamento de Identificação" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 print:gap-6">
                <DetailItem label="Endereço Residencial" value={jovem.endereco} icon={MapPin} />
                <DetailItem label="Ponto de Referência" value={jovem.ponto_referencia} />
                <DetailItem label="Grau de Instrução" value={jovem.escolaridade} icon={GraduationCap} />
                <DetailItem label="Ocupação / Profissão" value={jovem.profissao} icon={Briefcase} />
                <DetailItem label="Data de Nascimento" value={formatDate(jovem.data_nascimento)} icon={Calendar} />
                <DetailItem label="Telefone de Contato" value={jovem.contato} icon={Phone} />
              </div>
            </DetailSection>

            <DetailSection title="Vida Eclesial e Sacramentos" icon={Heart}>
              <div className="space-y-10 print:space-y-6">
                <div>
                  <p className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] mb-5 print:mb-2 print:text-[9px]">Sacramentos Recebidos</p>
                  <div className="flex flex-wrap gap-4 print:gap-2">
                    {jovem.sacramentos?.length > 0 ? (
                      jovem.sacramentos.map(sac => (
                        <span key={sac} className="px-5 py-2 bg-church-bg text-church-dark text-xs font-bold rounded-xl border border-church-border shadow-sm print:bg-transparent print:border print:border-stone-200 print:text-[10px] print:px-3 print:py-1">
                          {sac}
                        </span>
                      ))
                    ) : (
                      <span className="text-base text-stone-400 font-serif italic print:text-sm">Nenhum sacramento informado</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-church-border/30 print:pt-6 print:gap-6">
                  <DetailItem 
                    label="Participa de Pastoral?" 
                    value={jovem.membro_pastoral ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Qual Pastoral / Movimento" 
                    value={jovem.qual_pastoral} 
                  />
                  <DetailItem 
                    label="Habilidades Artísticas" 
                    value={jovem.aptidao_artistica ? 'Possui' : 'Não'} 
                  />
                  <DetailItem 
                    label="Descrição das Habilidades" 
                    value={jovem.qual_aptidao} 
                  />
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Observações Administrativas" icon={FileText} className="print-no-break">
              <p className="text-lg text-stone-600 leading-relaxed whitespace-pre-wrap font-serif italic print:text-sm">
                {jovem.observacoes || 'Nenhuma observação adicional registrada para este membro.'}
              </p>
            </DetailSection>
          </div>

          {/* Coluna Direita: EJC & Equipes */}
          <div className="space-y-10 print:space-y-8">
            <DetailSection title="Histórico no EJC" icon={Star}>
              {jovem.vivenciou_ejc ? (
                <div className="space-y-8 print:space-y-4">
                  <div className="p-8 bg-church-bg/30 rounded-3xl border border-church-border shadow-inner relative overflow-hidden print:p-6 print:rounded-xl">
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <p className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] print:text-[9px]">Ano de Ingresso</p>
                        <p className="text-5xl font-display font-bold text-church-dark print:text-3xl">{jovem.ano_ejc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] print:text-[9px]">Círculo</p>
                        <p className="text-2xl font-display font-bold text-church-dark uppercase print:text-xl">{jovem.circulo_ejc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 text-center font-serif italic print:p-4">
                  <p className="text-lg text-stone-400 font-medium print:text-sm">Ainda não vivenciou o encontro</p>
                </div>
              )}
            </DetailSection>

            <DetailSection title="Serviço em Equipes" icon={Users} className="print-no-break">
              <div className="space-y-8 print:space-y-6">
                <div>
                  <p className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] mb-4 print:text-[9px]">Equipes de Trabalho</p>
                  <p className="text-base font-serif font-bold text-church-dark print:text-sm leading-relaxed">{formatList(jovem.equipes_servidas)}</p>
                </div>
                <div className="pt-8 border-t border-church-border/30 print:pt-6">
                  <p className="text-[11px] font-black text-church-gold uppercase tracking-[0.3em] mb-4 print:text-[9px]">Coordenações Realizadas</p>
                  <p className="text-base font-serif font-bold text-church-brown print:text-sm leading-relaxed">{formatList(jovem.equipes_coordenadas)}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Metadados do Registro" icon={Clock} className="print:hidden">
              <DetailItem label="Data do Assentamento" value={formatDateTime(jovem.created_at)} />
            </DetailSection>
          </div>
        </div>
      </div>

      {/* Footer Ficha (Apenas Impressão) */}
      <div className="hidden print:block mt-16 pt-8 border-t-4 border-church-dark text-center">
        <p className="text-[11px] text-church-dark uppercase tracking-[0.4em] font-black">
          Secretaria Paroquial • EJC Brasil • Documento Gerado em {formatDateTime(new Date())}
        </p>
      </div>
    </div>
  );
}

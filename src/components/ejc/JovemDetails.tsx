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
      <div id="printable-area" className="space-y-8 print:space-y-6">
        {/* Cabeçalho / Perfil */}
        <div className="institutional-card p-8 flex flex-col md:flex-row items-center gap-8 print:border-b-2 print:border-church-dark print:shadow-none print:p-4 print:rounded-none">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border border-church-border/30 flex-shrink-0 shadow-sm print:w-32 print:h-32">
            {jovem.foto_url ? (
              <img 
                src={jovem.foto_url} 
                alt={jovem.nome_completo} 
                className="w-full h-full object-cover grayscale-[0.1]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-stone-50 flex items-center justify-center text-stone-200">
                <User size={64} strokeWidth={1} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-bold text-church-dark tracking-tight print:text-2xl">{jovem.nome_completo}</h1>
              {jovem.vivenciou_ejc && (
                <span className="inline-flex items-center px-3 py-1 bg-church-brown/5 text-church-brown text-[9px] font-bold uppercase tracking-widest rounded-full border border-church-brown/20 self-center md:self-auto print:bg-stone-50 print:text-stone-600">
                  Membro EJC
                </span>
              )}
            </div>
            {jovem.nome_chamado && (
              <p className="text-church-gold font-serif italic text-xl print:text-stone-500 print:text-lg">"{jovem.nome_chamado}"</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 pt-4 border-t border-church-border/10 print:mt-3 print:pt-3">
              <div className="flex items-center gap-2 text-stone-500">
                <Phone size={16} strokeWidth={1.5} className="text-church-gold/60" />
                <span className="text-sm font-medium">{jovem.contato}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <Calendar size={16} strokeWidth={1.5} className="text-church-gold/60" />
                <span className="text-sm font-medium">{formatDate(jovem.data_nascimento)}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <MapPin size={16} strokeWidth={1.5} className="text-church-gold/60" />
                <span className="text-sm font-medium">{jovem.bairro || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-2 print:gap-6">
          {/* Coluna Esquerda: Dados Pessoais & Vida na Igreja */}
          <div className="md:col-span-2 space-y-8 print:space-y-6">
            <DetailSection title="Identificação" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem label="Endereço" value={jovem.endereco} icon={MapPin} />
                <DetailItem label="Referência" value={jovem.ponto_referencia} />
                <DetailItem label="Escolaridade" value={jovem.escolaridade} icon={GraduationCap} />
                <DetailItem label="Profissão" value={jovem.profissao} icon={Briefcase} />
                <DetailItem label="Nascimento" value={formatDate(jovem.data_nascimento)} icon={Calendar} />
                <DetailItem label="Contato" value={jovem.contato} icon={Phone} />
              </div>
            </DetailSection>

            <DetailSection title="Vida Eclesial" icon={Heart}>
              <div className="space-y-6">
                <div>
                  <p className="institutional-label mb-3">Sacramentos Recebidos</p>
                  <div className="flex flex-wrap gap-2">
                    {jovem.sacramentos?.length > 0 ? (
                      jovem.sacramentos.map(sac => (
                        <span key={sac} className="px-3 py-1 bg-church-bg text-church-dark text-[10px] font-bold rounded-lg border border-church-border/40">
                          {sac}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-400 italic">Nenhum sacramento informado</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-church-border/10">
                  <DetailItem 
                    label="Participa de Pastoral?" 
                    value={jovem.membro_pastoral ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Qual Pastoral" 
                    value={jovem.qual_pastoral} 
                  />
                  <DetailItem 
                    label="Habilidades Artísticas" 
                    value={jovem.aptidao_artistica ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Descrição" 
                    value={jovem.qual_aptidao} 
                  />
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Observações" icon={FileText} className="print-no-break">
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap font-serif italic">
                {jovem.observacoes || 'Nenhuma observação registrada.'}
              </p>
            </DetailSection>
          </div>

          {/* Coluna Direita: EJC & Equipes */}
          <div className="space-y-8 print:space-y-6">
            <DetailSection title="EJC" icon={Star}>
              {jovem.vivenciou_ejc ? (
                <div className="space-y-4">
                  <div className="p-4 bg-church-bg/20 rounded-xl border border-church-border/40 flex justify-between items-end">
                    <div>
                      <p className="institutional-label">Ano</p>
                      <p className="text-2xl font-bold text-church-dark">{jovem.ano_ejc}</p>
                    </div>
                    <div className="text-right">
                      <p className="institutional-label">Círculo</p>
                      <p className="text-lg font-bold text-church-dark uppercase">{jovem.circulo_ejc}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-center">
                  <p className="text-xs text-stone-400 italic">Ainda não vivenciou o encontro</p>
                </div>
              )}
            </DetailSection>

            <DetailSection title="Equipes" icon={Users} className="print-no-break">
              <div className="space-y-4">
                <div>
                  <p className="institutional-label mb-1">Trabalho</p>
                  <p className="text-sm font-medium text-church-dark">{formatList(jovem.equipes_servidas)}</p>
                </div>
                <div className="pt-4 border-t border-church-border/10">
                  <p className="institutional-label mb-1">Coordenação</p>
                  <p className="text-sm font-medium text-church-brown">{formatList(jovem.equipes_coordenadas)}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Registro" icon={Clock} className="print:hidden">
              <DetailItem label="Assentamento em" value={formatDateTime(jovem.created_at)} />
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

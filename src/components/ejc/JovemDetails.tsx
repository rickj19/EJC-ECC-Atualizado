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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-stone-500 font-medium">Carregando ficha do jovem...</p>
      </div>
    );
  }

  if (error || !jovem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="p-4 bg-red-50 text-red-500 rounded-full">
          <ArrowLeft size={32} onClick={() => navigate('/ejc/jovens')} className="cursor-pointer" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">{error || 'Jovem não encontrado'}</h2>
        <button 
          onClick={() => navigate('/ejc/jovens')}
          className="text-emerald-600 font-bold hover:underline"
        >
          Voltar para a listagem
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:pb-0 print:max-w-none print:m-0">
      {/* Estilos de Impressão */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
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
      <div id="printable-area" className="space-y-6 print:space-y-4">
        {/* Cabeçalho / Perfil */}
        <div className="bg-stone-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl print:bg-white print:text-stone-900 print:border print:border-stone-200 print:shadow-none print:p-6 print:rounded-2xl">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/10 flex-shrink-0 shadow-2xl print:border-stone-200 print:w-32 print:h-32 print:shadow-none">
            {jovem.foto_url ? (
              <img 
                src={jovem.foto_url} 
                alt={jovem.nome_completo} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600 print:bg-stone-50">
                <User size={64} className="print:w-16 print:h-16" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase print:text-2xl">{jovem.nome_completo}</h1>
              {jovem.vivenciou_ejc && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full self-center md:self-auto print:bg-emerald-100 print:text-emerald-700">
                  Membro EJC
                </span>
              )}
            </div>
            {jovem.nome_chamado && (
              <p className="text-stone-400 text-xl font-medium italic print:text-stone-500 print:text-base">"{jovem.nome_chamado}"</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-white/10 print:border-stone-100 print:mt-4 print:pt-4 print:gap-4">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-stone-500 print:w-4 print:h-4" />
                <span className="font-bold tracking-tight print:text-sm">{jovem.contato}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-stone-500 print:w-4 print:h-4" />
                <span className="font-bold tracking-tight print:text-sm">
                  {formatDate(jovem.data_nascimento)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-stone-500 print:w-4 print:h-4" />
                <span className="font-bold tracking-tight print:text-sm">{jovem.bairro || 'Bairro não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
          {/* Coluna Esquerda: Dados Pessoais & Vida na Igreja */}
          <div className="md:col-span-2 space-y-6 print:space-y-4">
            <DetailSection title="Dados Pessoais" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
                <DetailItem label="Endereço Completo" value={jovem.endereco} icon={MapPin} />
                <DetailItem label="Ponto de Referência" value={jovem.ponto_referencia} />
                <DetailItem label="Escolaridade" value={jovem.escolaridade} icon={GraduationCap} />
                <DetailItem label="Profissão" value={jovem.profissao} icon={Briefcase} />
                <DetailItem label="Data de Nascimento" value={formatDate(jovem.data_nascimento)} icon={Calendar} />
                <DetailItem label="Contato" value={jovem.contato} icon={Phone} />
              </div>
            </DetailSection>

            <DetailSection title="Vida na Igreja" icon={Heart}>
              <div className="space-y-6 print:space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 print:mb-1 print:text-[8px]">Sacramentos</p>
                  <div className="flex flex-wrap gap-2 print:gap-1">
                    {jovem.sacramentos?.length > 0 ? (
                      jovem.sacramentos.map(sac => (
                        <span key={sac} className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg print:bg-transparent print:border print:border-stone-200 print:text-[10px] print:px-2 print:py-0.5">
                          {sac}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400 italic print:text-xs">Nenhum sacramento informado</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-50 print:pt-2 print:gap-3">
                  <DetailItem 
                    label="Membro de Pastoral / Movimento" 
                    value={jovem.membro_pastoral ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Qual Pastoral / Movimento" 
                    value={jovem.qual_pastoral} 
                  />
                  <DetailItem 
                    label="Aptidão Musical / Artística" 
                    value={jovem.aptidao_artistica ? 'Sim' : 'Não'} 
                  />
                  <DetailItem 
                    label="Qual Aptidão" 
                    value={jovem.qual_aptidao} 
                  />
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Observações" icon={FileText} className="print-no-break">
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap print:text-xs">
                {jovem.observacoes || 'Nenhuma observação adicional cadastrada.'}
              </p>
            </DetailSection>
          </div>

          {/* Coluna Direita: EJC & Equipes */}
          <div className="space-y-6 print:space-y-4">
            <DetailSection title="Experiência EJC" icon={Star}>
              {jovem.vivenciou_ejc ? (
                <div className="space-y-4 print:space-y-2">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 print:p-2 print:rounded-lg">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest print:text-[8px]">Ano</p>
                        <p className="text-2xl font-black text-emerald-900 print:text-lg">{jovem.ano_ejc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest print:text-[8px]">Círculo</p>
                        <p className="text-lg font-black text-emerald-900 uppercase print:text-sm">{jovem.circulo_ejc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center print:p-2">
                  <p className="text-sm text-zinc-500 font-medium print:text-xs">Ainda não vivenciou o EJC</p>
                </div>
              )}
            </DetailSection>

            <DetailSection title="Equipes" icon={Users} className="print-no-break">
              <div className="space-y-4 print:space-y-2">
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 print:text-[8px]">Equipes Servidas</p>
                  <p className="text-sm font-medium text-stone-800 print:text-xs">{formatList(jovem.equipes_servidas)}</p>
                </div>
                <div className="pt-4 border-t border-stone-50 print:pt-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 print:text-[8px]">Equipes Coordenadas</p>
                  <p className="text-sm font-medium text-emerald-700 print:text-xs">{formatList(jovem.equipes_coordenadas)}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Registro" icon={Clock} className="print:hidden">
              <DetailItem label="Cadastrado em" value={formatDateTime(jovem.created_at)} />
            </DetailSection>
          </div>
        </div>
      </div>

      {/* Footer Ficha (Apenas Impressão) */}
      <div className="hidden print:block mt-8 pt-4 border-t border-stone-200 text-center">
        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
          Ficha do Jovem - EJC Brasil • Gerada em {formatDateTime(new Date())}
        </p>
      </div>
    </div>
  );
}

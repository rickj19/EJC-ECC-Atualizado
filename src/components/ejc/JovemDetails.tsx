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
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="animate-spin text-church-brown" size={48} />
        <div className="text-center">
          <p className="text-church-dark font-serif text-xl font-bold">Acessando Arquivo</p>
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Localizando registro paroquial...</p>
        </div>
      </div>
    );
  }

  if (error || !jovem) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center border border-stone-200">
          <ArrowLeft size={32} onClick={() => navigate('/ejc/jovens')} className="cursor-pointer hover:text-church-dark transition-colors" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-church-dark">{error || 'Registro não localizado'}</h2>
          <p className="text-stone-500">O documento solicitado não consta em nossa base de dados.</p>
        </div>
        <button 
          onClick={() => navigate('/ejc/jovens')}
          className="px-8 py-3 bg-church-brown text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-church-dark transition-all shadow-lg shadow-church-brown/20"
        >
          Retornar ao Arquivo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 print:pb-0 print:max-w-none print:m-0 animate-in fade-in duration-700">
      {/* Estilos de Impressão */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            font-family: serif;
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
            margin-bottom: 20px;
            border-bottom: 2px solid #3E2A1B;
            padding-bottom: 10px;
          }
        }
      `}} />

      {/* Header Ações (Escondido na impressão) */}
      <JovemDetailActions jovemId={jovem.id} />

      {/* Ficha Principal */}
      <div id="printable-area" className="space-y-8 print:space-y-6">
        {/* Cabeçalho / Perfil */}
        <div className="bg-church-dark rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl print:bg-white print:text-church-dark print:border-b-2 print:border-church-dark print:shadow-none print:p-6 print:rounded-none">
          <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/10 flex-shrink-0 shadow-2xl print:border-stone-200 print:w-32 print:h-32 print:shadow-none">
            {jovem.foto_url ? (
              <img 
                src={jovem.foto_url} 
                alt={jovem.nome_completo} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600 print:bg-stone-50">
                <User size={80} className="print:w-16 print:h-16" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight print:text-3xl">{jovem.nome_completo}</h1>
              {jovem.vivenciou_ejc && (
                <span className="inline-flex items-center px-4 py-1.5 bg-church-gold text-church-dark text-[10px] font-black uppercase tracking-widest rounded-full self-center md:self-auto shadow-lg shadow-church-gold/20 print:bg-stone-100 print:text-stone-700 print:shadow-none">
                  Membro EJC
                </span>
              )}
            </div>
            {jovem.nome_chamado && (
              <p className="text-church-beige/70 text-2xl font-serif italic print:text-stone-500 print:text-lg">"{jovem.nome_chamado}"</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-8 pt-8 border-t border-white/10 print:border-stone-100 print:mt-4 print:pt-4 print:gap-6">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-church-gold print:w-4 print:h-4" />
                <span className="font-bold tracking-tight text-lg print:text-sm">{jovem.contato}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-church-gold print:w-4 print:h-4" />
                <span className="font-bold tracking-tight text-lg print:text-sm">
                  {formatDate(jovem.data_nascimento)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-church-gold print:w-4 print:h-4" />
                <span className="font-bold tracking-tight text-lg print:text-sm">{jovem.bairro || 'Bairro não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-2 print:gap-6">
          {/* Coluna Esquerda: Dados Pessoais & Vida na Igreja */}
          <div className="md:col-span-2 space-y-8 print:space-y-6">
            <DetailSection title="Informações Cadastrais" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 print:gap-4">
                <DetailItem label="Endereço Residencial" value={jovem.endereco} icon={MapPin} />
                <DetailItem label="Ponto de Referência" value={jovem.ponto_referencia} />
                <DetailItem label="Grau de Instrução" value={jovem.escolaridade} icon={GraduationCap} />
                <DetailItem label="Ocupação / Profissão" value={jovem.profissao} icon={Briefcase} />
                <DetailItem label="Data de Nascimento" value={formatDate(jovem.data_nascimento)} icon={Calendar} />
                <DetailItem label="Telefone de Contato" value={jovem.contato} icon={Phone} />
              </div>
            </DetailSection>

            <DetailSection title="Vida Eclesial e Sacramentos" icon={Heart}>
              <div className="space-y-8 print:space-y-4">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 print:mb-1 print:text-[8px]">Sacramentos Recebidos</p>
                  <div className="flex flex-wrap gap-3 print:gap-2">
                    {jovem.sacramentos?.length > 0 ? (
                      jovem.sacramentos.map(sac => (
                        <span key={sac} className="px-4 py-1.5 bg-stone-100 text-church-dark text-xs font-bold rounded-lg border border-church-border print:bg-transparent print:border print:border-stone-200 print:text-[10px] print:px-2 print:py-0.5">
                          {sac}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400 italic print:text-xs">Nenhum sacramento informado</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-church-border/30 print:pt-4 print:gap-4">
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
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap italic print:text-xs">
                {jovem.observacoes || 'Nenhuma observação adicional registrada para este membro.'}
              </p>
            </DetailSection>
          </div>

          {/* Coluna Direita: EJC & Equipes */}
          <div className="space-y-8 print:space-y-6">
            <DetailSection title="Histórico no EJC" icon={Star}>
              {jovem.vivenciou_ejc ? (
                <div className="space-y-6 print:space-y-3">
                  <div className="p-6 bg-church-bg rounded-2xl border border-church-border shadow-inner print:p-4 print:rounded-lg">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-church-brown uppercase tracking-[0.2em] print:text-[8px]">Ano de Ingresso</p>
                        <p className="text-3xl font-serif font-bold text-church-dark print:text-xl">{jovem.ano_ejc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-church-brown uppercase tracking-[0.2em] print:text-[8px]">Círculo</p>
                        <p className="text-xl font-serif font-bold text-church-dark uppercase print:text-base">{jovem.circulo_ejc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center italic print:p-3">
                  <p className="text-sm text-stone-400 font-medium print:text-xs">Ainda não vivenciou o encontro</p>
                </div>
              )}
            </DetailSection>

            <DetailSection title="Serviço em Equipes" icon={Users} className="print-no-break">
              <div className="space-y-6 print:space-y-4">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 print:text-[8px]">Equipes de Trabalho</p>
                  <p className="text-sm font-bold text-church-dark print:text-xs leading-relaxed">{formatList(jovem.equipes_servidas)}</p>
                </div>
                <div className="pt-6 border-t border-church-border/30 print:pt-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 print:text-[8px]">Coordenações Realizadas</p>
                  <p className="text-sm font-bold text-church-brown print:text-xs leading-relaxed">{formatList(jovem.equipes_coordenadas)}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Metadados" icon={Clock} className="print:hidden">
              <DetailItem label="Data do Cadastro" value={formatDateTime(jovem.created_at)} />
            </DetailSection>
          </div>
        </div>
      </div>

      {/* Footer Ficha (Apenas Impressão) */}
      <div className="hidden print:block mt-12 pt-6 border-t-2 border-church-dark text-center">
        <p className="text-[10px] text-church-dark uppercase tracking-[0.3em] font-black">
          Secretaria Paroquial • EJC Brasil • Documento Gerado em {formatDateTime(new Date())}
        </p>
      </div>
    </div>
  );
}

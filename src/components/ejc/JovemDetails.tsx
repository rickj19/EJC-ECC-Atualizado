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
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { cn } from '../../lib/utils';
import { Jovem } from '../../types/jovem';

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-zinc-900" size={40} />
        <p className="text-zinc-500 font-medium">Carregando ficha do jovem...</p>
      </div>
    );
  }

  if (error || !jovem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="p-4 bg-red-50 text-red-500 rounded-full">
          <ArrowLeft size={32} onClick={() => navigate(-1)} className="cursor-pointer" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">{error || 'Jovem não encontrado'}</h2>
        <button 
          onClick={() => navigate('/ejc/dashboard')}
          className="text-zinc-600 underline"
        >
          Voltar para a listagem
        </button>
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm print:shadow-none print:border-zinc-200">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-50 pb-4">
        <div className="p-2 bg-zinc-50 rounded-lg text-zinc-900">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoItem = ({ label, value, icon: Icon }: { label: string, value: string | number | boolean | null | undefined, icon?: any }) => (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-zinc-400" />}
        <p className="text-sm font-medium text-zinc-800">{value || 'Não informado'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:pb-0">
      {/* Header Ações (Escondido na impressão) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Printer size={18} />
            Imprimir Ficha
          </button>
          <button
            onClick={() => navigate(`/ejc/jovens/editar/${jovem.id}`)}
            className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all shadow-md"
          >
            <Edit2 size={18} />
            Editar Cadastro
          </button>
        </div>
      </div>

      {/* Ficha Principal */}
      <div id="printable-area" className="space-y-6">
        {/* Cabeçalho / Perfil */}
        <div className="bg-zinc-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl print:bg-white print:text-zinc-900 print:border print:border-zinc-200 print:shadow-none">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/10 flex-shrink-0 shadow-2xl print:border-zinc-200">
            {jovem.foto_url ? (
              <img 
                src={jovem.foto_url} 
                alt={jovem.nome_completo} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                <User size={64} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{jovem.nome_completo}</h1>
              {jovem.vivenciou_ejc && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full self-center md:self-auto">
                  Membro EJC
                </span>
              )}
            </div>
            {jovem.nome_chamado && (
              <p className="text-zinc-400 text-xl font-medium italic print:text-zinc-500">"{jovem.nome_chamado}"</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-white/10 print:border-zinc-100">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-zinc-500" />
                <span className="font-bold tracking-tight">{jovem.contato}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-zinc-500" />
                <span className="font-bold tracking-tight">
                  {new Date(jovem.data_nascimento).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-zinc-500" />
                <span className="font-bold tracking-tight">{jovem.bairro || 'Bairro não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Dados Pessoais */}
          <div className="md:col-span-2 space-y-6">
            <Section title="Dados Pessoais" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Endereço Completo" value={jovem.endereco} icon={MapPin} />
                <InfoItem label="Ponto de Referência" value={jovem.ponto_referencia} />
                <InfoItem label="Escolaridade" value={jovem.escolaridade} icon={GraduationCap} />
                <InfoItem label="Profissão" value={jovem.profissao} icon={Briefcase} />
              </div>
            </Section>

            <Section title="Vida na Igreja" icon={Heart}>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Sacramentos</p>
                  <div className="flex flex-wrap gap-2">
                    {jovem.sacramentos?.length > 0 ? (
                      jovem.sacramentos.map(sac => (
                        <span key={sac} className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          {sac}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-zinc-400 italic">Nenhum sacramento informado</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-50">
                  <InfoItem 
                    label="Pastoral / Movimento" 
                    value={jovem.membro_pastoral ? jovem.qual_pastoral : 'Não participa'} 
                    icon={Users} 
                  />
                  <InfoItem 
                    label="Aptidão Artística" 
                    value={jovem.aptidao_artistica ? jovem.qual_aptidao : 'Não possui'} 
                    icon={Music} 
                  />
                </div>
              </div>
            </Section>

            <Section title="Observações" icon={FileText}>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {jovem.observacoes || 'Nenhuma observação adicional cadastrada.'}
              </p>
            </Section>
          </div>

          {/* Coluna Direita: EJC & Equipes */}
          <div className="space-y-6">
            <Section title="Experiência EJC" icon={Star}>
              {jovem.vivenciou_ejc ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ano</p>
                        <p className="text-2xl font-black text-emerald-900">{jovem.ano_ejc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Círculo</p>
                        <p className="text-lg font-black text-emerald-900 uppercase">{jovem.circulo_ejc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                  <p className="text-sm text-zinc-500 font-medium">Ainda não vivenciou o EJC</p>
                </div>
              )}
            </Section>

            <Section title="Equipes Servidas" icon={Users}>
              <div className="flex flex-wrap gap-2">
                {jovem.equipes_servidas?.length > 0 ? (
                  jovem.equipes_servidas.map(eq => (
                    <span key={eq} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase rounded border border-zinc-200">
                      {eq}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic">Nenhuma equipe registrada</p>
                )}
              </div>
            </Section>

            <Section title="Equipes Coordenadas" icon={Star}>
              <div className="flex flex-wrap gap-2">
                {jovem.equipes_coordenadas?.length > 0 ? (
                  jovem.equipes_coordenadas.map(eq => (
                    <span key={eq} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded border border-emerald-100">
                      {eq}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic">Nenhuma coordenação registrada</p>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Footer Ficha (Apenas Impressão) */}
      <div className="hidden print:block mt-12 pt-8 border-t border-zinc-200 text-center">
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
          Sistema EJC - Ficha Gerada em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Loader2, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Church, 
  FileText, 
  Calendar, 
  Phone, 
  GraduationCap, 
  Hash 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { jovemSchema, JovemFormData } from '../../lib/schemas/jovem';
import { ImageUploadField } from '../ImageUploadField';
import { cn } from '../../lib/utils';

interface JovemFormProps {
  initialData?: Partial<JovemFormData> & { id?: string };
  isEditing?: boolean;
}

const SACRAMENTOS_OPTIONS = ['Batismo', 'Eucaristia', 'Crisma'];
const EQUIPES_OPTIONS = [
  'Cozinha', 'Lanche', 'Recepção', 'Liturgia', 'Canto', 
  'Ordem', 'Compras', 'Secretaria', 'Visitação', 'Mídias',
  'Teatro', 'Almoxarifado', 'Infraestrutura'
];

export function JovemForm({ initialData, isEditing = false }: JovemFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JovemFormData>({
    resolver: zodResolver(jovemSchema) as any,
    defaultValues: {
      vivenciou_ejc: false,
      membro_pastoral: false,
      aptidao_artistica: false,
      sacramentos: [],
      equipes_servidas: [],
      equipes_coordenadas: [],
      ...initialData,
    },
  });

  const vivenciouEjc = watch('vivenciou_ejc');
  const membroPastoral = watch('membro_pastoral');
  const aptidaoArtistica = watch('aptidao_artistica');

  const onSubmit = async (data: JovemFormData) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from('jovens')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jovens')
          .insert([data]);
        if (error) throw error;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/ejc/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erro ao salvar jovem:', err);
      alert('Erro ao salvar os dados. Verifique sua conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="paper-card p-24 max-w-3xl w-full text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 shadow-2xl border-church-border/40">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-3 bg-church-brown" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-church-bg/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-church-bg/10 rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-32 h-32 bg-church-beige-light text-church-brown rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner border border-church-border/50">
              <CheckCircle2 size={72} strokeWidth={1} />
            </div>
            
            <h2 className="text-5xl font-display font-bold text-church-dark mb-8 tracking-tight uppercase">Assentamento Efetivado</h2>
            <div className="w-24 h-1 bg-church-gold/30 mx-auto mb-8" />
            <p className="text-xl text-stone-600 font-serif italic mb-16 leading-relaxed max-w-2xl mx-auto">
              O registro foi devidamente processado e arquivado nos anais digitais desta Chancelaria Paroquial. 
              As informações agora constam no Arquivo Geral para fins de consulta e administração pastoral.
            </p>
            
            <div className="flex items-center justify-center gap-6 py-6 border-t border-church-border/20">
              <Loader2 className="animate-spin text-church-gold" size={24} />
              <span className="text-[12px] font-black text-church-gold uppercase tracking-[0.5em]">Retornando ao Arquivo Geral...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-20 max-w-5xl mx-auto pb-48">
      {/* Cabeçalho Institucional do Formulário */}
      <div className="relative mb-12 pb-8 border-b-2 border-church-gold/30">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-church-gold mb-2">
              <div className="h-[2px] w-12 bg-church-gold/40" />
              <span className="text-[12px] font-black uppercase tracking-[0.6em]">Chancelaria Diocesana</span>
              <div className="h-[2px] w-12 bg-church-gold/40" />
            </div>
            <h1 className="text-5xl font-display text-church-dark leading-tight">
              Assentamento de <span className="text-church-gold italic">Jovem</span>
            </h1>
            <p className="text-stone-500 font-serif italic text-lg tracking-wide">
              Registro oficial de participação no Encontro de Jovens com Cristo
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="inline-block p-4 border border-church-border rounded-sm bg-church-beige-light/30">
              <p className="text-[10px] font-black text-church-dark uppercase tracking-[0.3em] mb-1">Protocolo de Registro</p>
              <p className="text-2xl font-mono text-church-gold">#EJC-{new Date().getFullYear()}-000</p>
            </div>
          </div>
        </div>
        
        {/* Elemento Decorativo de Canto */}
        <div className="absolute -bottom-[1px] left-0 w-24 h-[3px] bg-church-gold" />
      </div>

      {/* Dados Pessoais */}
      <section className="paper-card p-16 relative overflow-hidden group border-church-border/40 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <User size={120} strokeWidth={1} className="text-church-dark" />
        </div>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-church-gold/30" />

        <div className="flex items-center gap-10 mb-16 relative z-10">
          <div className="relative">
            <span className="w-20 h-20 bg-church-dark text-church-beige-light rounded-[1.5rem] flex items-center justify-center font-display text-4xl font-bold shadow-2xl border border-white/10 relative z-10">02</span>
            <div className="absolute -inset-3 bg-church-gold/15 rounded-[1.5rem] blur-md" />
          </div>
          <div>
            <h3 className="text-4xl font-display font-bold text-church-dark tracking-tight uppercase">Identificação Civil</h3>
            <p className="text-[11px] text-church-gold uppercase font-black tracking-[0.4em] mt-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-church-gold shadow-sm" />
              Dados Pessoais e Biométricos para Assentamento
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          <div className="md:col-span-4">
            <Controller
              name="foto_url"
              control={control}
              render={({ field }) => (
                <ImageUploadField
                  label="Fotografia Oficial"
                  value={field.value ? { url: field.value, path: watch('foto_path') || '' } : undefined}
                  onChange={(val) => {
                    setValue('foto_url', val?.url || '');
                    setValue('foto_path', val?.path || '');
                  }}
                  error={errors.foto_url?.message || errors.foto_path?.message}
                />
              )}
            />
          </div>

          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="md:col-span-2">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1 flex items-center gap-3 mb-3">
                Nome Completo do Assentado <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                {...register('nome_completo')}
                className={cn(
                  "institutional-input h-[64px] text-2xl font-serif italic px-8",
                  errors.nome_completo && "border-red-300 bg-red-50/30"
                )}
                placeholder="Nome conforme documento de identidade"
              />
              {errors.nome_completo && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.nome_completo.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Nome Social / Chamado</label>
              <input
                {...register('nome_chamado')}
                className="institutional-input h-[60px] text-xl font-serif italic px-8"
                placeholder="Como prefere ser identificado"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1 flex items-center gap-3">
                Contato (WhatsApp) <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                {...register('contato')}
                className={cn(
                  "institutional-input h-[60px] font-mono text-xl px-8 tracking-tighter",
                  errors.contato && "border-red-300 bg-red-50/30"
                )}
                placeholder="(00) 00000-0000"
              />
              {errors.contato && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.contato.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1 flex items-center gap-3">
                Data de Nascimento <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                type="date"
                {...register('data_nascimento')}
                className={cn(
                  "institutional-input h-[60px] text-xl px-8",
                  errors.data_nascimento && "border-red-300 bg-red-50/30"
                )}
              />
              {errors.data_nascimento && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.data_nascimento.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Escolaridade</label>
              <input
                {...register('escolaridade')}
                className="institutional-input h-[60px] text-xl font-serif italic px-8"
                placeholder="Ex: Ensino Médio Completo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vida na Igreja / EJC */}
      <section className="paper-card p-16 relative overflow-hidden group border-church-border/40 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Church size={120} strokeWidth={1} className="text-church-dark" />
        </div>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-church-gold/30" />

        <div className="flex items-center gap-10 mb-16 relative z-10">
          <div className="relative">
            <span className="w-20 h-20 bg-church-dark text-church-beige-light rounded-[1.5rem] flex items-center justify-center font-display text-4xl font-bold shadow-2xl border border-white/10 relative z-10">03</span>
            <div className="absolute -inset-3 bg-church-gold/15 rounded-[1.5rem] blur-md" />
          </div>
          <div>
            <h3 className="text-4xl font-display font-bold text-church-dark tracking-tight uppercase">Vida na Igreja & EJC</h3>
            <p className="text-[11px] text-church-gold uppercase font-black tracking-[0.4em] mt-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-church-gold shadow-sm" />
              Histórico religioso e vivência comunitária paroquial
            </p>
          </div>
        </div>

        <div className="space-y-16 relative z-10">
          {/* Sacramentos */}
          <div className="space-y-8">
            <label className="text-[12px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Iniciação Cristã (Sacramentos Recebidos)</label>
            <div className="flex flex-wrap gap-16">
              {SACRAMENTOS_OPTIONS.map((sac) => (
                <label key={sac} className="flex items-center gap-6 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={sac}
                      {...register('sacramentos')}
                      className="peer w-8 h-8 rounded-sm border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{sac}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-church-gold/10" />

          {/* EJC Experience */}
          <div className="space-y-12">
            <label className="flex items-center gap-8 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('vivenciou_ejc')}
                  className="peer w-10 h-10 rounded-sm border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-2xl font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight uppercase">Já vivenciou o Encontro de Jovens com Cristo (EJC)?</span>
            </label>

            {vivenciouEjc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pl-16 animate-in slide-in-from-left-8 duration-700">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Ano do Encontro *</label>
                  <input
                    type="number"
                    {...register('ano_ejc')}
                    className={cn(
                      "institutional-input h-[64px] font-mono text-xl px-8",
                      errors.ano_ejc && "border-red-300 bg-red-50/30"
                    )}
                  />
                  {errors.ano_ejc && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.ano_ejc.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Círculo de Pertença *</label>
                  <input
                    {...register('circulo_ejc')}
                    className={cn(
                      "institutional-input h-[64px] text-xl font-serif italic px-8",
                      errors.circulo_ejc && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Amarelo, Verde, Azul..."
                  />
                  {errors.circulo_ejc && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.circulo_ejc.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-church-gold/10" />

          {/* Pastoral */}
          <div className="space-y-12">
            <label className="flex items-center gap-8 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('membro_pastoral')}
                  className="peer w-10 h-10 rounded-sm border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-2xl font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight uppercase">Atua em alguma Pastoral, Movimento ou Serviço?</span>
            </label>

            {membroPastoral && (
              <div className="pl-16 animate-in slide-in-from-left-8 duration-700">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Identificação da Pastoral/Serviço *</label>
                  <input
                    {...register('qual_pastoral')}
                    className={cn(
                      "institutional-input h-[64px] text-xl font-serif italic px-8",
                      errors.qual_pastoral && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Nome formal da pastoral ou movimento"
                  />
                  {errors.qual_pastoral && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.qual_pastoral.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-church-gold/10" />

          {/* Aptidão */}
          <div className="space-y-12">
            <label className="flex items-center gap-8 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('aptidao_artistica')}
                  className="peer w-10 h-10 rounded-sm border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-2xl font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight uppercase">Possui aptidões musicais ou artísticas?</span>
            </label>

            {aptidaoArtistica && (
              <div className="pl-16 animate-in slide-in-from-left-8 duration-700">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Descrição da Aptidão *</label>
                  <input
                    {...register('qual_aptidao')}
                    className={cn(
                      "institutional-input h-[64px] text-xl font-serif italic px-8",
                      errors.qual_aptidao && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Instrumentista, Vocalista, Teatro, Artes Visuais..."
                  />
                  {errors.qual_aptidao && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-2">{errors.qual_aptidao.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Equipes */}
      <section className="paper-card p-16 relative overflow-hidden group border-church-border/40 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Save size={120} strokeWidth={1} className="text-church-dark" />
        </div>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-church-gold/30" />

        <div className="flex items-center gap-10 mb-16 relative z-10">
          <div className="relative">
            <span className="w-20 h-20 bg-church-dark text-church-beige-light rounded-[1.5rem] flex items-center justify-center font-display text-4xl font-bold shadow-2xl border border-white/10 relative z-10">04</span>
            <div className="absolute -inset-3 bg-church-gold/15 rounded-[1.5rem] blur-md" />
          </div>
          <div>
            <h3 className="text-4xl font-display font-bold text-church-dark tracking-tight uppercase">Equipes de Trabalho</h3>
            <p className="text-[11px] text-church-gold uppercase font-black tracking-[0.4em] mt-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-church-gold shadow-sm" />
              Histórico de serviço ministerial no encontro
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 relative z-10">
          <div className="space-y-12">
            <label className="text-[12px] font-black text-church-gold uppercase tracking-[0.4em] ml-1 block">Equipes em que serviu</label>
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`serviu-${equipe}`} className="flex items-center gap-6 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_servidas')}
                      className="peer w-8 h-8 rounded-sm border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{equipe}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <label className="text-[12px] font-black text-church-gold uppercase tracking-[0.4em] ml-1 block">Equipes que coordenou</label>
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`coord-${equipe}`} className="flex items-center gap-6 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_coordenadas')}
                      className="peer w-8 h-8 rounded-sm border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{equipe}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className="paper-card p-16 relative overflow-hidden group border-church-border/40 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <FileText size={120} strokeWidth={1} className="text-church-dark" />
        </div>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-church-gold/30" />

        <div className="flex items-center gap-10 mb-16 relative z-10">
          <div className="relative">
            <span className="w-20 h-20 bg-church-dark text-church-beige-light rounded-[1.5rem] flex items-center justify-center font-display text-4xl font-bold shadow-2xl border border-white/10 relative z-10">05</span>
            <div className="absolute -inset-3 bg-church-gold/15 rounded-[1.5rem] blur-md" />
          </div>
          <div>
            <h3 className="text-4xl font-display font-bold text-church-dark tracking-tight uppercase">Informações Adicionais</h3>
            <p className="text-[11px] text-church-gold uppercase font-black tracking-[0.4em] mt-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-church-gold shadow-sm" />
              Notas administrativas e observações pastorais para o arquivo
            </p>
          </div>
        </div>
        <div className="space-y-6 relative z-10">
          <label className="text-[12px] font-black text-church-gold uppercase tracking-[0.4em] ml-1">Observações Gerais / Notas de Saúde</label>
          <textarea
            {...register('observacoes')}
            rows={6}
            className="institutional-input resize-none p-10 font-serif italic text-xl leading-relaxed shadow-inner"
            placeholder="Relate restrições alimentares, condições de saúde, alergias ou notas pastorais relevantes para o arquivo oficial."
          />
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center justify-end gap-10 pt-16 border-t border-church-border/20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-12 py-5 rounded border-2 border-church-border/40 text-stone-500 font-black uppercase tracking-[0.3em] text-[12px] hover:bg-stone-50 hover:border-church-border transition-all flex items-center gap-5 group/btn"
        >
          <ArrowLeft size={20} className="group-hover/btn:-translate-x-1 transition-transform" />
          Descartar Alterações
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="institutional-button-primary px-16 py-5 text-[14px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={22} />
              Processando Registro...
            </>
          ) : (
            <>
              <Save size={22} />
              {isEditing ? 'Retificar Assentamento Oficial' : 'Efetivar Assentamento no Livro'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

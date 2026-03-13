import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
        <div className="paper-card p-20 max-w-2xl w-full text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-church-brown" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-church-bg/5 rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-church-brown/10 text-church-brown rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-4xl font-display font-bold text-church-dark mb-6 tracking-tight">Assentamento Concluído</h2>
            <p className="text-lg text-stone-600 font-serif italic mb-12 leading-relaxed">
              O registro foi realizado com sucesso no arquivo digital do EJC. 
              As informações foram devidamente processadas e arquivadas para consulta oficial da Chancelaria Paroquial.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="animate-spin text-church-gold" size={20} />
              <span className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em]">Redirecionando ao Arquivo Geral...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-5xl mx-auto pb-32">
      {/* Cabeçalho Institucional do Formulário */}
      <div className="text-center space-y-6 pt-12 pb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-church-gold/30 p-2 mb-4">
          <div className="w-full h-full rounded-full border border-church-gold/50 flex items-center justify-center bg-church-bg">
            <span className="font-display text-2xl font-bold text-church-gold">EJC</span>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-church-dark tracking-tight uppercase">Ficha de Assentamento Oficial</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-church-gold/30" />
            <p className="text-[11px] text-church-gold font-black uppercase tracking-[0.4em]">Secretaria Paroquial & Chancelaria</p>
            <div className="h-px w-12 bg-church-gold/30" />
          </div>
        </div>
        <p className="max-w-2xl mx-auto text-stone-500 font-serif italic text-sm leading-relaxed">
          Este documento constitui registro formal de participação no Encontro de Jovens com Cristo. 
          As informações aqui contidas são de uso exclusivo da administração pastoral e protegidas pelo sigilo institucional.
        </p>
      </div>

      {/* Seção de Foto */}
      <section className="paper-card p-12 relative overflow-hidden group">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-church-bg/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700" />
        <div className="absolute top-0 left-0 w-1 h-full bg-church-gold/20" />
        
        <div className="flex items-center gap-8 mb-12 relative z-10">
          <div className="relative">
            <span className="w-16 h-16 bg-church-dark text-church-beige-light rounded-2xl flex items-center justify-center font-display text-3xl font-bold shadow-2xl border border-white/10 relative z-10">01</span>
            <div className="absolute -inset-2 bg-church-gold/10 rounded-2xl blur-sm" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight">Identificação Visual</h3>
            <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold" />
              Anexar fotografia oficial para o arquivo paroquial
            </p>
          </div>
        </div>
        <Controller
          name="foto_url"
          control={control}
          render={({ field }) => (
            <ImageUploadField
              value={field.value ? { url: field.value, path: watch('foto_path') || '' } : undefined}
              onChange={(val) => {
                setValue('foto_url', val?.url || '');
                setValue('foto_path', val?.path || '');
              }}
              error={errors.foto_url?.message || errors.foto_path?.message}
            />
          )}
        />
      </section>

      {/* Dados Pessoais */}
      <section className="paper-card p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-church-bg/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700" />
        <div className="absolute top-0 left-0 w-1 h-full bg-church-gold/20" />

        <div className="flex items-center gap-8 mb-12 relative z-10">
          <div className="relative">
            <span className="w-16 h-16 bg-church-dark text-church-beige-light rounded-2xl flex items-center justify-center font-display text-3xl font-bold shadow-2xl border border-white/10 relative z-10">02</span>
            <div className="absolute -inset-2 bg-church-gold/10 rounded-2xl blur-sm" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight">Dados Pessoais</h3>
            <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold" />
              Informações civis e de contato oficial para assentamento
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
              Nome Completo <span className="text-red-400 font-bold">*</span>
            </label>
            <input
              {...register('nome_completo')}
              className={cn(
                "institutional-input h-[56px] text-lg font-serif italic",
                errors.nome_completo && "border-red-300 bg-red-50/30"
              )}
              placeholder="Nome conforme documento de identidade"
            />
            {errors.nome_completo && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.nome_completo.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Nome Social / Chamado</label>
            <input
              {...register('nome_chamado')}
              className="institutional-input h-[56px] text-lg font-serif italic"
              placeholder="Como prefere ser identificado na comunidade"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
              Contato (WhatsApp) <span className="text-red-400 font-bold">*</span>
            </label>
            <input
              {...register('contato')}
              className={cn(
                "institutional-input h-[56px] font-mono text-lg",
                errors.contato && "border-red-300 bg-red-50/30"
              )}
              placeholder="(00) 00000-0000"
            />
            {errors.contato && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.contato.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
              Data de Nascimento <span className="text-red-400 font-bold">*</span>
            </label>
            <input
              type="date"
              {...register('data_nascimento')}
              className={cn(
                "institutional-input h-[56px] text-lg",
                errors.data_nascimento && "border-red-300 bg-red-50/30"
              )}
            />
            {errors.data_nascimento && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.data_nascimento.message}</p>}
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Endereço Residencial</label>
            <input
              {...register('endereco')}
              className="institutional-input h-[56px] text-lg font-serif italic"
              placeholder="Logradouro, número e complemento"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Bairro / Localidade</label>
            <input
              {...register('bairro')}
              className="institutional-input h-[56px] text-lg font-serif italic"
              placeholder="Ex: Centro, Bairro Nobre..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Ponto de Referência</label>
            <input
              {...register('ponto_referencia')}
              className="institutional-input h-[56px] text-lg font-serif italic"
              placeholder="Próximo a..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Escolaridade</label>
            <input
              {...register('escolaridade')}
              className="institutional-input h-[56px] text-lg font-serif italic"
              placeholder="Ex: Ensino Médio Completo"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Profissão / Ocupação</label>
            <input
              {...register('profissao')}
              className="institutional-input h-[56px] text-lg font-serif italic"
              placeholder="Ocupação atual"
            />
          </div>
        </div>
      </section>

      {/* Vida na Igreja / EJC */}
      <section className="paper-card p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-church-bg/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700" />
        <div className="absolute top-0 left-0 w-1 h-full bg-church-gold/20" />

        <div className="flex items-center gap-8 mb-12 relative z-10">
          <div className="relative">
            <span className="w-16 h-16 bg-church-dark text-church-beige-light rounded-2xl flex items-center justify-center font-display text-3xl font-bold shadow-2xl border border-white/10 relative z-10">03</span>
            <div className="absolute -inset-2 bg-church-gold/10 rounded-2xl blur-sm" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight">Vida na Igreja & EJC</h3>
            <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold" />
              Histórico religioso e vivência comunitária paroquial
            </p>
          </div>
        </div>

        <div className="space-y-12 relative z-10">
          {/* Sacramentos */}
          <div className="space-y-6">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Iniciação Cristã (Sacramentos)</label>
            <div className="flex flex-wrap gap-12">
              {SACRAMENTOS_OPTIONS.map((sac) => (
                <label key={sac} className="flex items-center gap-5 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={sac}
                      {...register('sacramentos')}
                      className="peer w-7 h-7 rounded border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-base font-bold text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{sac}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-church-border/20" />

          {/* EJC Experience */}
          <div className="space-y-10">
            <label className="flex items-center gap-6 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('vivenciou_ejc')}
                  className="peer w-8 h-8 rounded-lg border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-lg font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight">Já vivenciou o Encontro de Jovens com Cristo (EJC)?</span>
            </label>

            {vivenciouEjc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pl-14 animate-in slide-in-from-left-6 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Ano do Encontro *</label>
                  <input
                    type="number"
                    {...register('ano_ejc')}
                    className={cn(
                      "institutional-input h-[56px] font-mono text-lg",
                      errors.ano_ejc && "border-red-300 bg-red-50/30"
                    )}
                  />
                  {errors.ano_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.ano_ejc.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Círculo de Pertença *</label>
                  <input
                    {...register('circulo_ejc')}
                    className={cn(
                      "institutional-input h-[56px] text-lg font-serif italic",
                      errors.circulo_ejc && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Amarelo, Verde, Azul..."
                  />
                  {errors.circulo_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.circulo_ejc.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-church-border/20" />

          {/* Pastoral */}
          <div className="space-y-10">
            <label className="flex items-center gap-6 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('membro_pastoral')}
                  className="peer w-8 h-8 rounded-lg border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-lg font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight">Atua em alguma Pastoral, Movimento ou Serviço?</span>
            </label>

            {membroPastoral && (
              <div className="pl-14 animate-in slide-in-from-left-6 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Identificação da Pastoral/Serviço *</label>
                  <input
                    {...register('qual_pastoral')}
                    className={cn(
                      "institutional-input h-[56px] text-lg font-serif italic",
                      errors.qual_pastoral && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Nome formal da pastoral ou movimento"
                  />
                  {errors.qual_pastoral && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.qual_pastoral.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-church-border/20" />

          {/* Aptidão */}
          <div className="space-y-10">
            <label className="flex items-center gap-6 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('aptidao_artistica')}
                  className="peer w-8 h-8 rounded-lg border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-lg font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight">Possui aptidões musicais ou artísticas?</span>
            </label>

            {aptidaoArtistica && (
              <div className="pl-14 animate-in slide-in-from-left-6 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Descrição da Aptidão *</label>
                  <input
                    {...register('qual_aptidao')}
                    className={cn(
                      "institutional-input h-[56px] text-lg font-serif italic",
                      errors.qual_aptidao && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Instrumentista, Vocalista, Teatro, Artes Visuais..."
                  />
                  {errors.qual_aptidao && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.qual_aptidao.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Equipes */}
      <section className="paper-card p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-church-bg/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700" />
        <div className="absolute top-0 left-0 w-1 h-full bg-church-gold/20" />

        <div className="flex items-center gap-8 mb-12 relative z-10">
          <div className="relative">
            <span className="w-16 h-16 bg-church-dark text-church-beige-light rounded-2xl flex items-center justify-center font-display text-3xl font-bold shadow-2xl border border-white/10 relative z-10">04</span>
            <div className="absolute -inset-2 bg-church-gold/10 rounded-2xl blur-sm" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight">Equipes de Trabalho</h3>
            <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold" />
              Histórico de serviço ministerial no encontro
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
          <div className="space-y-10">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1 block">Equipes em que serviu</label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`serviu-${equipe}`} className="flex items-center gap-5 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_servidas')}
                      className="peer w-6 h-6 rounded border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-stone-500 group-hover/check:text-church-dark transition-colors font-serif italic">{equipe}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1 block">Equipes que coordenou</label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`coord-${equipe}`} className="flex items-center gap-5 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_coordenadas')}
                      className="peer w-6 h-6 rounded border-2 border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-stone-500 group-hover/check:text-church-dark transition-colors font-serif italic">{equipe}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className="paper-card p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-church-bg/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700" />
        <div className="absolute top-0 left-0 w-1 h-full bg-church-gold/20" />

        <div className="flex items-center gap-8 mb-12 relative z-10">
          <div className="relative">
            <span className="w-16 h-16 bg-church-dark text-church-beige-light rounded-2xl flex items-center justify-center font-display text-3xl font-bold shadow-2xl border border-white/10 relative z-10">05</span>
            <div className="absolute -inset-2 bg-church-gold/10 rounded-2xl blur-sm" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight">Informações Adicionais</h3>
            <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-church-gold" />
              Notas administrativas e observações pastorais para o arquivo
            </p>
          </div>
        </div>
        <div className="space-y-4 relative z-10">
          <label className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em] ml-1">Observações Gerais / Notas de Saúde</label>
          <textarea
            {...register('observacoes')}
            rows={6}
            className="institutional-input resize-none p-8 font-serif italic text-lg leading-relaxed"
            placeholder="Relate restrições alimentares, condições de saúde, alergias ou notas pastorais relevantes para o arquivo oficial."
          />
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center justify-end gap-8 pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-10 py-4 rounded border border-church-border text-stone-500 font-black uppercase tracking-[0.25em] text-[11px] hover:bg-stone-50 transition-all flex items-center gap-4"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          Descartar Alterações
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="institutional-button-primary px-12 py-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} strokeWidth={1.5} />
              Processando...
            </>
          ) : (
            <>
              <Save size={18} strokeWidth={1.5} />
              {isEditing ? 'Retificar Assentamento' : 'Efetivar Assentamento'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

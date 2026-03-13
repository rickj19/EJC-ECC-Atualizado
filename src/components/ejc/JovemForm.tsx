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
      <div className="min-h-[70vh] flex items-center justify-center p-12">
        <div className="bg-white p-20 max-w-2xl w-full text-center border border-church-border/10 rounded-[3rem] shadow-2xl shadow-church-dark/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-church-bg/10 opacity-50" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-church-brown text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-church-brown/40 animate-bounce relative">
              <CheckCircle2 size={48} strokeWidth={1.5} />
              {/* Decorative Seal Ring */}
              <div className="absolute -inset-4 border-2 border-church-gold/20 rounded-[2.5rem] animate-pulse" />
            </div>
            
            <h2 className="text-4xl font-display font-bold text-church-dark mb-6 tracking-tight uppercase">Registro Efetivado</h2>
            <p className="text-stone-500 font-serif italic text-lg mb-12 leading-relaxed">
              O assentamento foi devidamente processado e arquivado nos anais desta Secretaria Paroquial.
            </p>
            
            <div className="flex items-center justify-center gap-4 py-6 border-t border-church-border/10">
              <Loader2 className="animate-spin text-church-gold" size={24} />
              <span className="text-[11px] font-bold text-church-gold uppercase tracking-[0.4em]">Retornando ao arquivo...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const FormSection = ({ title, icon: Icon, step, children }: { title: string, icon: any, step: string, children: React.ReactNode }) => (
    <section className="institutional-card p-16 bg-white relative overflow-hidden group shadow-2xl shadow-church-dark/5 border border-church-border/10 rounded-[3rem]">
      {/* Subtle Church Watermark for Section */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none grayscale mix-blend-multiply flex items-center justify-center">
        <Church size={400} strokeWidth={0.5} className="text-church-brown" />
      </div>

      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Icon size={160} strokeWidth={1} className="text-church-dark" />
      </div>

      <div className="flex items-center gap-10 mb-16 relative z-10">
        <div className="w-20 h-20 bg-church-dark text-church-beige-light rounded-[1.5rem] flex items-center justify-center font-display text-3xl font-bold shadow-2xl shadow-church-dark/30">{step}</div>
        <div>
          <h3 className="text-3xl font-display font-bold text-church-dark tracking-tight uppercase">{title}</h3>
          <div className="h-1 w-20 bg-church-gold mt-3 rounded-full opacity-40" />
        </div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-20 max-w-6xl mx-auto pb-48 animate-in fade-in duration-1000">
      {/* Cabeçalho Institucional */}
      <div className="relative mb-20 pb-12 border-b border-church-border/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-church-gold mb-4">
              <div className="h-px w-12 bg-church-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.5em]">Secretaria Paroquial</span>
            </div>
            <h1 className="text-6xl font-display font-bold text-church-dark tracking-tighter">
              Assentamento de <span className="text-church-brown italic font-medium">Jovem</span>
            </h1>
            <p className="text-stone-400 font-medium text-lg max-w-xl leading-relaxed">
              Registro oficial e catalogação de participação no Encontro de Jovens com Cristo da Paróquia São Francisco de Assis.
            </p>
          </div>
          <div className="text-right relative">
            {/* Protocol Stamp Effect */}
            <div className="absolute -top-12 -right-4 w-32 h-32 border-4 border-church-gold/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
              <div className="w-28 h-28 border border-church-gold/20 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-church-gold/30 uppercase tracking-[0.2em] text-center">Secretaria<br/>Paroquial</span>
              </div>
            </div>

            <div className="inline-flex flex-col items-end px-10 py-6 border border-church-border/10 rounded-[2rem] bg-white shadow-2xl shadow-church-dark/5 relative z-10">
              <p className="text-[10px] font-bold text-church-brown/30 uppercase tracking-[0.3em] mb-2">Protocolo de Registro</p>
              <p className="text-3xl font-mono font-bold text-church-gold tracking-tighter">#EJC-{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dados Pessoais */}
      <FormSection title="Identificação Civil" icon={User} step="01">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
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
              <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] mb-4 block px-2">
                Nome Completo <span className="text-church-gold font-bold">*</span>
              </label>
              <input
                {...register('nome_completo')}
                className={cn(
                  "w-full h-16 text-xl font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none",
                  errors.nome_completo && "bg-red-50/50 ring-red-500/10"
                )}
                placeholder="Nome conforme documento de identidade"
              />
              {errors.nome_completo && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 ml-4 animate-pulse">{errors.nome_completo.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">Nome de Chamado (Apelido)</label>
              <input
                {...register('nome_chamado')}
                className="w-full h-14 text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none"
                placeholder="Como o jovem é conhecido"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">
                WhatsApp de Contato <span className="text-church-gold font-bold">*</span>
              </label>
              <input
                {...register('contato')}
                className={cn(
                  "w-full h-14 font-mono text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none",
                  errors.contato && "bg-red-50/50 ring-red-500/10"
                )}
                placeholder="(00) 00000-0000"
              />
              {errors.contato && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 ml-4 animate-pulse">{errors.contato.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">
                Data de Nascimento <span className="text-church-gold font-bold">*</span>
              </label>
              <input
                type="date"
                {...register('data_nascimento')}
                className={cn(
                  "w-full h-14 text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none",
                  errors.data_nascimento && "bg-red-50/50 ring-red-500/10"
                )}
              />
              {errors.data_nascimento && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 ml-4 animate-pulse">{errors.data_nascimento.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">Escolaridade / Formação</label>
              <input
                {...register('escolaridade')}
                className="w-full h-14 text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none"
                placeholder="Ex: Ensino Médio, Superior..."
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Vida na Igreja */}
      <FormSection title="Vida na Igreja & EJC" icon={Church} step="02">
        <div className="space-y-16">
          {/* Sacramentos */}
          <div className="space-y-8">
            <label className="text-[11px] font-bold text-church-brown/40 uppercase tracking-[0.4em] block px-2">Iniciação Cristã (Sacramentos Recebidos)</label>
            <div className="flex flex-wrap gap-12">
              {SACRAMENTOS_OPTIONS.map((sac) => (
                <label key={sac} className="flex items-center gap-5 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={sac}
                      {...register('sacramentos')}
                      className="peer w-8 h-8 rounded-xl border-2 border-church-border/20 text-church-brown focus:ring-church-brown/20 transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-stone-400 group-hover/check:text-church-dark transition-colors uppercase tracking-[0.2em]">{sac}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-church-border/10" />

          {/* EJC Experience */}
          <div className="space-y-12">
            <label className="flex items-center gap-8 cursor-pointer group/check w-fit">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('vivenciou_ejc')}
                  className="peer w-10 h-10 rounded-[1rem] border-2 border-church-border/20 text-church-brown focus:ring-church-brown/20 transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-display font-bold text-church-dark group-hover/check:text-church-brown transition-colors tracking-tight uppercase">Já vivenciou o EJC?</span>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-1">Marque se já participou de algum encontro</p>
              </div>
            </label>

            {vivenciouEjc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pl-16 animate-in slide-in-from-left-6 duration-700">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">Ano do Encontro <span className="text-church-gold font-bold">*</span></label>
                  <input
                    type="number"
                    {...register('ano_ejc')}
                    className={cn(
                      "w-full h-14 font-mono text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none",
                      errors.ano_ejc && "bg-red-50/50 ring-red-500/10"
                    )}
                  />
                  {errors.ano_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 ml-4 animate-pulse">{errors.ano_ejc.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">Círculo <span className="text-church-gold font-bold">*</span></label>
                  <input
                    {...register('circulo_ejc')}
                    className={cn(
                      "w-full h-14 text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none",
                      errors.circulo_ejc && "bg-red-50/50 ring-red-500/10"
                    )}
                    placeholder="Ex: Amarelo, Verde, Azul..."
                  />
                  {errors.circulo_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 ml-4 animate-pulse">{errors.circulo_ejc.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-church-border/10" />

          {/* Pastoral */}
          <div className="space-y-12">
            <label className="flex items-center gap-8 cursor-pointer group/check w-fit">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('membro_pastoral')}
                  className="peer w-10 h-10 rounded-[1rem] border-2 border-church-border/20 text-church-brown focus:ring-church-brown/20 transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-display font-bold text-church-dark group-hover/check:text-church-brown transition-colors tracking-tight uppercase">Atua em alguma Pastoral?</span>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-1">Engajamento em serviços paroquiais</p>
              </div>
            </label>

            {membroPastoral && (
              <div className="pl-16 animate-in slide-in-from-left-6 duration-700">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-church-brown/40 uppercase tracking-[0.3em] block px-2">Qual Pastoral ou Movimento? <span className="text-church-gold font-bold">*</span></label>
                  <input
                    {...register('qual_pastoral')}
                    className={cn(
                      "w-full h-14 text-base font-bold px-8 bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-2xl transition-all outline-none",
                      errors.qual_pastoral && "bg-red-50/50 ring-red-500/10"
                    )}
                    placeholder="Nome da pastoral ou serviço"
                  />
                  {errors.qual_pastoral && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 ml-4 animate-pulse">{errors.qual_pastoral.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Equipes */}
      <FormSection title="Equipes de Trabalho" icon={Save} step="03">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-church-gold rounded-full shadow-lg shadow-church-gold/40" />
              <label className="text-[11px] font-bold text-church-brown uppercase tracking-[0.4em]">Equipes em que serviu</label>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`serviu-${equipe}`} className="flex items-center gap-5 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_servidas')}
                      className="peer w-6 h-6 rounded-lg border-2 border-church-border/20 text-church-brown focus:ring-church-brown/20 transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-stone-400 group-hover/check:text-church-dark transition-colors uppercase tracking-widest">{equipe}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-church-brown rounded-full shadow-lg shadow-church-brown/40" />
              <label className="text-[11px] font-bold text-church-brown uppercase tracking-[0.4em]">Equipes que coordenou</label>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`coord-${equipe}`} className="flex items-center gap-5 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_coordenadas')}
                      className="peer w-6 h-6 rounded-lg border-2 border-church-border/20 text-church-brown focus:ring-church-brown/20 transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-stone-400 group-hover/check:text-church-dark transition-colors uppercase tracking-widest">{equipe}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Observações */}
      <FormSection title="Observações" icon={FileText} step="04">
        <div className="space-y-6">
          <label className="text-[11px] font-bold text-church-brown/40 uppercase tracking-[0.4em] block px-2">Notas Administrativas e de Saúde</label>
          <textarea
            {...register('observacoes')}
            rows={6}
            className="w-full resize-none p-10 text-lg font-medium leading-relaxed bg-church-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-church-gold/5 rounded-[2.5rem] transition-all outline-none"
            placeholder="Relate restrições alimentares, condições de saúde, alergias ou notas pastorais relevantes para o arquivo."
          />
        </div>
      </FormSection>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-8 pt-20 border-t border-church-border/10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-12 py-6 rounded-2xl border border-church-border/20 text-stone-400 font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-church-brown hover:border-church-brown/40 transition-all duration-500 flex items-center justify-center gap-4 group/btn shadow-2xl shadow-church-dark/5"
        >
          <ArrowLeft size={18} className="group-hover/btn:-translate-x-2 transition-transform" />
          Descartar Alterações
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-16 py-6 bg-church-brown text-white rounded-2xl font-bold uppercase tracking-[0.4em] text-[12px] hover:bg-church-dark hover:scale-105 transition-all duration-700 shadow-2xl shadow-church-brown/40 flex items-center justify-center gap-6 disabled:opacity-50 disabled:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processando Registro...
            </>
          ) : (
            <>
              <Save size={20} strokeWidth={2.5} />
              {isEditing ? 'Retificar Assentamento' : 'Efetivar Assentamento'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

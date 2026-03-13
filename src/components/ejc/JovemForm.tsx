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
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white p-12 max-w-xl w-full text-center border border-church-border/40 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-church-beige-light text-church-brown rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-display font-bold text-church-dark mb-4 tracking-tight uppercase">Registro Efetivado</h2>
          <p className="text-stone-600 font-serif italic mb-8 leading-relaxed">
            O assentamento foi devidamente processado e arquivado nos anais desta Secretaria Paroquial.
          </p>
          
          <div className="flex items-center justify-center gap-3 py-4 border-t border-church-border/10">
            <Loader2 className="animate-spin text-church-gold" size={18} />
            <span className="text-[10px] font-bold text-church-gold uppercase tracking-widest">Retornando ao arquivo...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-4xl mx-auto pb-24">
      {/* Cabeçalho Institucional */}
      <div className="relative mb-8 pb-6 border-b border-church-border/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-church-gold mb-1">
              <div className="h-px w-8 bg-church-gold/40" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Secretaria Paroquial</span>
            </div>
            <h1 className="text-3xl font-display text-church-dark">
              Assentamento de <span className="text-church-gold italic">Jovem</span>
            </h1>
            <p className="text-stone-500 font-serif italic text-sm">
              Registro oficial de participação no EJC
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="inline-block px-4 py-2 border border-church-border/40 rounded bg-church-beige-light/20">
              <p className="text-[8px] font-bold text-church-dark uppercase tracking-widest mb-0.5">Protocolo</p>
              <p className="text-lg font-mono text-church-gold">#EJC-{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dados Pessoais */}
      <section className="institutional-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <User size={80} strokeWidth={1} className="text-church-dark" />
        </div>

        <div className="flex items-center gap-6 mb-10 relative z-10">
          <span className="w-12 h-12 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-display text-xl font-bold">01</span>
          <div>
            <h3 className="text-xl font-display font-bold text-church-dark tracking-tight uppercase">Identificação Civil</h3>
            <p className="text-[9px] text-church-gold uppercase font-bold tracking-widest mt-1">
              Dados Pessoais para Assentamento
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
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

          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              <label className="institutional-label mb-2">
                Nome Completo <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                {...register('nome_completo')}
                className={cn(
                  "institutional-input h-12 text-lg font-serif italic px-4",
                  errors.nome_completo && "border-red-300 bg-red-50/30"
                )}
                placeholder="Nome conforme documento"
              />
              {errors.nome_completo && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5">{errors.nome_completo.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="institutional-label">Nome de Chamado</label>
              <input
                {...register('nome_chamado')}
                className="institutional-input h-11 text-base font-serif italic px-4"
                placeholder="Como prefere ser identificado"
              />
            </div>

            <div className="space-y-2">
              <label className="institutional-label">
                WhatsApp <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                {...register('contato')}
                className={cn(
                  "institutional-input h-11 font-mono text-base px-4",
                  errors.contato && "border-red-300 bg-red-50/30"
                )}
                placeholder="(00) 00000-0000"
              />
              {errors.contato && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5">{errors.contato.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="institutional-label">
                Data de Nascimento <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                type="date"
                {...register('data_nascimento')}
                className={cn(
                  "institutional-input h-11 text-base px-4",
                  errors.data_nascimento && "border-red-300 bg-red-50/30"
                )}
              />
              {errors.data_nascimento && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5">{errors.data_nascimento.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="institutional-label">Escolaridade</label>
              <input
                {...register('escolaridade')}
                className="institutional-input h-11 text-base font-serif italic px-4"
                placeholder="Ex: Ensino Médio"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vida na Igreja */}
      <section className="institutional-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Church size={80} strokeWidth={1} className="text-church-dark" />
        </div>

        <div className="flex items-center gap-6 mb-10 relative z-10">
          <span className="w-12 h-12 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-display text-xl font-bold">02</span>
          <div>
            <h3 className="text-xl font-display font-bold text-church-dark tracking-tight uppercase">Vida na Igreja & EJC</h3>
            <p className="text-[9px] text-church-gold uppercase font-bold tracking-widest mt-1">
              Histórico religioso e vivência comunitária
            </p>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          {/* Sacramentos */}
          <div className="space-y-4">
            <label className="institutional-label">Iniciação Cristã (Sacramentos)</label>
            <div className="flex flex-wrap gap-8">
              {SACRAMENTOS_OPTIONS.map((sac) => (
                <label key={sac} className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={sac}
                      {...register('sacramentos')}
                      className="peer w-5 h-5 rounded border border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-base font-medium text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{sac}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-church-border/10" />

          {/* EJC Experience */}
          <div className="space-y-8">
            <label className="flex items-center gap-4 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('vivenciou_ejc')}
                  className="peer w-6 h-6 rounded border border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-lg font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight uppercase">Já vivenciou o EJC?</span>
            </label>

            {vivenciouEjc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-10 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                  <label className="institutional-label">Ano do Encontro *</label>
                  <input
                    type="number"
                    {...register('ano_ejc')}
                    className={cn(
                      "institutional-input h-11 font-mono text-base px-4",
                      errors.ano_ejc && "border-red-300 bg-red-50/30"
                    )}
                  />
                  {errors.ano_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5">{errors.ano_ejc.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="institutional-label">Círculo *</label>
                  <input
                    {...register('circulo_ejc')}
                    className={cn(
                      "institutional-input h-11 text-base font-serif italic px-4",
                      errors.circulo_ejc && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Amarelo, Verde..."
                  />
                  {errors.circulo_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5">{errors.circulo_ejc.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-church-border/10" />

          {/* Pastoral */}
          <div className="space-y-8">
            <label className="flex items-center gap-4 cursor-pointer group/check">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  {...register('membro_pastoral')}
                  className="peer w-6 h-6 rounded border border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <span className="text-lg font-bold text-church-dark group-hover/check:text-church-brown transition-colors font-display tracking-tight uppercase">Atua em alguma Pastoral?</span>
            </label>

            {membroPastoral && (
              <div className="pl-10 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                  <label className="institutional-label">Qual Pastoral/Serviço? *</label>
                  <input
                    {...register('qual_pastoral')}
                    className={cn(
                      "institutional-input h-11 text-base font-serif italic px-4",
                      errors.qual_pastoral && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Nome da pastoral"
                  />
                  {errors.qual_pastoral && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5">{errors.qual_pastoral.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Equipes */}
      <section className="institutional-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Save size={80} strokeWidth={1} className="text-church-dark" />
        </div>

        <div className="flex items-center gap-6 mb-10 relative z-10">
          <span className="w-12 h-12 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-display text-xl font-bold">03</span>
          <div>
            <h3 className="text-xl font-display font-bold text-church-dark tracking-tight uppercase">Equipes de Trabalho</h3>
            <p className="text-[9px] text-church-gold uppercase font-bold tracking-widest mt-1">
              Histórico de serviço ministerial
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <label className="institutional-label block">Equipes em que serviu</label>
            <div className="grid grid-cols-2 gap-4">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`serviu-${equipe}`} className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_servidas')}
                      className="peer w-5 h-5 rounded border border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{equipe}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="institutional-label block">Equipes que coordenou</label>
            <div className="grid grid-cols-2 gap-4">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`coord-${equipe}`} className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={equipe}
                      {...register('equipes_coordenadas')}
                      className="peer w-5 h-5 rounded border border-church-border text-church-brown focus:ring-church-brown transition-all appearance-none checked:bg-church-brown checked:border-church-brown"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-stone-600 group-hover/check:text-church-dark transition-colors font-serif italic">{equipe}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className="institutional-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <FileText size={80} strokeWidth={1} className="text-church-dark" />
        </div>

        <div className="flex items-center gap-6 mb-10 relative z-10">
          <span className="w-12 h-12 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-display text-xl font-bold">04</span>
          <div>
            <h3 className="text-xl font-display font-bold text-church-dark tracking-tight uppercase">Observações</h3>
            <p className="text-[9px] text-church-gold uppercase font-bold tracking-widest mt-1">
              Notas administrativas e de saúde
            </p>
          </div>
        </div>
        <div className="space-y-4 relative z-10">
          <label className="institutional-label">Notas de Saúde / Observações Gerais</label>
          <textarea
            {...register('observacoes')}
            rows={4}
            className="institutional-input resize-none p-4 font-serif italic text-base leading-relaxed"
            placeholder="Relate restrições alimentares, condições de saúde ou notas pastorais relevantes."
          />
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center justify-end gap-6 pt-12 border-t border-church-border/20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded border border-church-border/40 text-stone-500 font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 hover:border-church-border transition-all flex items-center gap-2 group/btn"
        >
          <ArrowLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
          Descartar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="institutional-button-primary px-10 py-2.5 text-[11px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Processando...
            </>
          ) : (
            <>
              <Save size={18} />
              {isEditing ? 'Retificar Assentamento' : 'Efetivar Assentamento'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

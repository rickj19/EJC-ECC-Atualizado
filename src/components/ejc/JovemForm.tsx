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
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-church-green/10 text-church-green rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-church-dark">Registro Concluído</h2>
        <p className="text-stone-500 mt-3 max-w-md mx-auto">Os dados foram processados e arquivados com sucesso no sistema da paróquia.</p>
        <p className="text-church-gold text-xs font-black uppercase tracking-widest mt-6">Redirecionando ao Painel Administrativo...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl mx-auto pb-24">
      {/* Seção de Foto */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-church-border">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-serif text-lg font-bold">01</span>
          <div>
            <h3 className="text-xl font-serif font-bold text-church-dark">Identificação Visual</h3>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Anexar fotografia oficial do registro</p>
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
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-church-border">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-serif text-lg font-bold">02</span>
          <div>
            <h3 className="text-xl font-serif font-bold text-church-dark">Dados Pessoais</h3>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Informações civis e de contato</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Nome Completo *</label>
            <input
              {...register('nome_completo')}
              className={cn(
                "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                errors.nome_completo && "border-red-300 bg-red-50/30"
              )}
              placeholder="Nome conforme documento oficial"
            />
            {errors.nome_completo && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.nome_completo.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Nome Social / Chamado</label>
            <input
              {...register('nome_chamado')}
              className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium"
              placeholder="Como prefere ser identificado"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Contato (WhatsApp) *</label>
            <input
              {...register('contato')}
              className={cn(
                "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                errors.contato && "border-red-300 bg-red-50/30"
              )}
              placeholder="(00) 00000-0000"
            />
            {errors.contato && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.contato.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Data de Nascimento *</label>
            <input
              type="date"
              {...register('data_nascimento')}
              className={cn(
                "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                errors.data_nascimento && "border-red-300 bg-red-50/30"
              )}
            />
            {errors.data_nascimento && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.data_nascimento.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Endereço Residencial</label>
            <input
              {...register('endereco')}
              className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium"
              placeholder="Logradouro, número e complemento"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Bairro</label>
            <input
              {...register('bairro')}
              className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Ponto de Referência</label>
            <input
              {...register('ponto_referencia')}
              className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Escolaridade</label>
            <input
              {...register('escolaridade')}
              className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Profissão / Ocupação</label>
            <input
              {...register('profissao')}
              className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium"
            />
          </div>
        </div>
      </section>

      {/* Vida na Igreja / EJC */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-church-border">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-serif text-lg font-bold">03</span>
          <div>
            <h3 className="text-xl font-serif font-bold text-church-dark">Vida na Igreja & EJC</h3>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Histórico religioso e comunitário</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sacramentos */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Sacramentos Recebidos</label>
            <div className="flex flex-wrap gap-6">
              {SACRAMENTOS_OPTIONS.map((sac) => (
                <label key={sac} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={sac}
                    {...register('sacramentos')}
                    className="w-5 h-5 rounded border-church-border text-church-brown focus:ring-church-brown"
                  />
                  <span className="text-sm font-medium text-stone-600 group-hover:text-church-dark transition-colors">{sac}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          {/* EJC Experience */}
          <div className="space-y-6">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                {...register('vivenciou_ejc')}
                className="w-6 h-6 rounded border-church-border text-church-brown focus:ring-church-brown"
              />
              <span className="text-sm font-bold text-church-dark group-hover:text-church-brown transition-colors">Já vivenciou o Encontro de Jovens com Cristo (EJC)?</span>
            </label>

            {vivenciouEjc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10 animate-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Ano do Encontro *</label>
                  <input
                    type="number"
                    {...register('ano_ejc')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                      errors.ano_ejc && "border-red-300 bg-red-50/30"
                    )}
                  />
                  {errors.ano_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.ano_ejc.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Círculo de Pertença *</label>
                  <input
                    {...register('circulo_ejc')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                      errors.circulo_ejc && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Amarelo, Verde, etc."
                  />
                  {errors.circulo_ejc && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.circulo_ejc.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-stone-100" />

          {/* Pastoral */}
          <div className="space-y-6">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                {...register('membro_pastoral')}
                className="w-6 h-6 rounded border-church-border text-church-brown focus:ring-church-brown"
              />
              <span className="text-sm font-bold text-church-dark group-hover:text-church-brown transition-colors">Atua em alguma Pastoral, Movimento ou Serviço?</span>
            </label>

            {membroPastoral && (
              <div className="pl-10 animate-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Identificação da Pastoral/Serviço *</label>
                  <input
                    {...register('qual_pastoral')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                      errors.qual_pastoral && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Nome da pastoral ou movimento"
                  />
                  {errors.qual_pastoral && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.qual_pastoral.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-stone-100" />

          {/* Aptidão */}
          <div className="space-y-6">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                {...register('aptidao_artistica')}
                className="w-6 h-6 rounded border-church-border text-church-brown focus:ring-church-brown"
              />
              <span className="text-sm font-bold text-church-dark group-hover:text-church-brown transition-colors">Possui aptidões musicais ou artísticas?</span>
            </label>

            {aptidaoArtistica && (
              <div className="pl-10 animate-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Descrição da Aptidão *</label>
                  <input
                    {...register('qual_aptidao')}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium",
                      errors.qual_aptidao && "border-red-300 bg-red-50/30"
                    )}
                    placeholder="Ex: Instrumentista, Vocalista, Teatro, etc."
                  />
                  {errors.qual_aptidao && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.qual_aptidao.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Equipes */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-church-border">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-serif text-lg font-bold">04</span>
          <div>
            <h3 className="text-xl font-serif font-bold text-church-dark">Equipes de Trabalho</h3>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Histórico de serviço no encontro</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1 block">Equipes em que serviu</label>
            <div className="grid grid-cols-2 gap-3">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`serviu-${equipe}`} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={equipe}
                    {...register('equipes_servidas')}
                    className="w-4 h-4 rounded border-church-border text-church-brown focus:ring-church-brown"
                  />
                  <span className="text-xs font-medium text-stone-500 group-hover:text-church-dark transition-colors">{equipe}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1 block">Equipes que coordenou</label>
            <div className="grid grid-cols-2 gap-3">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`coord-${equipe}`} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={equipe}
                    {...register('equipes_coordenadas')}
                    className="w-4 h-4 rounded border-church-border text-church-brown focus:ring-church-brown"
                  />
                  <span className="text-xs font-medium text-stone-500 group-hover:text-church-dark transition-colors">{equipe}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-church-border">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 bg-church-dark text-church-beige-light rounded-lg flex items-center justify-center font-serif text-lg font-bold">05</span>
          <div>
            <h3 className="text-xl font-serif font-bold text-church-dark">Informações Adicionais</h3>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Notas administrativas e observações de saúde</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Observações Gerais</label>
          <textarea
            {...register('observacoes')}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-church-border focus:ring-2 focus:ring-church-brown focus:border-church-brown outline-none transition-all bg-stone-50/30 text-church-dark font-medium resize-none"
            placeholder="Relate restrições alimentares, condições de saúde ou notas pastorais relevantes."
          />
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center justify-end gap-6 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-8 py-3 rounded-xl border border-church-border text-stone-500 font-black uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all flex items-center gap-3"
        >
          <ArrowLeft size={16} />
          Descartar Alterações
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3 rounded-xl bg-church-brown text-white font-black uppercase tracking-widest text-[10px] hover:bg-church-dark transition-all shadow-xl shadow-church-brown/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Processando...
            </>
          ) : (
            <>
              <Save size={16} />
              {isEditing ? 'Retificar Registro' : 'Efetivar Cadastro'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

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
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">Cadastro Realizado!</h2>
        <p className="text-zinc-500 mt-2">Os dados do jovem foram salvos com sucesso.</p>
        <p className="text-zinc-400 text-sm mt-1">Redirecionando para o painel...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Seção de Foto */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm">01</span>
          Identificação Visual
        </h3>
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
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm">02</span>
          Dados Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Nome Completo *</label>
            <input
              {...register('nome_completo')}
              className={cn(
                "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                errors.nome_completo && "border-red-500 bg-red-50"
              )}
              placeholder="Ex: João Silva Santos"
            />
            {errors.nome_completo && <p className="text-xs text-red-500">{errors.nome_completo.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Como gosta de ser chamado?</label>
            <input
              {...register('nome_chamado')}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              placeholder="Ex: Joãozinho"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Contato (WhatsApp) *</label>
            <input
              {...register('contato')}
              className={cn(
                "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                errors.contato && "border-red-500 bg-red-50"
              )}
              placeholder="(00) 00000-0000"
            />
            {errors.contato && <p className="text-xs text-red-500">{errors.contato.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Data de Nascimento *</label>
            <input
              type="date"
              {...register('data_nascimento')}
              className={cn(
                "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                errors.data_nascimento && "border-red-500 bg-red-50"
              )}
            />
            {errors.data_nascimento && <p className="text-xs text-red-500">{errors.data_nascimento.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-700">Endereço</label>
            <input
              {...register('endereco')}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Bairro</label>
            <input
              {...register('bairro')}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Ponto de Referência</label>
            <input
              {...register('ponto_referencia')}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Escolaridade</label>
            <input
              {...register('escolaridade')}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Profissão</label>
            <input
              {...register('profissao')}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Vida na Igreja / EJC */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm">03</span>
          Vida na Igreja & EJC
        </h3>

        <div className="space-y-6">
          {/* Sacramentos */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">Sacramentos</label>
            <div className="flex flex-wrap gap-4">
              {SACRAMENTOS_OPTIONS.map((sac) => (
                <label key={sac} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={sac}
                    {...register('sacramentos')}
                    className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{sac}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* EJC Experience */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('vivenciou_ejc')}
                className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <span className="text-sm font-semibold text-zinc-800">Já vivenciou o EJC?</span>
            </label>

            {vivenciouEjc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 animate-in slide-in-from-left-2 duration-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Ano do EJC *</label>
                  <input
                    type="number"
                    {...register('ano_ejc')}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                      errors.ano_ejc && "border-red-500 bg-red-50"
                    )}
                  />
                  {errors.ano_ejc && <p className="text-xs text-red-500">{errors.ano_ejc.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Círculo *</label>
                  <input
                    {...register('circulo_ejc')}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                      errors.circulo_ejc && "border-red-500 bg-red-50"
                    )}
                    placeholder="Ex: Amarelo"
                  />
                  {errors.circulo_ejc && <p className="text-xs text-red-500">{errors.circulo_ejc.message}</p>}
                </div>
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* Pastoral */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('membro_pastoral')}
                className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <span className="text-sm font-semibold text-zinc-800">Membro de pastoral, movimento ou serviço?</span>
            </label>

            {membroPastoral && (
              <div className="pl-8 animate-in slide-in-from-left-2 duration-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Qual? *</label>
                  <input
                    {...register('qual_pastoral')}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                      errors.qual_pastoral && "border-red-500 bg-red-50"
                    )}
                  />
                  {errors.qual_pastoral && <p className="text-xs text-red-500">{errors.qual_pastoral.message}</p>}
                </div>
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* Aptidão */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('aptidao_artistica')}
                className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <span className="text-sm font-semibold text-zinc-800">Possui aptidão musical ou artística?</span>
            </label>

            {aptidaoArtistica && (
              <div className="pl-8 animate-in slide-in-from-left-2 duration-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Qual? *</label>
                  <input
                    {...register('qual_aptidao')}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all",
                      errors.qual_aptidao && "border-red-500 bg-red-50"
                    )}
                    placeholder="Ex: Toco violão, Canto, Teatro..."
                  />
                  {errors.qual_aptidao && <p className="text-xs text-red-500">{errors.qual_aptidao.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Equipes */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm">04</span>
          Equipes de Trabalho
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-700 block">Equipes em que já serviu</label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`serviu-${equipe}`} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={equipe}
                    {...register('equipes_servidas')}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-xs text-zinc-600">{equipe}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-700 block">Equipes que já coordenou</label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPES_OPTIONS.map(equipe => (
                <label key={`coord-${equipe}`} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={equipe}
                    {...register('equipes_coordenadas')}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-xs text-zinc-600">{equipe}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm">05</span>
          Informações Adicionais
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Observações</label>
          <textarea
            {...register('observacoes')}
            rows={4}
            className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all resize-none"
            placeholder="Alguma informação importante? Restrição alimentar, saúde, etc."
          />
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} />
              {isEditing ? 'Atualizar Cadastro' : 'Finalizar Cadastro'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

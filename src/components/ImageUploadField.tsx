import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { cn } from '../lib/utils';

interface ImageUploadFieldProps {
  value?: {
    url: string;
    path: string;
  };
  onChange: (value: { url: string; path: string } | null) => void;
  error?: string;
  label?: string;
  className?: string;
}

export function ImageUploadField({
  value,
  onChange,
  error,
  label = 'Foto do Jovem',
  className,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Validação de tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      setUploading(true);

      // Gerar um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `jovens/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('fotos-ejc')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('fotos-ejc')
        .getPublicUrl(filePath);

      // Atualizar estados e formulário
      setPreviewUrl(publicUrl);
      onChange({ url: publicUrl, path: filePath });

    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Falha ao enviar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value?.path) return;

    try {
      // Opcional: Deletar do storage ao remover do form
      // await supabase.storage.from('fotos-ejc').remove([value.path]);
      
      setPreviewUrl(null);
      onChange(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Erro ao remover imagem:', err);
    }
  };

  const triggerUpload = (useCamera = false) => {
    if (fileInputRef.current) {
      if (useCamera) {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {label && (
        <label className="text-[12px] font-black text-church-gold uppercase tracking-[0.4em] ml-1 block">
          {label}
        </label>
      )}

      <div className="relative">
        {previewUrl ? (
          <div className="relative group aspect-square w-full max-w-[320px] mx-auto rounded-sm overflow-hidden border-2 border-church-border bg-white shadow-2xl p-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay de Ações */}
            <div className="absolute inset-0 bg-church-dark/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => triggerUpload()}
                className="p-5 bg-white/10 border border-white/20 rounded-sm text-white hover:bg-white/20 transition-all shadow-2xl hover:scale-110 active:scale-95"
                title="Substituir Fotografia"
              >
                <Upload size={24} strokeWidth={1.2} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-5 bg-red-500/20 border border-red-500/40 rounded-sm text-red-200 hover:bg-red-500/40 transition-all shadow-2xl hover:scale-110 active:scale-95"
                title="Remover Fotografia"
              >
                <X size={24} strokeWidth={1.2} />
              </button>
            </div>

            {/* Botão de remover mobile (sempre visível) */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-4 right-4 p-3 bg-red-600 rounded-sm text-white md:hidden shadow-2xl border border-white/20"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => triggerUpload()}
            className={cn(
              "aspect-square w-full max-w-[320px] mx-auto rounded-sm border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-700",
              error ? "border-red-300 bg-red-50/50 text-red-500" : "border-church-border bg-church-beige-light/30 text-stone-400 hover:border-church-gold hover:bg-white hover:shadow-2xl hover:shadow-church-gold/10"
            )}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-church-gold" size={48} />
                <span className="text-[10px] font-black text-church-gold uppercase tracking-[0.4em]">Processando...</span>
              </div>
            ) : (
              <>
                <div className="p-6 bg-white rounded-sm shadow-xl border border-church-border group-hover:border-church-gold transition-colors">
                  <ImageIcon size={40} strokeWidth={1} className="text-church-gold" />
                </div>
                <div className="text-center px-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-church-dark">Anexar Fotografia Oficial</p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mt-3 font-serif italic">Formatos JPG/PNG até 5MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Botões Rápidos (Apenas se não houver imagem ou estiver enviando) */}
        {!previewUrl && !uploading && (
          <div className="flex justify-center gap-6 mt-10">
            <button
              type="button"
              onClick={() => triggerUpload(true)}
              className="flex items-center gap-4 px-10 py-4 bg-church-dark text-church-beige-light rounded-sm text-[11px] font-black uppercase tracking-[0.4em] hover:bg-church-brown transition-all shadow-xl active:scale-95 border border-white/10"
            >
              <Camera size={20} strokeWidth={1.2} />
              Capturar Câmera
            </button>
            <button
              type="button"
              onClick={() => triggerUpload(false)}
              className="flex items-center gap-4 px-10 py-4 bg-white border border-church-border text-church-dark rounded-sm text-[11px] font-black uppercase tracking-[0.4em] hover:bg-stone-50 transition-all shadow-md active:scale-95"
            >
              <Upload size={20} strokeWidth={1.2} />
              Selecionar Arquivo
            </button>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-sm backdrop-blur-md border-2 border-church-gold/20">
            <div className="flex flex-col items-center gap-5">
              <Loader2 className="animate-spin text-church-gold" size={48} />
              <div className="text-center">
                <span className="text-[11px] font-black text-church-dark uppercase tracking-[0.5em] block">Processando</span>
                <span className="text-[9px] font-bold text-church-gold uppercase tracking-[0.3em] mt-1 block">Arquivo Digital</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider text-center mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

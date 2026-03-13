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
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1 block">
          {label}
        </label>
      )}

      <div className="relative">
        {previewUrl ? (
          <div className="relative group aspect-square w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden border-2 border-church-border bg-stone-50 shadow-inner">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay de Ações */}
            <div className="absolute inset-0 bg-church-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => triggerUpload()}
                className="p-3 bg-white rounded-full text-church-dark hover:bg-church-beige-light transition-colors shadow-lg"
                title="Trocar imagem"
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Remover imagem"
              >
                <X size={20} />
              </button>
            </div>

            {/* Botão de remover mobile (sempre visível) */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 bg-red-500 rounded-full text-white md:hidden shadow-xl"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => triggerUpload()}
            className={cn(
              "aspect-square w-full max-w-[240px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all",
              error ? "border-red-300 bg-red-50/50 text-red-500" : "border-church-border bg-stone-50/50 text-stone-400 hover:border-church-gold hover:bg-white hover:shadow-xl hover:shadow-church-gold/5"
            )}
          >
            {uploading ? (
              <Loader2 className="animate-spin text-church-gold" size={40} />
            ) : (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm border border-church-border">
                  <ImageIcon size={32} className="text-church-gold" />
                </div>
                <div className="text-center px-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-church-dark">Anexar Fotografia</p>
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-1">Formatos JPG/PNG até 5MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Botões Rápidos (Apenas se não houver imagem ou estiver enviando) */}
        {!previewUrl && !uploading && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => triggerUpload(true)}
              className="flex items-center gap-3 px-6 py-2.5 bg-church-dark text-church-beige-light rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-church-brown transition-all shadow-md active:scale-95"
            >
              <Camera size={16} />
              Câmera
            </button>
            <button
              type="button"
              onClick={() => triggerUpload(false)}
              className="flex items-center gap-3 px-6 py-2.5 bg-white border border-church-border text-church-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all shadow-sm active:scale-95"
            >
              <Upload size={16} />
              Arquivo
            </button>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-church-gold" size={32} />
              <span className="text-[10px] font-black text-church-dark uppercase tracking-widest">Processando...</span>
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

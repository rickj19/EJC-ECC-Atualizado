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
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-zinc-700 block">
          {label}
        </label>
      )}

      <div className="relative">
        {previewUrl ? (
          <div className="relative group aspect-square w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden border-2 border-zinc-200 bg-zinc-50">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay de Ações */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => triggerUpload()}
                className="p-2 bg-white rounded-full text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Trocar imagem"
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                title="Remover imagem"
              >
                <X size={20} />
              </button>
            </div>

            {/* Botão de remover mobile (sempre visível) */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white md:hidden shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => triggerUpload()}
            className={cn(
              "aspect-square w-full max-w-[240px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
              error ? "border-red-300 bg-red-50 text-red-500" : "border-zinc-300 bg-zinc-50 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100"
            )}
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <>
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <ImageIcon size={32} />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-semibold">Toque para enviar</p>
                  <p className="text-xs opacity-70">JPG ou PNG até 5MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Botões Rápidos (Apenas se não houver imagem ou estiver enviando) */}
        {!previewUrl && !uploading && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => triggerUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <Camera size={18} />
              Câmera
            </button>
            <button
              type="button"
              onClick={() => triggerUpload(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm"
            >
              <Upload size={18} />
              Galeria
            </button>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-zinc-900" size={24} />
              <span className="text-xs font-medium text-zinc-900">Enviando...</span>
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
        <p className="text-xs text-red-500 font-medium text-center mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

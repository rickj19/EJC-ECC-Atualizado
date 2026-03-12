-- Tabela de Jovens do EJC
CREATE TABLE IF NOT EXISTS public.jovens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    nome_chamado TEXT,
    endereco TEXT,
    bairro TEXT,
    ponto_referencia TEXT,
    contato TEXT,
    data_nascimento DATE,
    escolaridade TEXT,
    profissao TEXT,
    foto_url TEXT NOT NULL,
    foto_path TEXT NOT NULL,
    vivenciou_ejc BOOLEAN DEFAULT FALSE,
    ano_ejc INTEGER,
    circulo_ejc TEXT,
    sacramentos TEXT[] DEFAULT '{}',
    membro_pastoral BOOLEAN DEFAULT FALSE,
    qual_pastoral TEXT,
    aptidao_artistica BOOLEAN DEFAULT FALSE,
    qual_aptidao TEXT,
    equipes_servidas TEXT[] DEFAULT '{}',
    equipes_coordenadas TEXT[] DEFAULT '{}',
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.jovens
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.jovens ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (RLS)
-- Permitir leitura para usuários autenticados
CREATE POLICY "Permitir leitura para usuários autenticados" 
ON public.jovens FOR SELECT 
TO authenticated 
USING (true);

-- Permitir inserção para usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" 
ON public.jovens FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Permitir atualização para usuários autenticados
CREATE POLICY "Permitir atualização para usuários autenticados" 
ON public.jovens FOR UPDATE 
TO authenticated 
USING (true);

-- Permitir exclusão para usuários autenticados
CREATE POLICY "Permitir exclusão para usuários autenticados" 
ON public.jovens FOR DELETE 
TO authenticated 
USING (true);

-- ... (código anterior da tabela jovens)

-- Configuração do Storage (Bucket para Fotos)
-- 1. Criar o bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-ejc', 'fotos-ejc', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Segurança para o Bucket fotos-ejc
-- Permitir que usuários autenticados enviem arquivos
CREATE POLICY "Usuários autenticados podem enviar fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fotos-ejc');

-- Permitir que usuários autenticados visualizem arquivos via API
CREATE POLICY "Usuários autenticados podem ver fotos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'fotos-ejc');

-- Permitir que usuários autenticados atualizem suas fotos
CREATE POLICY "Usuários autenticados podem atualizar fotos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fotos-ejc');

-- Permitir que usuários autenticados excluam fotos
CREATE POLICY "Usuários autenticados podem excluir fotos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fotos-ejc');

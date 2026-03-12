import { z } from 'zod';

export const jovemSchema = z.object({
  // Campos Básicos
  nome_completo: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  nome_chamado: z.string().optional(),
  endereco: z.string().optional(),
  bairro: z.string().optional(),
  ponto_referencia: z.string().optional(),
  contato: z.string().min(10, 'Contato inválido (DDD + número)'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  escolaridade: z.string().optional(),
  profissao: z.string().optional(),
  
  // Fotos (vêm do componente ImageUploadField)
  foto_url: z.string().url('URL da foto inválida'),
  foto_path: z.string().min(1, 'Caminho da foto é obrigatório'),

  // EJC
  vivenciou_ejc: z.boolean().default(false),
  ano_ejc: z.coerce.number().int().min(1970).max(new Date().getFullYear()).optional().nullable(),
  circulo_ejc: z.string().optional().nullable(),

  // Pastoral
  membro_pastoral: z.boolean().default(false),
  qual_pastoral: z.string().optional().nullable(),

  // Aptidão
  aptidao_artistica: z.boolean().default(false),
  qual_aptidao: z.string().optional().nullable(),

  // Arrays (Multi-seleção)
  sacramentos: z.array(z.string()).default([]),
  equipes_servidas: z.array(z.string()).default([]),
  equipes_coordenadas: z.array(z.string()).default([]),
  
  observacoes: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validação Condicional: EJC
  if (data.vivenciou_ejc) {
    if (!data.ano_ejc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ano do EJC é obrigatório',
        path: ['ano_ejc'],
      });
    }
    if (!data.circulo_ejc || data.circulo_ejc.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Círculo do EJC é obrigatório',
        path: ['circulo_ejc'],
      });
    }
  }

  // Validação Condicional: Pastoral
  if (data.membro_pastoral && (!data.qual_pastoral || data.qual_pastoral.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe qual pastoral você participa',
      path: ['qual_pastoral'],
    });
  }

  // Validação Condicional: Aptidão
  if (data.aptidao_artistica && (!data.qual_aptidao || data.qual_aptidao.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe qual sua aptidão artística',
      path: ['qual_aptidao'],
    });
  }
});

export type JovemFormData = z.infer<typeof jovemSchema>;

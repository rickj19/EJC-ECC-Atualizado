export interface Jovem {
  id: string;
  nome_completo: string;
  nome_chamado?: string;
  endereco?: string;
  bairro?: string;
  ponto_referencia?: string;
  contato: string;
  data_nascimento: string;
  escolaridade?: string;
  profissao?: string;
  foto_url: string;
  foto_path: string;
  vivenciou_ejc: boolean;
  ano_ejc?: number | null;
  circulo_ejc?: string | null;
  membro_pastoral: boolean;
  qual_pastoral?: string | null;
  aptidao_artistica: boolean;
  qual_aptidao?: string | null;
  sacramentos: string[];
  equipes_servidas: string[];
  equipes_coordenadas: string[];
  observacoes?: string;
  created_at: string;
}

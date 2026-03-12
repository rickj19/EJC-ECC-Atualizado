/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Não informada';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Data inválida';
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata uma data e hora para o padrão brasileiro (DD/MM/AAAA às HH:MM)
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'Não informada';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Data inválida';
  return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Formata um array de strings como uma lista amigável separada por vírgulas
 */
export function formatList(list: string[] | null | undefined): string {
  if (!list || list.length === 0) return 'Nenhuma';
  return list.join(', ');
}

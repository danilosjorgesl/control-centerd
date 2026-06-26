export function brl(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

export function brlShort(value) {
  const v = value || 0;
  if (v >= 1000) return 'R$ ' + (v / 1000).toFixed(1).replace('.', ',') + 'k';
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

export function dataBR(isoStr) {
  if (!isoStr) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return isoStr;
  const [y, m, d] = isoStr.split('-');
  return `${d}/${m}/${y}`;
}

export function diasRestantesTxt(dias) {
  if (dias === null || dias === undefined) return 'Sem vencimento fixo';
  if (dias < 0) return `Vencida há ${Math.abs(dias)} dia${Math.abs(dias) !== 1 ? 's' : ''}`;
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  return `${dias} dias restantes`;
}

export function greetingByHour() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function sinal(valor) {
  return valor >= 0 ? `+${brl(valor)}` : brl(valor);
}

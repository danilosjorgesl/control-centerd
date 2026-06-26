export function pct(atual, meta) {
  if (!meta || meta === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((atual / meta) * 100)));
}

export function evolucaoCaixa(hoje, ontem) {
  return hoje - ontem;
}

export function faltaMeta(producao, meta) {
  return Math.max(0, meta - producao);
}

export function calcularProgressoMeta(valorAtual, valorMeta) {
  return pct(valorAtual, valorMeta);
}

export function calcularFaltaParaMeta(valorAtual, valorMeta) {
  return Math.max(0, valorMeta - valorAtual);
}

export function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function dataLocal(data) {
  if (data instanceof Date) {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(data)) return null;
  const [ano, mes, dia] = data.slice(0, 10).split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diasEntre(inicio, fim) {
  const a = dataLocal(inicio);
  const b = dataLocal(fim);
  if (!a || !b) return 0;
  return Math.round((b - a) / 86400000);
}

function temVencimentoReal(conta) {
  return Boolean(dataLocal(conta?.vencimento));
}

export function contaCritica(conta) {
  return conta?.critica === true || conta?.prioridade === 'critica' || conta?.prioridade === 'alta';
}

function contasOrdenadasPorVencimento(contas) {
  return [...(contas || [])]
    .filter(c => !c.pago && temVencimentoReal(c))
    .sort((a, b) => dataLocal(a.vencimento) - dataLocal(b.vencimento));
}

export function calcularEvolucaoHoje(movimentacoes) {
  const hoje = new Date();
  const hojeKey = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

  return (movimentacoes || []).reduce((total, mov) => {
    if (!mov?.data || mov.data.slice(0, 10) !== hojeKey) return total;
    const valor = Number(mov.valor) || 0;
    return mov.tipo === 'entrada' ? total + valor : total - valor;
  }, 0);
}

export function calcularProximaAmeaca(contas, caixaAtual) {
  const abertas = contasOrdenadasPorVencimento(contas);
  const criticas = abertas.filter(contaCritica);
  const conta = criticas[0] || abertas[0] || null;
  if (!conta) {
    return {
      conta: null,
      coberta: true,
      falta: 0,
      mensagem: 'Nenhuma obrigação relevante em aberto.',
    };
  }

  const falta = Math.max(0, (Number(conta.valor) || 0) - (Number(caixaAtual) || 0));
  return {
    conta,
    coberta: falta === 0,
    falta,
    mensagem: falta > 0 ? `Faltam ${formatarValor(falta)} para cobrir.` : 'Coberta pelo caixa atual.',
  };
}

export function calcularDiasRespiroReal(contas, caixaAtual, dataAtual = new Date()) {
  let caixaSimulado = Number(caixaAtual) || 0;
  const criticas = contasOrdenadasPorVencimento(contas)
    .filter(contaCritica)
    .filter(c => !(c.id === 'combustivel' && c.vencimento === 'uso diário'));

  if (criticas.length === 0) {
    return {
      dias: null,
      label: 'Protegido',
      frase: 'Nenhuma obrigação crítica com vencimento real cadastrada.',
      positiva: true,
    };
  }

  for (let i = 0; i < criticas.length; i += 1) {
    const conta = criticas[i];
    const valor = Number(conta.valor) || 0;
    if (valor > caixaSimulado) {
      const dias = i === 0 ? 0 : Math.max(0, diasEntre(dataAtual, conta.vencimento));
      return {
        dias,
        label: `${dias} dia${dias === 1 ? '' : 's'}`,
        frase: dias === 0
          ? 'Atenção: a próxima obrigação crítica ainda não está coberta.'
          : 'Atenção: existe obrigação crítica sem cobertura no caminho.',
        conta,
        positiva: false,
      };
    }
    caixaSimulado -= valor;
  }

  return {
    dias: null,
    label: 'Cobre as críticas',
    frase: 'As obrigações críticas cadastradas estão cobertas pelo caixa atual.',
    positiva: true,
  };
}

export function diasRespiro(caixa, contas = [], dataAtual = new Date()) {
  return calcularDiasRespiroReal(contas, caixa, dataAtual).dias ?? 0;
}

export function totalContasAbertas(contas) {
  return contas.filter(c => !c.pago).reduce((s, c) => s + (Number(c.valor) || 0), 0);
}

export function totalContasPagas(contas) {
  return contas.filter(c => c.pago).reduce((s, c) => s + (Number(c.valor) || 0), 0);
}

export function progressoContas(contas) {
  const total = contas.length;
  const pagas = contas.filter(c => c.pago).length;
  return total > 0 ? Math.round((pagas / total) * 100) : 0;
}

export function contasDaSemana(contas) {
  const hoje = new Date();
  const fim = new Date(hoje);
  fim.setDate(fim.getDate() + 7);
  return (contas || []).filter(c => {
    if (c.pago) return false;
    const d = dataLocal(c.vencimento);
    return d && d >= dataLocal(hoje) && d <= dataLocal(fim);
  });
}

export function statusOperacao(ritmoHora, mediaEsperada = 40) {
  if (ritmoHora < mediaEsperada * 0.85) return 'abaixo';
  if (ritmoHora > mediaEsperada * 1.15) return 'acima';
  return 'dentro';
}

export function riscoConta(vencimento) {
  const hoje = new Date();
  const d = dataLocal(vencimento);
  if (!d) return 'tranquilo';
  const diff = Math.round((d - dataLocal(hoje)) / 86400000);
  if (diff < 0) return 'vencida';
  if (diff <= 3) return 'critico';
  if (diff <= 7) return 'atencao';
  return 'tranquilo';
}

export function diasParaVencimento(vencimento) {
  const d = dataLocal(vencimento);
  if (!d) return null;
  return Math.round((d - dataLocal(new Date())) / 86400000);
}

export function statusPlanejamento(atual, necessario) {
  const r = pct(atual, necessario);
  if (r >= 90) return 'dentro';
  if (r >= 60) return 'atencao';
  return 'fora';
}

export function recomendacaoPlanejamento(atual, necessario) {
  const r = pct(atual, necessario);
  if (r >= 90) return 'Manter meta padrão de produção.';
  if (r >= 70) return 'Aumentar levemente a produção diária.';
  if (r >= 50) return 'Aumentar produção e proteger combustível.';
  return 'Priorizar conta crítica. Aumentar produção urgente.';
}

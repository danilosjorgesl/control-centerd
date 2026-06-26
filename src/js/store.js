import { save, load } from './storage.js';
import { SEED } from './seed.js?v=4';

let state = null;
const listeners = [];

function ensureState() {
  if (!state) initStore();
}

function cloneSeed() {
  return JSON.parse(JSON.stringify(SEED));
}

function notify() {
  save(state);
  listeners.forEach(fn => fn(state));
}

function novoId(prefixo) {
  if (globalThis.crypto?.randomUUID) return `${prefixo}-${globalThis.crypto.randomUUID()}`;
  return `${prefixo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function dataLocalHoje() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function agoraLocalISO() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function normalizarNumero(valor, fallback = 0) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : fallback;
}

function baseLimpaV3() {
  return {
    ...cloneSeed(),
    schemaVersion: 3,
    caixaAtual: 0,
    caixaOntem: 0,
    movimentacoes: [],
    ultimaDataUso: dataLocalHoje(),
  };
}

function resetarOperacaoDiaria(operacaoAtual = {}) {
  const opSeed = cloneSeed().operacao;
  return {
    ...opSeed,
    metaHoje: normalizarNumero(operacaoAtual.metaHoje, opSeed.metaHoje),
  };
}

function aplicarViradaDeDia(dataAtual) {
  state = {
    ...state,
    ultimaDataUso: dataAtual,
    schemaVersion: 3,
    operacao: resetarOperacaoDiaria(state.operacao),
    diario: {
      ...cloneSeed().diario,
    },
  };
}

export function migrateState(saved) {
  const seed = cloneSeed();
  if (!saved) return baseLimpaV3();

  const schemaAntigo = Number(saved.schemaVersion || 0);
  if (schemaAntigo < 3) {
    return baseLimpaV3();
  }

  return {
    ...seed,
    ...saved,
    schemaVersion: 3,
    caixaAtual: normalizarNumero(saved.caixaAtual, seed.caixaAtual),
    caixaOntem: normalizarNumero(saved.caixaOntem, seed.caixaOntem),
    ultimaDataUso: saved.ultimaDataUso || dataLocalHoje(),
    acessoLiberado: Boolean(saved.acessoLiberado),
    contas: Array.isArray(saved.contas) ? saved.contas : seed.contas,
    projetos: Array.isArray(saved.projetos) ? saved.projetos : seed.projetos,
    movimentacoes: Array.isArray(saved.movimentacoes) ? saved.movimentacoes : [],
    operacao: { ...seed.operacao, ...(saved.operacao || {}) },
    diario: { ...seed.diario, ...(saved.diario || {}) },
    planejamento: Array.isArray(saved.planejamento) ? saved.planejamento : seed.planejamento,
    metas: Array.isArray(saved.metas) ? saved.metas : seed.metas,
  };
}

export function verificarViradaDeDia({ silent = false } = {}) {
  ensureState();
  if (!state) return false;
  const hoje = dataLocalHoje();

  if (!state.ultimaDataUso) {
    state = { ...state, ultimaDataUso: hoje, schemaVersion: 3 };
    if (!silent) notify(); else save(state);
    return false;
  }

  if (state.ultimaDataUso !== hoje) {
    aplicarViradaDeDia(hoje);
    if (!silent) notify(); else save(state);
    return true;
  }

  return false;
}

export function getState() {
  ensureState();
  return state;
}

export function setState(partial) {
  ensureState();
  state = { ...state, ...partial, schemaVersion: 3 };
  notify();
}

export function setNested(key, partial) {
  ensureState();
  state = { ...state, [key]: { ...state[key], ...partial }, schemaVersion: 3 };
  notify();
}

export function subscribe(fn) { listeners.push(fn); }

export function initStore() {
  const saved = load();
  state = migrateState(saved);
  verificarViradaDeDia({ silent: true });
  save(state);
}

export function resetStore() {
  state = baseLimpaV3();
  notify();
}

export function liberarAcesso() {
  setState({ acessoLiberado: true });
}

export function updateConta(id, partial) {
  ensureState();
  const contas = state.contas.map(c => c.id === id ? { ...c, ...partial } : c);
  setState({ contas });
}

export function addConta(conta) {
  ensureState();
  const id = novoId('conta');
  const contas = [...state.contas, { ...conta, id }];
  setState({ contas });
}

export function removeConta(id) {
  ensureState();
  const contas = state.contas.filter(c => c.id !== id);
  setState({ contas });
}

function registrarMovimentacao(mov) {
  const movimentacoes = [
    {
      id: novoId(mov.tipo || 'mov'),
      data: agoraLocalISO(),
      ...mov,
      valor: normalizarNumero(mov.valor),
    },
    ...(state.movimentacoes || []),
  ];
  state = { ...state, movimentacoes, schemaVersion: 3 };
}

export function registrarEntrada({ valor, descricao, origem }) {
  ensureState();
  const valorNum = normalizarNumero(valor);
  if (valorNum <= 0) return { ok: false, erro: 'Valor invÃ¡lido.' };

  state = { ...state, caixaAtual: normalizarNumero(state.caixaAtual) + valorNum };
  registrarMovimentacao({
    tipo: 'entrada',
    descricao: descricao?.trim() || `Entrada ${origem || ''}`.trim(),
    valor: valorNum,
    origem: origem || 'Outro',
  });
  notify();
  return { ok: true };
}

export function registrarSaida({ valor, descricao }) {
  ensureState();
  const valorNum = normalizarNumero(valor);
  if (valorNum <= 0) return { ok: false, erro: 'Valor invÃ¡lido.' };

  state = { ...state, caixaAtual: normalizarNumero(state.caixaAtual) - valorNum };
  registrarMovimentacao({
    tipo: 'saida',
    descricao: descricao?.trim() || 'SaÃ­da',
    valor: valorNum,
  });
  notify();
  return { ok: true };
}

export function pagarConta(contaId) {
  ensureState();
  const conta = state.contas.find(c => c.id === contaId);
  if (!conta) return { ok: false, erro: 'Conta nÃ£o encontrada.' };
  if (conta.pago) return { ok: false, erro: 'Conta jÃ¡ estÃ¡ paga.' };

  const valor = normalizarNumero(conta.valor);
  const contas = state.contas.map(c => c.id === contaId ? { ...c, pago: true } : c);
  state = {
    ...state,
    contas,
    caixaAtual: normalizarNumero(state.caixaAtual) - valor,
  };
  registrarMovimentacao({
    tipo: 'pagamento_conta',
    descricao: `${conta.nome} paga`,
    valor,
    contaId,
  });
  notify();
  return { ok: true };
}

export function registrarAbastecimento({ valor, litros, kmAtual, observacao }) {
  ensureState();
  const valorNum = normalizarNumero(valor);
  if (valorNum <= 0) return { ok: false, erro: 'Valor invÃ¡lido.' };

  const operacao = {
    ...state.operacao,
    abastecimento: normalizarNumero(state.operacao?.abastecimento) + valorNum,
  };
  if (kmAtual) operacao.kmAtual = normalizarNumero(kmAtual);

  state = {
    ...state,
    operacao,
    caixaAtual: normalizarNumero(state.caixaAtual) - valorNum,
  };
  registrarMovimentacao({
    tipo: 'abastecimento',
    descricao: observacao?.trim() || 'Abastecimento',
    valor: valorNum,
    litros: litros ? normalizarNumero(litros) : undefined,
    kmAtual: kmAtual ? normalizarNumero(kmAtual) : undefined,
  });
  notify();
  return { ok: true };
}

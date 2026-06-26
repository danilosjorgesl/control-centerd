import { renderHeaderHero } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import {
  getState,
  pagarConta,
  registrarAbastecimento,
  registrarEntrada,
  registrarSaida,
} from '../js/store.js?v=4';
import { brl, dataBR, greetingByHour, sinal } from '../js/formatters.js?v=4';
import {
  calcularDiasRespiroReal,
  calcularEvolucaoHoje,
  calcularFaltaParaMeta,
  calcularProgressoMeta,
  calcularProximaAmeaca,
} from '../js/calculations.js?v=4';
import { navigate } from '../js/router.js?v=4';

const META_ROBUSTA = 1000;

function fecharModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
}

function abrirModal(titulo, corpo, onSave) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${titulo}</div>
        <button class="modal-close" id="modal-close-btn">×</button>
      </div>
      ${corpo}
    </div>`;

  overlay.querySelector('#modal-close-btn')?.addEventListener('click', fecharModal);
  overlay.querySelector('#quick-save')?.addEventListener('click', () => onSave(overlay));
}

function campoValor(id = 'quick-valor') {
  return `
    <div class="form-group">
      <label class="form-label">Valor</label>
      <input type="number" id="${id}" class="form-input" step="0.01" min="0.01" placeholder="0,00" />
    </div>`;
}

function validarValor(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) {
    alert('Informe um valor maior que zero.');
    return null;
  }
  return n;
}

function abrirEntradaModal(onDone) {
  abrirModal('Entrou dinheiro', `
    ${campoValor()}
    <div class="form-group">
      <label class="form-label">Descrição</label>
      <input type="text" id="quick-desc" class="form-input" placeholder="Ex: Repasse Uber" />
    </div>
    <div class="form-group">
      <label class="form-label">Origem</label>
      <select id="quick-origem" class="form-input">
        <option>Uber</option>
        <option>99</option>
        <option>Pix</option>
        <option>Dinheiro</option>
        <option>Outro</option>
      </select>
    </div>
    <button class="btn btn-primary btn-full" id="quick-save">Salvar entrada</button>
  `, overlay => {
    const valor = validarValor(overlay.querySelector('#quick-valor').value);
    if (!valor) return;
    registrarEntrada({
      valor,
      descricao: overlay.querySelector('#quick-desc').value,
      origem: overlay.querySelector('#quick-origem').value,
    });
    fecharModal();
    onDone();
  });
}

function abrirSaidaModal(onDone) {
  abrirModal('Saiu dinheiro', `
    ${campoValor()}
    <div class="form-group">
      <label class="form-label">Descrição</label>
      <input type="text" id="quick-desc" class="form-input" placeholder="Ex: compra necessária" />
    </div>
    <button class="btn btn-primary btn-full" id="quick-save">Salvar saída</button>
  `, overlay => {
    const valor = validarValor(overlay.querySelector('#quick-valor').value);
    if (!valor) return;
    registrarSaida({ valor, descricao: overlay.querySelector('#quick-desc').value });
    fecharModal();
    onDone();
  });
}

function abrirPagamentoModal(onDone) {
  const s = getState();
  const abertas = s.contas.filter(c => !c.pago);
  abrirModal('Paguei conta', `
    <div class="form-group">
      <label class="form-label">Conta em aberto</label>
      <select id="quick-conta" class="form-input">
        ${abertas.map(c => `<option value="${c.id}">${c.nome} - ${brl(c.valor)} - ${dataBR(c.vencimento)}</option>`).join('')}
      </select>
    </div>
    ${abertas.length === 0 ? '<div class="empty-state-text">Nenhuma conta em aberto.</div>' : '<button class="btn btn-primary btn-full" id="quick-save">Confirmar pagamento</button>'}
  `, overlay => {
    const contaId = overlay.querySelector('#quick-conta')?.value;
    const conta = getState().contas.find(c => c.id === contaId);
    if (!conta || conta.pago) {
      alert('Essa conta já está paga ou não existe.');
      return;
    }
    const saldoDepois = getState().caixaAtual - conta.valor;
    if (saldoDepois < 0 && !confirm('Esse pagamento vai deixar o saldo negativo. Confirmar mesmo assim?')) return;
    const res = pagarConta(contaId);
    if (!res.ok) alert(res.erro || 'Não foi possível pagar a conta.');
    fecharModal();
    onDone();
  });
}

function abrirAbastecimentoModal(onDone) {
  abrirModal('Abasteci', `
    ${campoValor()}
    <div class="form-group">
      <label class="form-label">Litros (opcional)</label>
      <input type="number" id="quick-litros" class="form-input" step="0.01" min="0" placeholder="Ex: 20" />
    </div>
    <div class="form-group">
      <label class="form-label">Km atual (opcional)</label>
      <input type="number" id="quick-km" class="form-input" min="0" placeholder="Ex: 123456" />
    </div>
    <div class="form-group">
      <label class="form-label">Observação (opcional)</label>
      <input type="text" id="quick-obs" class="form-input" placeholder="Ex: gasolina comum" />
    </div>
    <button class="btn btn-primary btn-full" id="quick-save">Salvar abastecimento</button>
  `, overlay => {
    const valor = validarValor(overlay.querySelector('#quick-valor').value);
    if (!valor) return;
    registrarAbastecimento({
      valor,
      litros: overlay.querySelector('#quick-litros').value,
      kmAtual: overlay.querySelector('#quick-km').value,
      observacao: overlay.querySelector('#quick-obs').value,
    });
    fecharModal();
    onDone();
  });
}

function projetoValorAtual(projeto) {
  return Number(projeto.valorAtual ?? projeto.atual ?? 0);
}

function projetoValorMeta(projeto) {
  return Number(projeto.valorMeta ?? projeto.meta ?? 0);
}

function formatarMovDescricao(mov) {
  const prefixo = mov.tipo === 'entrada' ? '+' : '-';
  const nomeTipo = {
    entrada: 'Entrada',
    saida: 'Saída',
    pagamento_conta: 'Conta paga',
    abastecimento: 'Abastecimento',
  }[mov.tipo] || 'Movimentação';
  return `${prefixo} ${brl(mov.valor)} — ${mov.descricao || nomeTipo}`;
}

export function mountHome(content, header, nav) {
  renderHeaderHero(header, 'logo');
  renderBottomNav(nav, 'home');

  function render() {
    const s = getState();
    const producao = (s.operacao?.uberHoje || 0) + (s.operacao?.app99Hoje || 0);
    const evolucaoHoje = calcularEvolucaoHoje(s.movimentacoes);
    const progressoMeta = calcularProgressoMeta(s.caixaAtual, META_ROBUSTA);
    const faltaMeta = calcularFaltaParaMeta(s.caixaAtual, META_ROBUSTA);
    const respiro = calcularDiasRespiroReal(s.contas, s.caixaAtual);
    const ameaca = calcularProximaAmeaca(s.contas, s.caixaAtual);
    const projetos = [...(s.projetos || [])].sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99));
    const ultimas = (s.movimentacoes || []).slice(0, 3);

    content.innerHTML = `
      <div class="home-hero-greeting">
        <h1 class="home-hero-name">${greetingByHour()}, Danilo</h1>
        <p class="home-hero-slogan">Tua liberdade está crescendo.</p>
      </div>

      <div class="page-inner" style="padding-top:0">
        <div class="home-liberdade-card">
          <img src="assets/login/estrada-liberdade-login.png" class="home-caixa-road" onerror="this.style.display='none'" alt="" />
          <div class="home-caixa-overlay"></div>
          <div class="home-liberdade-content">
            <div class="home-liberdade-label">Liberdade atual</div>
            <div class="home-liberdade-value">${brl(s.caixaAtual)}</div>
            <div class="home-liberdade-growth">Evolução de hoje: <strong class="${evolucaoHoje >= 0 ? 'text-green' : 'text-red'}">${sinal(evolucaoHoje)}</strong></div>
          </div>
          <img src="assets/home/planta-crescimento.png" class="home-caixa-plant" onerror="this.style.display='none'" alt="" />
        </div>

        <div class="home-meta-card">
          <div class="home-section-kicker">Primeira meta</div>
          <div class="home-meta-title">Saldo Robusto</div>
          <div class="home-meta-row">
            <strong>${brl(s.caixaAtual)}</strong>
            <span>/ ${brl(META_ROBUSTA)}</span>
          </div>
          <div class="progress-bar home-meta-progress">
            <div class="progress-fill progress-fill-green" style="width:${progressoMeta}%"></div>
          </div>
          <div class="home-meta-bottom">
            <span>${progressoMeta}%</span>
            <span>Faltam ${brl(faltaMeta)}</span>
          </div>
        </div>

        <div class="home-two-stack">
          <div class="home-respiro-card ${respiro.positiva ? 'is-positive' : ''}">
            <div class="home-section-kicker">Dias de respiro real</div>
            <div class="home-respiro-value">${respiro.label}</div>
            <div class="home-respiro-text">${respiro.frase}</div>
          </div>
          <div class="home-ameaca-card">
            <div class="home-section-kicker">Próxima ameaça</div>
            ${ameaca.conta ? `
              <div class="home-ameaca-title">${ameaca.conta.nome} ${dataBR(ameaca.conta.vencimento).slice(0, 5)} — ${brl(ameaca.conta.valor)}</div>
              <div class="${ameaca.coberta ? 'text-green' : 'text-red'} home-ameaca-msg">${ameaca.mensagem}</div>
            ` : `<div class="home-ameaca-title">Sem ameaça cadastrada</div><div class="home-ameaca-msg">${ameaca.mensagem}</div>`}
          </div>
        </div>

        <div class="home-section-title">Ações rápidas</div>
        <div class="home-actions-grid">
          <button class="home-action-btn" data-action="entrada">Entrou dinheiro</button>
          <button class="home-action-btn" data-action="saida">Saiu dinheiro</button>
          <button class="home-action-btn" data-action="pagamento">Paguei conta</button>
          <button class="home-action-btn" data-action="abastecimento">Abasteci</button>
        </div>

        <div class="home-section-title">Projetos em construção</div>
        <div class="home-projects-grid">
          ${projetos.map(p => {
            const atual = projetoValorAtual(p);
            const meta = projetoValorMeta(p);
            const perc = calcularProgressoMeta(atual, meta);
            return `
              <div class="home-project-mini">
                <div class="home-project-name">${p.nome}</div>
                <div class="home-project-values">${brl(atual)} / ${brl(meta)}</div>
                <div class="progress-bar" style="height:5px">
                  <div class="progress-fill progress-fill-green" style="width:${perc}%"></div>
                </div>
                <div class="home-project-percent">${perc}%</div>
              </div>`;
          }).join('')}
        </div>

        <div class="home-section-title">Últimas movimentações</div>
        <div class="home-history-card">
          ${ultimas.length > 0 ? ultimas.map(m => `
            <div class="home-history-row">
              <div>
                <div class="home-history-desc ${m.tipo === 'entrada' ? 'text-green' : 'text-red'}">${formatarMovDescricao(m)}</div>
                <div class="home-history-date">${new Date(m.data).toLocaleString('pt-BR')}</div>
              </div>
            </div>`).join('') : '<div class="home-history-empty">Nenhuma movimentação registrada ainda.</div>'}
        </div>

        <div class="home-section-title">Produção de hoje</div>
        <div class="home-operacao-card" data-nav="operation">
          <div>
            <div class="home-operacao-label">Uber + 99</div>
            <div class="home-operacao-value">${brl(producao)}</div>
          </div>
          <div class="home-operacao-sub">Indicador operacional</div>
        </div>

        <div style="height:12px"></div>
      </div>`;

    content.querySelector('[data-nav="operation"]')?.addEventListener('click', () => navigate('operation'));
    content.querySelector('[data-action="entrada"]')?.addEventListener('click', () => abrirEntradaModal(render));
    content.querySelector('[data-action="saida"]')?.addEventListener('click', () => abrirSaidaModal(render));
    content.querySelector('[data-action="pagamento"]')?.addEventListener('click', () => abrirPagamentoModal(render));
    content.querySelector('[data-action="abastecimento"]')?.addEventListener('click', () => abrirAbastecimentoModal(render));
  }

  render();
}

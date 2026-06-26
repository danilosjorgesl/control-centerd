import { renderHeaderHero } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState, setNested } from '../js/store.js?v=4';
import { brl } from '../js/formatters.js?v=4';
import { pct, faltaMeta, statusOperacao, riscoConta, diasParaVencimento } from '../js/calculations.js?v=4';

function openCheckpointModal(onSave) {
  const s = getState();
  const op = s.operacao;
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">📍 Registrar Checkpoint</div>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Produção Uber (R$)</label>
        <input type="number" id="cp-uber" class="form-input" step="0.01" value="${op.uberHoje}" />
      </div>
      <div class="form-group">
        <label class="form-label">Produção 99 (R$)</label>
        <input type="number" id="cp-99" class="form-input" step="0.01" value="${op.app99Hoje}" />
      </div>
      <div class="form-group">
        <label class="form-label">KM Rodados</label>
        <input type="number" id="cp-km" class="form-input" value="${op.kmRodados}" />
      </div>
      <div class="form-group">
        <label class="form-label">Tempo Ligado</label>
        <input type="text" id="cp-tempo" class="form-input" value="${op.tempoLigado}" placeholder="Ex: 05h 30m" />
      </div>
      <div class="form-group">
        <label class="form-label">Autonomia Atual (km)</label>
        <input type="number" id="cp-auto" class="form-input" value="${op.autonomia}" />
      </div>
      <div class="form-group">
        <label class="form-label">Abastecimento (R$)</label>
        <input type="number" id="cp-abast" class="form-input" step="0.01" value="${op.abastecimento || 0}" />
      </div>
      <button class="btn btn-primary btn-full" id="cp-save">Salvar Checkpoint</button>
    </div>`;

  overlay.querySelector('#modal-close-btn').addEventListener('click', () => {
    overlay.classList.add('hidden'); overlay.innerHTML = '';
  });
  overlay.querySelector('#cp-save').addEventListener('click', () => {
    const uber = parseFloat(overlay.querySelector('#cp-uber').value) || 0;
    const app99 = parseFloat(overlay.querySelector('#cp-99').value) || 0;
    const km = parseInt(overlay.querySelector('#cp-km').value) || 0;
    const tempo = overlay.querySelector('#cp-tempo').value;
    const auto = parseInt(overlay.querySelector('#cp-auto').value) || 0;
    const abast = parseFloat(overlay.querySelector('#cp-abast').value) || 0;
    setNested('operacao', { uberHoje: uber, app99Hoje: app99, kmRodados: km, tempoLigado: tempo, autonomia: auto, abastecimento: abast });
    overlay.classList.add('hidden'); overlay.innerHTML = '';
    onSave();
  });
}

export function mountOperation(content, header, nav) {
  renderHeaderHero(header, 'steering');
  renderBottomNav(nav, 'operation', 'operation');

  function render() {
    const s = getState();
    const op = s.operacao;
    const producao = op.uberHoje + op.app99Hoje;
    const p = pct(producao, op.metaHoje);
    const falta = faltaMeta(producao, op.metaHoje);
    const statusOp = statusOperacao(op.ritmoHora);
    const statusTxt = statusOp === 'acima' ? 'Acima da média' : statusOp === 'dentro' ? 'Dentro da média' : 'Abaixo da média';
    const koviConta = s.contas.find(c => c.nome === 'Kovi' && !c.pago);
    const koviDias = koviConta ? diasParaVencimento(koviConta.vencimento) : null;

    content.innerHTML = `
      <!-- GREETING -->
      <div class="home-hero-greeting">
        <h1 class="home-hero-name">Bom dia, Danilo! 👋</h1>
        <p class="home-hero-slogan">Foco hoje. <span style="color:var(--green);font-weight:700">Liberdade</span> amanhã.</p>
      </div>

      <div class="page-inner" style="padding-top:4px">
        <div class="op-page-title">OPERAÇÃO</div>

        <!-- PRODUÇÃO -->
        <div class="card op-prod-card">
          <div style="display:flex;align-items:flex-start;gap:12px">
            <img src="assets/home/dinheiro-producao.png" class="op-big-asset"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-big-asset-fallback" style="display:none">💰</div>
            <div style="flex:1">
              <div class="op-card-label">PRODUÇÃO HOJE</div>
              <div class="op-prod-value">${brl(producao)}</div>
            </div>
          </div>
          <div class="op-prod-row">
            <div class="op-prod-col">
              <div class="op-prod-col-label">Uber</div>
              <div class="op-prod-col-value text-blue">${brl(op.uberHoje)}</div>
            </div>
            <div class="op-prod-divider"></div>
            <div class="op-prod-col">
              <div class="op-prod-col-label"><span class="badge-99">99</span></div>
              <div class="op-prod-col-value" style="color:#F59E0B">${brl(op.app99Hoje)}</div>
            </div>
            <div class="op-prod-divider"></div>
            <div class="op-prod-col">
              <div class="op-prod-col-label">Total</div>
              <div class="op-prod-col-value text-green">${brl(producao)}</div>
            </div>
          </div>
        </div>

        <!-- MISSÃO -->
        <div class="card op-missao-card">
          <div style="display:flex;align-items:flex-start;gap:12px">
            <img src="assets/home/alvo-missao.png" class="op-big-asset"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-big-asset-fallback" style="display:none">🎯</div>
            <div style="flex:1">
              <div class="op-card-label">MISSÃO DE HOJE</div>
              <div class="op-missao-value">Meta: ${brl(op.metaHoje)}</div>
              <div class="progress-bar" style="height:8px;margin:10px 0 8px;border-radius:99px">
                <div class="progress-fill" style="width:${p}%;border-radius:99px"></div>
              </div>
              <div class="op-missao-cols">
                <div class="op-missao-col">
                  <div class="op-missao-col-label">Produzido</div>
                  <div class="op-missao-col-value text-blue">${brl(producao)}</div>
                </div>
                <div class="op-missao-col">
                  <div class="op-missao-col-label">Falta</div>
                  <div class="op-missao-col-value text-red">${brl(falta)}</div>
                </div>
                <div class="op-missao-col">
                  <div class="op-missao-col-label">Progresso</div>
                  <div class="op-missao-col-value text-blue">${p}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RITMO + CHECKPOINT lado a lado -->
        <div class="op-two-col">
          <div class="card op-ritmo-card">
            <div class="op-card-label">RITMO ATUAL</div>
            <img src="assets/operacao/velocimetro-performance.png" class="op-ritmo-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-ritmo-img-fallback" style="display:none">⚡</div>
            <div class="op-ritmo-value">${brl(op.ritmoHora)}<span class="op-ritmo-unit">/h</span></div>
            <div class="op-ritmo-status">
              <span style="color:var(--green)">↗</span>
              <span style="color:var(--green);font-weight:600;font-size:13px"> ${statusTxt}</span>
            </div>
          </div>
          <div class="card op-checkpoint-card">
            <div class="op-card-label">PRÓXIMO CHECKPOINT</div>
            <img src="assets/operacao/checkpoint.png" class="op-checkpoint-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-checkpoint-img-fallback" style="display:none">📋</div>
            <div class="op-checkpoint-text">Registre seu progresso e mantenha o controle.</div>
            <button class="btn-registrar" id="btn-checkpoint">REGISTRAR AGORA</button>
          </div>
        </div>

        <!-- RESUMO OPERACIONAL -->
        <div class="op-section-title">RESUMO OPERACIONAL</div>
        <div class="op-resumo-grid">
          <div class="op-resumo-item">
            <img src="assets/operacao/km-rodados.png" class="op-resumo-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-resumo-img-fallback" style="display:none">🛣️</div>
            <div class="op-resumo-label">KM RODADOS</div>
            <div class="op-resumo-value">${op.kmRodados} <span class="op-resumo-unit">km</span></div>
          </div>
          <div class="op-resumo-item">
            <img src="assets/operacao/tempo-ligado.png" class="op-resumo-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-resumo-img-fallback" style="display:none">⏱️</div>
            <div class="op-resumo-label">TEMPO LIGADO</div>
            <div class="op-resumo-value">${op.tempoLigado}</div>
          </div>
          <div class="op-resumo-item">
            <img src="assets/operacao/consumo-medio.png" class="op-resumo-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-resumo-img-fallback" style="display:none">⛽</div>
            <div class="op-resumo-label">CONSUMO MÉDIO</div>
            <div class="op-resumo-value">${op.consumoMedio} <span class="op-resumo-unit">km/l</span></div>
          </div>
          <div class="op-resumo-item">
            <img src="assets/operacao/autonomia.png" class="op-resumo-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="" />
            <div class="op-resumo-img-fallback" style="display:none">🔋</div>
            <div class="op-resumo-label">AUTONOMIA</div>
            <div class="op-resumo-value">${op.autonomia} <span class="op-resumo-unit">km</span></div>
          </div>
        </div>

        <!-- PRÓXIMO RISCO -->
        ${koviConta ? `
        <div class="op-risco-card">
          <div class="op-risco-icon">⚠️</div>
          <div class="op-risco-body">
            <div class="op-risco-label">PRÓXIMO RISCO</div>
            <div class="op-risco-title">Kovi vence em ${koviDias} dias</div>
            <div class="op-risco-sub">Mantenha o ritmo para garantir sua vantagem.</div>
          </div>
          <div style="color:var(--gray-400);font-size:20px;align-self:center;flex-shrink:0">›</div>
        </div>` : ''}

        <div style="height:12px"></div>
      </div>`;

    content.querySelector('#btn-checkpoint')?.addEventListener('click', () => openCheckpointModal(() => render()));
  }

  render();
}

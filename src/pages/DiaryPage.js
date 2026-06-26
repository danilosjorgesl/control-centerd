import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState, setNested } from '../js/store.js?v=4';
import { brl } from '../js/formatters.js?v=4';
import { evolucaoCaixa } from '../js/calculations.js?v=4';

export function mountDiary(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'more');

  function render() {
    const s = getState();
    const op = s.operacao;
    const producao = op.uberHoje + op.app99Hoje;
    const evolucao = evolucaoCaixa(s.caixaAtual, s.caixaOntem);
    const evolPct = s.caixaOntem > 0 ? ((evolucao / s.caixaOntem) * 100).toFixed(2) : 0;
    const diario = s.diario || {};

    const classes = [
      { id: 'evolution', label: '🌱 Dia de evolução' },
      { id: 'protection', label: '🛡️ Dia de proteção' },
      { id: 'attention', label: '⚠️ Dia de atenção' },
      { id: 'risk', label: '🚨 Dia de risco' },
    ];

    const clsCfg = {
      evolution: { color:'var(--green)', bg:'var(--green-light)' },
      protection: { color:'var(--blue)', bg:'var(--blue-light)' },
      attention: { color:'var(--orange)', bg:'var(--orange-light)' },
      risk: { color:'var(--red)', bg:'var(--red-light)' },
    };

    const selCls = diario.classificacao;

    content.innerHTML = `
      <div class="page-inner">
        <h2 class="page-h2">Diário</h2>
        <div class="page-sub">Registro diário da operação</div>

        <!-- TOP 3 STATS -->
        <div class="diary-top-stats">
          <div class="diary-stat-box">
            <div class="diary-stat-label">Caixa ontem</div>
            <div class="diary-stat-value">${brl(s.caixaOntem)}</div>
          </div>
          <div class="diary-stat-box diary-stat-box-green">
            <div class="diary-stat-label" style="color:#16A34A">Caixa hoje</div>
            <div class="diary-stat-value" style="color:#16A34A">${brl(s.caixaAtual)}</div>
          </div>
          <div class="diary-stat-box diary-stat-box-blue">
            <div class="diary-stat-label" style="color:var(--blue)">Evolução</div>
            <div class="diary-stat-value" style="color:var(--blue)">+${brl(evolucao)}</div>
          </div>
        </div>
        <div style="text-align:center;margin:-4px 0 16px">
          <span class="badge badge-green">+${evolPct}% vs ontem</span>
        </div>

        <!-- PRODUÇÃO DO DIA -->
        <div class="card" style="margin-bottom:12px">
          <div class="diary-section-label">Produção do dia</div>
          <div class="diary-prod-row">
            <div class="diary-prod-col">
              <div class="diary-prod-label">Uber</div>
              <div class="diary-prod-value text-blue">${brl(op.uberHoje)}</div>
            </div>
            <div class="diary-prod-col">
              <div class="diary-prod-label"><span class="badge-99">99</span></div>
              <div class="diary-prod-value" style="color:#F59E0B">${brl(op.app99Hoje)}</div>
            </div>
            <div class="diary-prod-col">
              <div class="diary-prod-label">Total</div>
              <div class="diary-prod-value text-blue">${brl(producao)}</div>
            </div>
          </div>
        </div>

        <!-- DADOS OPERACIONAIS -->
        <div class="card" style="margin-bottom:12px">
          <div class="diary-data-row">
            <span class="diary-data-label">Abastecimento</span>
            <input type="number" id="diary-abast" class="diary-data-input" step="0.01"
              value="${op.abastecimento || 0}" placeholder="R$ 0,00" />
          </div>
          <div class="divider"></div>
          <div class="diary-data-row">
            <span class="diary-data-label">Km rodados</span>
            <span class="diary-data-value">${op.kmRodados} km</span>
          </div>
          <div class="divider"></div>
          <div class="diary-data-row">
            <span class="diary-data-label">Tempo ligado</span>
            <span class="diary-data-value">${op.tempoLigado}</span>
          </div>
        </div>

        <!-- OBSERVAÇÃO -->
        <div class="card" style="margin-bottom:12px">
          <div class="diary-section-label">Observação do dia</div>
          <textarea id="diary-obs" class="form-input" rows="3" style="resize:none;margin-top:8px"
            placeholder="O que aconteceu hoje?">${diario.observacao || ''}</textarea>
        </div>

        <!-- CLASSIFICAÇÃO -->
        <div class="card" style="margin-bottom:16px">
          <div class="diary-classify-row">
            <div class="diary-section-label" style="margin:0">Classificação do dia</div>
            ${selCls ? `<span class="diary-cls-badge" style="background:${clsCfg[selCls]?.bg};color:${clsCfg[selCls]?.color}">
              ${classes.find(c=>c.id===selCls)?.label} 🏆
            </span>` : ''}
          </div>
          <div class="diary-cls-grid">
            ${classes.map(c => `
              <button class="diary-cls-btn ${selCls === c.id ? 'selected' : ''}" data-cls="${c.id}"
                style="${selCls === c.id ? `background:${clsCfg[c.id].bg};border-color:${clsCfg[c.id].color};color:${clsCfg[c.id].color}` : ''}">
                ${c.label}
              </button>`).join('')}
          </div>
        </div>

        <!-- BOTÃO COPIAR -->
        <button class="btn btn-primary btn-full" id="diary-save" style="margin-bottom:8px">
          Salvar Diário
        </button>
        <button class="btn-copy-report" id="diary-copy">
          <span>📋</span> Copiar relatório do dia
        </button>

        <div style="height:12px"></div>
      </div>`;

    content.querySelectorAll('[data-cls]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = s.diario?.classificacao;
        setNested('diario', { classificacao: cur === btn.dataset.cls ? '' : btn.dataset.cls });
        render();
      });
    });

    content.querySelector('#diary-save')?.addEventListener('click', () => {
      const abast = parseFloat(content.querySelector('#diary-abast').value) || 0;
      const obs = content.querySelector('#diary-obs').value;
      setNested('operacao', { abastecimento: abast });
      setNested('diario', { observacao: obs });
      alert('Diário salvo! ✅');
    });

    content.querySelector('#diary-copy')?.addEventListener('click', () => {
      const contas = s.contas;
      const pagas = contas.filter(c => c.pago).length;
      const clsLabels = { evolution:'Dia de evolução', protection:'Dia de proteção', attention:'Dia de atenção', risk:'Dia de risco' };
      const texto = `RELATÓRIO DO DIA — OPERAÇÃO DANILO
==============================
Caixa ontem: ${brl(s.caixaOntem)}
Caixa hoje: ${brl(s.caixaAtual)}
Evolução: +${brl(evolucao)}
Produção Uber: ${brl(op.uberHoje)}
Produção 99: ${brl(op.app99Hoje)}
Total produzido: ${brl(producao)}
Km rodados: ${op.kmRodados} km
Tempo ligado: ${op.tempoLigado}
Consumo médio: ${op.consumoMedio} km/l
Autonomia: ${op.autonomia} km
Abastecimento: ${brl(op.abastecimento || 0)}
Contas pagas hoje: ${pagas} de ${contas.length}
Observação: ${s.diario?.observacao || 'Sem observação'}
Classificação: ${clsLabels[s.diario?.classificacao] || 'Não classificado'}`;
      navigator.clipboard.writeText(texto).then(() => alert('Relatório copiado! 📋')).catch(() => alert('Não foi possível copiar.'));
    });
  }

  render();
}

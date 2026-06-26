import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState } from '../js/store.js?v=4';
import { brl, dataBR } from '../js/formatters.js?v=4';
import { pct, statusPlanejamento, recomendacaoPlanejamento } from '../js/calculations.js?v=4';

const STATUS_CFG = {
  dentro: { label: 'Dentro do plano', color: 'var(--green)', bg: 'var(--green-light)' },
  atencao: { label: 'Atenção', color: 'var(--orange)', bg: 'var(--orange-light)' },
  fora: { label: 'Fora do plano', color: 'var(--red)', bg: 'var(--red-light)' },
};

export function mountPlanning(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'more');

  const s = getState();

  content.innerHTML = `
    <div class="page-inner">
      <h2 class="page-h2">Planejamento</h2>
      <div class="page-sub">Projeções e datas importantes</div>

      ${s.planejamento.map(p => {
        const st = statusPlanejamento(s.caixaAtual, p.necessario);
        const sc = STATUS_CFG[st];
        const perc = pct(s.caixaAtual, p.necessario);
        const falta = Math.max(0, p.necessario - s.caixaAtual);

        return `
          <div class="plan-row">
            <div class="plan-row-icon">📅</div>
            <div class="plan-row-body">
              <div class="plan-row-date">Até ${dataBR(p.data)}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                <div class="plan-row-title">${p.objetivo}</div>
                <span class="plan-status-badge" style="background:${sc.bg};color:${sc.color}">${sc.label}</span>
              </div>
              <div class="plan-row-obj">Objetivo: ${brl(p.necessario)}</div>
              <div class="plan-row-falta" style="color:${falta > 0 ? 'var(--orange)' : 'var(--green)'}">
                Faltam ${brl(falta)}
              </div>
              <div class="progress-bar" style="height:5px;margin:8px 0 0;background:#E2E8F0">
                <div class="progress-fill" style="width:${perc}%;background:${sc.color}"></div>
              </div>
            </div>
          </div>`;
      }).join('')}

      <div style="height:12px"></div>
    </div>`;
}

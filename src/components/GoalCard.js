import { pct } from '../js/calculations.js';
import { brl } from '../js/formatters.js';

export function goalCard(meta) {
  const p = pct(meta.atual, meta.meta);
  const falta = Math.max(0, meta.meta - meta.atual);
  return `
    <div class="goal-card">
      <div class="goal-icon">${meta.icone}</div>
      <div class="goal-body">
        <div class="goal-name">${meta.nome}</div>
        <div class="goal-phrase">${meta.frase}</div>
        <div class="goal-current">${brl(meta.atual)}</div>
        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${p}%"></div>
          </div>
          <div class="goal-values">
            <span>${p}%</span>
            <span>Faltam ${brl(falta)}</span>
          </div>
        </div>
      </div>
    </div>`;
}

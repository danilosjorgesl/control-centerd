import { pct } from '../js/calculations.js';
import { brl } from '../js/formatters.js';

export function projectCard(proj) {
  const p = pct(proj.atual, proj.meta);
  const falta = Math.max(0, proj.meta - proj.atual);
  return `
    <div class="project-card">
      <div class="project-card-top" style="background:linear-gradient(135deg,${proj.cor},${proj.cor}99)">
        <span class="project-icon">${proj.icone}</span>
        <div>
          <div class="project-name">${proj.nome}</div>
          <div class="project-status">${p}% concluído</div>
        </div>
      </div>
      <div class="project-card-body">
        <div class="project-amounts">
          <div class="project-amount">
            <div class="project-amount-label">Guardado</div>
            <div class="project-amount-value">${brl(proj.atual)}</div>
          </div>
          <div class="project-amount">
            <div class="project-amount-label">Meta</div>
            <div class="project-amount-value">${brl(proj.meta)}</div>
          </div>
          <div class="project-amount">
            <div class="project-amount-label">Faltam</div>
            <div class="project-amount-value text-orange">${brl(falta)}</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${p}%;background:${proj.cor}"></div>
        </div>
      </div>
    </div>`;
}

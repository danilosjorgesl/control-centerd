import { pct } from '../js/calculations.js';
import { brl } from '../js/formatters.js';

export function progressCard({ label, atual, meta, colorClass = '', assetSrc = '', assetFallback = '📊' }) {
  const p = pct(atual, meta);
  return `
    <div class="card">
      <div class="card-icon-row">
        <div>
          <img src="${assetSrc}" class="card-asset"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            alt="" />
          <div class="card-asset-fallback" style="display:none">${assetFallback}</div>
        </div>
        <div style="flex:1">
          <div class="card-label">${label}</div>
          <div class="card-value ${colorClass}">${brl(atual)}</div>
          <div class="progress-wrap">
            <div class="progress-info">
              <span>${brl(atual)}</span>
              <span>${brl(meta)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${p}%"></div>
            </div>
          </div>
          <div class="card-sub">${p}% concluído</div>
        </div>
      </div>
    </div>`;
}

import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState } from '../js/store.js?v=4';
import { brl } from '../js/formatters.js?v=4';
import { pct } from '../js/calculations.js?v=4';

const META_ICONS = ['🏦','📈','🚀','✅','🚗','🔓'];

function metaRow(meta, idx) {
  const p = pct(meta.atual, meta.meta);
  const falta = Math.max(0, meta.meta - meta.atual);
  return `
    <div class="goals-row">
      <div class="goals-row-icon">${META_ICONS[idx] || '🎯'}</div>
      <div class="goals-row-body">
        <div class="goals-row-name">${meta.nome}</div>
        <div class="goals-row-vals">Meta: ${brl(meta.meta)} · Atual: <strong>${brl(meta.atual)}</strong></div>
        <div class="progress-bar" style="height:5px;margin:6px 0 4px;background:#E2E8F0">
          <div class="progress-fill" style="width:${p}%;background:${p >= 100 ? 'var(--green)' : 'var(--blue)'}"></div>
        </div>
        <div class="goals-row-bottom">
          <span style="font-size:12px;color:var(--gray-400)">Faltam ${brl(falta)}</span>
          <span style="font-size:12px;font-weight:700;color:${p >= 100 ? 'var(--green)' : 'var(--blue)'}">${p}%</span>
        </div>
      </div>
    </div>`;
}

export function mountGoals(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'goals');

  const s = getState();
  const concluidas = s.metas.filter(m => pct(m.atual, m.meta) >= 100).length;

  content.innerHTML = `
    <div class="page-inner">
      <h2 class="page-h2">Metas</h2>
      <div class="page-sub">${concluidas} de ${s.metas.length} concluídas</div>

      <!-- HERO RESERVA -->
      <div class="goals-hero-card">
        <div class="goals-hero-left">
          <div class="goals-hero-q">O que estou construindo?</div>
          <div class="goals-hero-sub">Sua reserva atual</div>
          <div class="goals-hero-value">${brl(s.caixaAtual)}</div>
          <div class="goals-hero-phrase">Cada real guardado é um passo<br>na direção certa.</div>
        </div>
        <img src="assets/home/planta-inicial.png" class="goals-hero-plant"
          onerror="this.style.display='none'" alt="" />
      </div>

      <!-- LISTA METAS -->
      ${s.metas.map((m, i) => metaRow(m, i)).join('')}

      <div style="height:12px"></div>
    </div>`;
}

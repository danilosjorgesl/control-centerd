import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState } from '../js/store.js?v=4';
import { brl } from '../js/formatters.js?v=4';
import { pct } from '../js/calculations.js?v=4';

const PROJ_BG = ['#1B4FE8','#22C55E','#8B5CF6','#F59E0B','#EC4899'];
const PROJ_EMOJI = ['🏠','⚡','🛏️','🔥','🎁'];

function projRow(proj, idx) {
  const atual = Number(proj.valorAtual ?? proj.atual ?? 0);
  const meta = Number(proj.valorMeta ?? proj.meta ?? 0);
  const p = pct(atual, meta);
  const falta = Math.max(0, meta - atual);
  const bg = PROJ_BG[idx % PROJ_BG.length];

  return `
    <div class="proj-row">
      <div class="proj-row-thumb" style="background:${bg}15;border:2px solid ${bg}30">
        <span style="font-size:36px">${PROJ_EMOJI[idx] || '🏗️'}</span>
      </div>
      <div class="proj-row-body">
        <div class="proj-row-name">${proj.nome}</div>
        <div class="proj-row-vals">${proj.descricao || 'Projeto familiar em construção.'}</div>
        <div class="proj-row-vals" style="margin-top:4px">Meta: ${brl(meta)}</div>
        <div class="proj-row-vals" style="margin-top:2px">Atual: <strong style="color:${bg}">${brl(atual)}</strong></div>
        <div class="progress-bar" style="height:5px;margin:6px 0 3px;background:#E2E8F0">
          <div class="progress-fill" style="width:${p}%;background:${bg}"></div>
        </div>
        <div class="proj-row-bottom">
          <span style="font-size:11px;font-weight:600;color:${bg}">${p}%</span>
          <span style="font-size:11px;color:var(--gray-400)">Faltam ${brl(falta)}</span>
        </div>
      </div>
    </div>`;
}

export function mountProjects(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'projects');

  const s = getState();
  const projetos = [...s.projetos].sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99));

  content.innerHTML = `
    <div class="page-inner">
      <h2 class="page-h2">Projetos</h2>
      <div class="page-sub">Sonhos que se tornam planos</div>

      ${projetos.map((p, i) => projRow(p, i)).join('')}

      <button class="btn-add-proj">+ Novo Projeto</button>

      <div style="height:12px"></div>
    </div>`;
}

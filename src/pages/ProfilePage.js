import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState } from '../js/store.js?v=4';
import { brl } from '../js/formatters.js?v=4';
import { diasRespiro, pct } from '../js/calculations.js?v=4';

export function mountProfile(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'more');

  const s = getState();
  const op = s.operacao;
  const producao = op.uberHoje + op.app99Hoje;
  const dias = diasRespiro(s.caixaAtual, s.contas);
  const metasAtivas = s.metas.filter(m => pct(m.atual, m.meta) < 100).length;
  const projAtivos = s.projetos.length;
  const producaoMes = producao * 20;

  const stats = [
    { icon:'🌱', label:'Reserva atual', value: brl(s.caixaAtual), color:'var(--green)' },
    { icon:'🏆', label:'Melhor dia',    value: brl(s.caixaAtual), color:'var(--orange)' },
    { icon:'📈', label:'Produção do mês', value: brl(producaoMes), color:'var(--blue)' },
    { icon:'🛡️', label:'Dias de respiro', value: `${dias}`, color:'var(--blue)' },
    { icon:'🎯', label:'Metas ativas',  value: `${metasAtivas}`, color:'var(--blue)' },
    { icon:'🔧', label:'Projetos ativos', value: `${projAtivos}`, color:'var(--green)' },
  ];

  content.innerHTML = `
    <div class="page-inner">
      <h2 class="page-h2">Perfil Danilo</h2>
      <div class="page-sub">Resumo da sua operação</div>

      <!-- HERO CARD -->
      <div class="profile-hero-card">
        <img src="assets/login/avatar-danilo.png" class="profile-hero-avatar"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="Danilo" />
        <div class="profile-hero-avatar-fallback" style="display:none">D</div>
        <div class="profile-hero-info">
          <div class="profile-hero-name">Danilo</div>
          <div class="profile-hero-slogan">Foco hoje. Liberdade amanhã.</div>
          <div class="profile-hero-badge">🏍️ Motorista | Uber e 99</div>
        </div>
      </div>

      <!-- STATS GRID 2x3 -->
      <div class="profile-stats-grid">
        ${stats.map(st => `
          <div class="profile-stat-cell">
            <div class="profile-stat-icon">${st.icon}</div>
            <div class="profile-stat-value" style="color:${st.color}">${st.value}</div>
            <div class="profile-stat-label">${st.label}</div>
          </div>`).join('')}
      </div>

      <div style="height:12px"></div>
    </div>`;
}

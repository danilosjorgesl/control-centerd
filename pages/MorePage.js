const MENU_ICON_MAP = {
  operation: './assets/icons/menu/operation.png',
  diary: './assets/icons/menu/diary.png',
  planning: './assets/icons/menu/planning.png',
  profile: './assets/icons/menu/profile.png',
  reports: './assets/icons/menu/reports.png',
  backup: './assets/icons/menu/backup.png',
  settings: './assets/icons/menu/settings.png',
  security: './assets/icons/menu/security.png',
  exportData: './assets/icons/menu/export-data.png',
  resetData: './assets/icons/menu/reset-data.png',
};

import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { navigate } from '../js/router.js?v=4';
import { resetStore, getState } from '../js/store.js?v=4';

const ITEMS = [
  { id:'operation', icon:'assets/icons/menu/operation.png', label:'Operação', sub:'Acompanhar checkpoints, Uber, 99 e abastecimentos.', bg:'#EEF2FF', page:'operation' },
  { id:'diary', icon:'assets/icons/menu/diary.png', label:'Diário', sub:'Registro diário de evolução', bg:'#EEF2FF', page:'diary' },
  { id:'planning', icon:'assets/icons/menu/planning.png', label:'Planejamento', sub:'Projeções e datas importantes', bg:'#DCFCE7', page:'planning' },
  { id:'profile', icon:'assets/icons/menu/profile.png', label:'Perfil', sub:'Seus dados e conquistas', bg:'#F3E8FF', page:'profile' },
  { id:'reports', icon:'assets/icons/menu/reports.png', label:'Relatórios', sub:'Visualize seus relatórios e histórico', bg:'#E0F2FE' },
  { id:'backup', icon:'assets/icons/menu/backup.png', label:'Backup', sub:'Salvar e restaurar seus dados', bg:'#F0FDF4' },
  { id:'config', icon:'assets/icons/menu/settings.png', label:'Configurações', sub:'Personalize o aplicativo', bg:'#F8FAFF' },
  { id:'security', icon:'assets/icons/menu/security.png', label:'Segurança', sub:'Proteção e privacidade', bg:'#FFF7ED' },
  { id:'export', icon:'assets/icons/menu/export-data.png', label:'Exportar dados', sub:'Baixar seus dados em JSON', bg:'#E0F2FE' },
  { id:'reset', icon:'assets/icons/menu/reset-data.png', label:'Resetar dados', sub:'Voltar para dados iniciais', bg:'#FEE2E2' },
];

export function mountMore(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'more');

  content.innerHTML = `
    <div class="page-inner">
      <h2 class="page-h2">Mais</h2>
      <div class="page-sub">Configurações e ferramentas</div>

      ${ITEMS.map(it => `
        <div class="more-row" data-action="${it.id}">
          <div class="more-row-icon" style="background:${it.bg}">
            <img src="${it.icon}" alt="${it.label}" class="more-menu-icon-img" />
          </div>
          <div class="more-row-body">
            <div class="more-row-title">${it.label}</div>
            <div class="more-row-sub">${it.sub}</div>
          </div>
          <span class="more-row-arrow">›</span>
        </div>`).join('')}

      <div style="height:12px"></div>
    </div>`;

  content.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const item = ITEMS.find(i => i.id === el.dataset.action);
      if (item?.page) { navigate(item.page); return; }
      if (el.dataset.action === 'export') {
        const blob = new Blob([JSON.stringify(getState(), null, 2)], { type:'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'operacao-danilo-backup.json';
        a.click();
        return;
      }
      if (el.dataset.action === 'reset') {
        if (confirm('Tem certeza? Todos os dados voltarão ao padrão inicial.')) {
          resetStore(); navigate('home');
        }
      }
    });
  });
}

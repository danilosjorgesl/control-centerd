import { navigate } from '../js/router.js?v=4';

const ITEMS_STANDARD = [
  { page: 'home', icon: 'house', label: 'Início' },
  { page: 'bills', icon: 'wallet', label: 'Contas' },
  { page: 'goals', icon: 'target', label: 'Metas' },
  { page: 'projects', icon: 'projects', label: 'Projetos' },
  { page: 'more', icon: 'menu', label: 'Mais' },
];

function icon(name) {
  const icons = {
    house: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    wallet: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    target: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    projects: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M6 21V9l6-4 6 4v12"/><path d="M9 21v-6h6v6"/></svg>`,
    menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  };
  return icons[name] || 'â—';
}

export function renderBottomNav(slot, activePage) {
  slot.innerHTML = `
    <nav class="bottom-nav">
      ${ITEMS_STANDARD.map(it => `
        <button class="nav-item ${it.page === activePage ? 'active' : ''}" data-page="${it.page}">
          <span class="nav-icon">${icon(it.icon)}</span>
          <span class="nav-label">${it.label}</span>
        </button>`).join('')}
    </nav>`;

  slot.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });
}

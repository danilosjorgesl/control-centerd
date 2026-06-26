let currentPage = null;
const routes = {};

export function registerPage(name, mountFn) {
  routes[name] = mountFn;
}

export function navigate(name, options = {}) {
  if (currentPage === name && !options.force) return;
  currentPage = name;

  const content = document.getElementById('page-content');
  const header = document.getElementById('header-slot');
  const nav = document.getElementById('bottomnav-slot');
  if (!content) return;

  content.innerHTML = '';
  header.innerHTML = '';
  nav.innerHTML = '';

  if (routes[name]) routes[name](content, header, nav);

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === name);
  });

  content.scrollTop = 0;
}

export function currentRoute() { return currentPage; }

export function refreshRoute() {
  if (!currentPage) return;
  navigate(currentPage, { force: true });
}

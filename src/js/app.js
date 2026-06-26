import { getState, initStore, verificarViradaDeDia } from './store.js?v=4';
import { registerPage, navigate, refreshRoute } from './router.js?v=4';
import { mountLogin } from '../pages/LoginPage.js?v=4';
import { mountHome } from '../pages/HomePage.js?v=4';
import { mountOperation } from '../pages/OperationPage.js?v=4';
import { mountBills } from '../pages/BillsPage.js?v=4';
import { mountGoals } from '../pages/GoalsPage.js?v=4';
import { mountProjects } from '../pages/ProjectsPage.js?v=4';
import { mountDiary } from '../pages/DiaryPage.js?v=4';
import { mountPlanning } from '../pages/PlanningPage.js?v=4';
import { mountMore } from '../pages/MorePage.js?v=4';
import { mountProfile } from '../pages/ProfilePage.js?v=4';

initStore();

registerPage('login', (content, header, nav) => {
  header.innerHTML = '';
  nav.innerHTML = '';
  mountLogin(content);
});

registerPage('home', (content, header, nav) => mountHome(content, header, nav));
registerPage('operation', (content, header, nav) => mountOperation(content, header, nav));
registerPage('bills', (content, header, nav) => mountBills(content, header, nav));
registerPage('goals', (content, header, nav) => mountGoals(content, header, nav));
registerPage('projects', (content, header, nav) => mountProjects(content, header, nav));
registerPage('diary', (content, header, nav) => mountDiary(content, header, nav));
registerPage('planning', (content, header, nav) => mountPlanning(content, header, nav));
registerPage('more', (content, header, nav) => mountMore(content, header, nav));
registerPage('profile', (content, header, nav) => mountProfile(content, header, nav));

function navigateFromHash() {
  const page = window.location.hash.replace('#', '') || (getState().acessoLiberado ? 'home' : 'login');
  navigate(page);
}

window.addEventListener('hashchange', navigateFromHash);
navigateFromHash();

setInterval(() => {
  if (verificarViradaDeDia()) {
    refreshRoute();
  }
}, 60000);

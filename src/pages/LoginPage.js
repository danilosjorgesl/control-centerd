import { navigate } from '../js/router.js?v=4';
import { liberarAcesso } from '../js/store.js?v=4';

const SENHA_LOCAL = '200911';

function fecharModalSenha() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('login-auth-overlay');
  overlay.innerHTML = '';
}

function abrirModalSenha() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('login-auth-overlay');
  overlay.innerHTML = `
    <div class="login-auth-card">
      <button class="login-auth-close" id="login-auth-close" type="button">×</button>
      <div class="login-auth-title">Acesso protegido</div>
      <div class="login-auth-text">Digite sua senha para entrar no painel.</div>
      <input
        type="password"
        id="login-password"
        class="login-auth-input"
        placeholder="Digite sua senha"
        autocomplete="current-password"
      />
      <div class="login-auth-error" id="login-auth-error"></div>
      <button class="btn-login login-auth-submit" id="login-auth-submit" type="button">Entrar</button>
      <button class="login-auth-cancel" id="login-auth-cancel" type="button">Cancelar</button>
    </div>`;

  const input = overlay.querySelector('#login-password');
  const error = overlay.querySelector('#login-auth-error');

  const tentarEntrar = () => {
    if (input.value === SENHA_LOCAL) {
      fecharModalSenha();
      liberarAcesso();
      navigate('home');
      return;
    }
    error.textContent = 'Senha incorreta. Tente novamente.';
    input.select();
  };

  overlay.querySelector('#login-auth-close').addEventListener('click', fecharModalSenha);
  overlay.querySelector('#login-auth-cancel').addEventListener('click', fecharModalSenha);
  overlay.querySelector('#login-auth-submit').addEventListener('click', tentarEntrar);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') tentarEntrar();
    if (event.key === 'Escape') fecharModalSenha();
  });
  setTimeout(() => input.focus(), 0);
}

export function mountLogin(content) {
  content.innerHTML = `
    <div class="login-page login-page-v3">
      <div class="login-v3-main">
        <div class="login-v3-top">
          <img src="assets/login/logo-operacao-danilo.png" class="login-v3-logo"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
            alt="Operação Danilo" />
          <div class="login-v3-logo-fallback" style="display:none">Operação Danilo</div>
        </div>

        <p class="login-v3-phrase">Foco hoje. <strong>Liberdade amanhã.</strong></p>

        <div class="login-v3-avatar-ring">
          <img src="assets/login/avatar-danilo.png" class="login-v3-avatar"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            alt="Danilo" />
          <div class="login-v3-avatar-fallback" style="display:none">D</div>
        </div>

        <h1 class="login-v3-title">Bem-vindo de volta.</h1>
        <p class="login-v3-sub">Vamos continuar construindo sua liberdade.</p>

        <button class="btn-login login-v3-button" id="btn-entrar" type="button">
          Entrar no meu painel
        </button>
      </div>

      <div class="login-v3-road">
        <img src="assets/login/estrada-liberdade-login.png" class="login-v3-road-img" alt="" />
        <div class="login-v3-road-wash"></div>
        <div class="login-v3-road-gradient"></div>
        <p class="login-v3-road-text">Pequenas vitórias constroem grandes mudanças.</p>
      </div>
    </div>`;

  const btn = content.querySelector('#btn-entrar');
  btn.addEventListener('click', abrirModalSenha);
  btn.addEventListener('touchend', event => {
    event.preventDefault();
    abrirModalSenha();
  }, { passive: false });
}

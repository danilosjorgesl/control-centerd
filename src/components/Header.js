const STEERING_SVG = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="13" cy="13" r="11" stroke="#1B4FE8" stroke-width="2"/>
  <circle cx="13" cy="13" r="3.5" stroke="#1B4FE8" stroke-width="2"/>
  <line x1="13" y1="2" x2="13" y2="9.5" stroke="#1B4FE8" stroke-width="2" stroke-linecap="round"/>
  <line x1="4" y1="18" x2="9.8" y2="14.8" stroke="#1B4FE8" stroke-width="2" stroke-linecap="round"/>
  <line x1="22" y1="18" x2="16.2" y2="14.8" stroke="#1B4FE8" stroke-width="2" stroke-linecap="round"/>
</svg>`;

function avatarCenter() {
  return `
    <div class="hdr-avatar-ring">
      <img src="assets/login/avatar-danilo.png" class="hdr-avatar-img"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="Danilo" />
      <div class="hdr-avatar-fallback" style="display:none">D</div>
    </div>`;
}

export function renderHeader(slot) {
  slot.innerHTML = `
    <header class="app-header">
      <div class="hdr-logo-wrap">
        <img src="assets/login/logo-operacao-danilo.png" class="header-logo"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
          alt="Operação Danilo" />
        <span class="header-logo-fallback" style="display:none">⚡OD</span>
      </div>
      <div class="hdr-right">
        <div class="header-bell">🔔<span class="bell-dot"></span></div>
        <img src="assets/login/avatar-danilo.png" class="header-avatar"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          alt="Danilo" />
        <div class="header-avatar-fallback" style="display:none">D</div>
      </div>
    </header>`;
}

export function renderHeaderHero(slot, leftIcon = 'logo') {
  const left = leftIcon === 'steering'
    ? `<div class="hdr-hero-left-icon">${STEERING_SVG}</div>`
    : `<div class="hdr-hero-left-icon">
        <img src="assets/login/logo-operacao-danilo.png" style="height:28px;width:auto;object-fit:contain"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'" alt="" />
        <span style="display:none;font-size:13px;font-weight:900;color:var(--blue)">OD</span>
       </div>`;

  slot.innerHTML = `
    <header class="app-header app-header-hero">
      ${left}
      <div class="hdr-hero-center">${avatarCenter()}</div>
      <div class="hdr-hero-right">
        <div class="header-bell hdr-hero-bell">🔔<span class="bell-dot bell-dot-green"></span></div>
      </div>
    </header>`;
}

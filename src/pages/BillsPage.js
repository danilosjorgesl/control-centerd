import { renderHeader } from '../components/Header.js';
import { renderBottomNav } from '../components/BottomNav.js?v=4';
import { getState, addConta, pagarConta } from '../js/store.js?v=4';
import { brl, dataBR, diasRestantesTxt } from '../js/formatters.js?v=4';
import { contaCritica, riscoConta, diasParaVencimento, progressoContas, totalContasAbertas } from '../js/calculations.js?v=4';

const CAT_ICON = {
  Casa: 'Casa',
  Carro: 'Carro',
  Educacao: 'Edu',
  Telefone: 'Tel',
  Familia: 'Fam',
  Sistema: 'Sis',
  Operacao: 'Op',
};

const CAT_IMG  = {
  Casa: 'assets/contas/casa-moradia.png',
};

function categoriaKey(categoria) {
  return String(categoria || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function statusConta(conta) {
  if (conta.pago) return { texto: 'Pago', classe: 'badge-green' };
  if (contaCritica(conta)) return { texto: 'Crítica', classe: 'badge-red' };
  return { texto: 'Aberta', classe: 'badge-blue' };
}

function billRow(conta, num) {
  const risco = conta.pago ? 'paid' : riscoConta(conta.vencimento);
  const dias = diasParaVencimento(conta.vencimento);
  const borderColor = conta.pago ? 'var(--green)' : contaCritica(conta) ? 'var(--red)' : risco === 'atencao' ? 'var(--orange)' : 'var(--blue)';
  const daysColor = conta.pago ? 'var(--green)' : risco === 'critico' ? 'var(--red)' : risco === 'atencao' ? 'var(--orange)' : 'var(--blue)';
  const catKey = categoriaKey(conta.categoria);
  const img = CAT_IMG[catKey];
  const emoji = CAT_ICON[catKey] || 'Doc';
  const status = statusConta(conta);

  return `
    <div class="bills-row" style="border-left:4px solid ${borderColor};opacity:${conta.pago?0.72:1}">
      ${num ? `<div class="bills-row-num" style="background:${borderColor}">${num}</div>` : ''}
      <div class="bills-row-icon">
        ${img
          ? `<img src="${img}" style="width:36px;height:36px;object-fit:contain"
              onerror="this.style.display='none';this.nextElementSibling.style.display='block'" alt="" />
             <span style="display:none;font-size:22px">${emoji}</span>`
          : `<span style="font-size:22px">${emoji}</span>`}
      </div>
      <div class="bills-row-body">
        <div class="bills-row-name">${conta.nome}</div>
        <div class="bills-row-due">${conta.categoria} · Vencimento: ${dataBR(conta.vencimento)}</div>
        <div class="bills-row-days" style="color:${daysColor}">${conta.pago ? 'Pago' : diasRestantesTxt(dias)}</div>
        <span class="badge ${status.classe}" style="margin-top:5px">${status.texto}</span>
      </div>
      <div class="bills-row-right">
        <div class="bills-row-value">${brl(conta.valor)}</div>
        ${conta.pago
          ? '<button class="bills-pay-btn paid" disabled>Pago</button>'
          : `<button class="bills-pay-btn" data-pay="${conta.id}">Paguei</button>`}
      </div>
    </div>`;
}

function openAddModal(onSave) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Adicionar Conta</div>
        <button class="modal-close" id="modal-close-btn">×</button>
      </div>
      <div class="form-group"><label class="form-label">Nome</label>
        <input type="text" id="nc-nome" class="form-input" placeholder="Ex: Internet" /></div>
      <div class="form-group"><label class="form-label">Valor (R$)</label>
        <input type="number" id="nc-valor" class="form-input" step="0.01" placeholder="0,00" /></div>
      <div class="form-group"><label class="form-label">Vencimento</label>
        <input type="date" id="nc-venc" class="form-input" /></div>
      <div class="form-group"><label class="form-label">Categoria</label>
        <select id="nc-cat" class="form-input">
          <option value="Casa">Casa</option>
          <option value="Carro">Carro</option>
          <option value="Educação">Educação</option>
          <option value="Telefone">Telefone</option>
          <option value="Família">Família</option>
          <option value="Sistema">Sistema</option>
          <option value="Operação">Operação</option>
        </select></div>
      <label class="form-label" style="display:flex;gap:8px;align-items:center;margin-bottom:16px">
        <input type="checkbox" id="nc-critica" /> Conta crítica
      </label>
      <button class="btn btn-primary btn-full" id="nc-save">Adicionar</button>
    </div>`;
  overlay.querySelector('#modal-close-btn').addEventListener('click', () => { overlay.classList.add('hidden'); overlay.innerHTML = ''; });
  overlay.querySelector('#nc-save').addEventListener('click', () => {
    const nome = overlay.querySelector('#nc-nome').value.trim();
    const valor = parseFloat(overlay.querySelector('#nc-valor').value) || 0;
    const venc = overlay.querySelector('#nc-venc').value;
    const cat = overlay.querySelector('#nc-cat').value;
    const critica = overlay.querySelector('#nc-critica').checked;
    if (!nome || !venc || valor <= 0) return;
    addConta({ nome, valor, vencimento: venc, pago: false, categoria: cat, critica });
    overlay.classList.add('hidden'); overlay.innerHTML = '';
    onSave();
  });
}

export function mountBills(content, header, nav) {
  renderHeader(header);
  renderBottomNav(nav, 'bills');

  let filtro = 'prioridade';

  function render() {
    const s = getState();
    const pctVal = progressoContas(s.contas);
    const abertas = totalContasAbertas(s.contas);
    const pagas = s.contas.filter(c => c.pago).length;
    const total = s.contas.length;
    const faltam = total - pagas;

    const counts = {
      prioridade: s.contas.filter(c => !c.pago && contaCritica(c)).length,
      avencer: s.contas.filter(c => !c.pago).length,
      vencidas: s.contas.filter(c => !c.pago && riscoConta(c.vencimento) === 'vencida').length,
      pagas: pagas,
    };

    let filtered = [...s.contas];
    if (filtro === 'prioridade') {
      filtered = filtered.filter(c => !c.pago && contaCritica(c)).sort((a,b) => {
        const da = diasParaVencimento(a.vencimento) ?? 9999;
        const db = diasParaVencimento(b.vencimento) ?? 9999;
        return da - db;
      });
    } else if (filtro === 'avencer') {
      filtered = filtered.filter(c => !c.pago).sort((a,b) => (diasParaVencimento(a.vencimento) ?? 9999) - (diasParaVencimento(b.vencimento) ?? 9999));
    } else if (filtro === 'vencidas') {
      filtered = filtered.filter(c => !c.pago && riscoConta(c.vencimento) === 'vencida');
    } else {
      filtered = filtered.filter(c => c.pago);
    }

    const prioridade3 = filtro === 'prioridade' ? filtered.slice(0,3) : [];
    const restante = filtro === 'prioridade' ? filtered.slice(3) : filtered;

    content.innerHTML = `
      <div class="page-inner">
        <h2 class="bills-page-title">Contas</h2>

        <div class="bills-health-card">
          <div class="bills-health-left">
            <div class="bills-health-sub">Saldo atual: ${brl(s.caixaAtual)}</div>
            <div class="bills-health-title">Pagar conta agora muda o caixa de verdade.</div>
            <div class="bills-health-progress-row">
              <div class="progress-bar" style="height:8px;flex:1">
                <div class="progress-fill progress-fill-green" style="width:${pctVal}%"></div>
              </div>
            </div>
            <div class="bills-health-stats">${pctVal}% · ${pagas} de ${total} contas pagas</div>
            <div class="bills-health-meta">Abertas: ${brl(abertas)}</div>
          </div>
          <div class="bills-health-circle-wrap">
            <div class="bills-circle" style="--pct:${pctVal}">
              <div class="bills-circle-inner">
                <div class="bills-circle-label">Faltam</div>
                <div class="bills-circle-num">${faltam}</div>
                <div class="bills-circle-sub">contas</div>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-bar">
          <button class="filter-chip ${filtro==='prioridade'?'active':''}" data-f="prioridade">Críticas ${counts.prioridade > 0 ? `<span class="filter-count">${counts.prioridade}</span>` : ''}</button>
          <button class="filter-chip ${filtro==='avencer'?'active':''}" data-f="avencer">Abertas ${counts.avencer > 0 ? `<span class="filter-count">${counts.avencer}</span>` : ''}</button>
          <button class="filter-chip ${filtro==='vencidas'?'active':''}" data-f="vencidas">Vencidas ${counts.vencidas > 0 ? `<span class="filter-count">${counts.vencidas}</span>` : ''}</button>
          <button class="filter-chip ${filtro==='pagas'?'active':''}" data-f="pagas">Pagas ${counts.pagas > 0 ? `<span class="filter-count">${counts.pagas}</span>` : ''}</button>
        </div>

        ${filtro === 'prioridade' && prioridade3.length > 0 ? prioridade3.map((c, i) => billRow(c, i+1)).join('') : ''}
        ${filtro === 'prioridade' && restante.length > 0 ? `
          <div class="bills-section-title">Próximas críticas</div>
          ${restante.map(c => billRow(c, null)).join('')}` : ''}
        ${filtro !== 'prioridade' ? (filtered.length > 0 ? filtered.map(c => billRow(c, null)).join('') : '<div class="empty-state"><div class="empty-state-icon">âœ“</div><div class="empty-state-text">Nenhuma conta aqui</div></div>') : ''}
        ${prioridade3.length === 0 && filtro === 'prioridade' && filtered.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">✓</div><div class="empty-state-text">Nenhuma conta crítica em aberto</div></div>' : ''}

        <button class="btn-add-bill" id="btn-add-bill">+ Adicionar Conta</button>
        <div style="height:12px"></div>
      </div>`;

    content.querySelectorAll('.filter-chip').forEach(b => b.addEventListener('click', () => { filtro = b.dataset.f; render(); }));
    content.querySelectorAll('[data-pay]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.pay;
        const conta = getState().contas.find(c => c.id === id);
        if (!conta || conta.pago) return;
        const saldoDepois = getState().caixaAtual - conta.valor;
        if (saldoDepois < 0 && !confirm('Esse pagamento vai deixar o saldo negativo. Confirmar mesmo assim?')) return;
        const res = pagarConta(id);
        if (!res.ok) alert(res.erro || 'Não foi possível pagar a conta.');
        render();
      });
    });
    content.querySelector('#btn-add-bill')?.addEventListener('click', () => openAddModal(() => render()));
  }

  render();
}

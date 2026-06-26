import { riscoConta, diasParaVencimento } from '../js/calculations.js';
import { brl, dataBR, diasRestantesTxt } from '../js/formatters.js';
import { updateConta } from '../js/store.js';

const ICONS = {
  moradia: 'assets/contas/casa-moradia.png',
  energia: 'assets/contas/energia-eletrica.png',
  agua: 'assets/contas/agua.png',
  cartao: 'assets/contas/cartao-credito.png',
};

const EMOJI = {
  moradia: '🏠', energia: '⚡', agua: '💧', cartao: '💳',
  veiculo: '🚗', educacao: '📚',
};

export function billCard(conta, onToggle) {
  const risco = conta.pago ? 'paid' : riscoConta(conta.vencimento);
  const dias = diasParaVencimento(conta.vencimento);
  const cssClass = conta.pago ? 'paid' : risco === 'critico' ? 'critical' : risco === 'atencao' ? 'warning' : 'ok';
  const badgeClass = conta.pago ? 'badge-green' : risco === 'critico' ? 'badge-red' : risco === 'atencao' ? 'badge-orange' : 'badge-blue';
  const badgeTxt = conta.pago ? 'Paga' : risco === 'vencida' ? 'Vencida' : risco === 'critico' ? 'Crítico' : risco === 'atencao' ? 'Atenção' : 'A vencer';
  const imgSrc = ICONS[conta.categoria] || '';
  const emoji = EMOJI[conta.categoria] || '📄';

  return `
    <div class="bill-item ${cssClass}" data-bill-id="${conta.id}">
      ${imgSrc
        ? `<img src="${imgSrc}" class="bill-icon"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            alt="" />
           <div class="bill-icon-fallback" style="display:none">${emoji}</div>`
        : `<div class="bill-icon-fallback">${emoji}</div>`
      }
      <div class="bill-body">
        <div class="bill-name">${conta.nome}</div>
        <div class="bill-due">${dataBR(conta.vencimento)} · ${conta.pago ? 'Pago' : diasRestantesTxt(dias)}</div>
        <span class="badge ${badgeClass}" style="margin-top:4px">${badgeTxt}</span>
      </div>
      <div class="bill-right">
        <div class="bill-value">${brl(conta.valor)}</div>
        <button class="bill-check ${conta.pago ? 'checked' : ''}" data-toggle="${conta.id}">
          ${conta.pago ? '✓' : ''}
        </button>
      </div>
    </div>`;
}

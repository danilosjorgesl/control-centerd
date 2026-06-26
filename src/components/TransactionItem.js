import { brl } from '../js/formatters.js';

export function transactionItem({ icone, titulo, subtitulo, valor, positivo = true }) {
  return `
    <div class="list-item">
      <div class="list-item-icon" style="background:${positivo ? 'var(--green-light)' : 'var(--red-light)'}">
        ${icone}
      </div>
      <div class="list-item-body">
        <div class="list-item-title">${titulo}</div>
        <div class="list-item-sub">${subtitulo}</div>
      </div>
      <div class="list-item-right">
        <div class="card-value-sm ${positivo ? 'text-green' : 'text-red'}">
          ${positivo ? '+' : '-'}${brl(valor)}
        </div>
      </div>
    </div>`;
}

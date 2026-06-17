import { COLUMN_IDS } from './config.js';
import { state, saveState } from './state.js';
import { renderBoard } from './board.js';

export function renderTrash() {
  const trashListEl = document.getElementById('trash-list');
  const trashBadgeEl = document.getElementById('trash-badge');
  if (!trashListEl) return;

  trashListEl.innerHTML = '';

  if (trashBadgeEl) {
    const count = state.trash.length;
    trashBadgeEl.textContent = count || '';
    trashBadgeEl.style.display = count ? '' : 'none';
  }

  state.trash.forEach((cardId) => {
    const card = state.cards[cardId];
    if (!card) return;

    const item = document.createElement('div');
    item.className = 'trash-item';

    const title = document.createElement('h4');
    title.textContent = card.title || 'Sans titre';

    const actions = document.createElement('div');
    actions.className = 'trash-actions';

    const restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'ghost';
    restoreBtn.textContent = 'Restaurer';
    restoreBtn.addEventListener('click', () => restoreFromTrash(cardId));

    actions.appendChild(restoreBtn);
    item.appendChild(title);
    item.appendChild(actions);
    trashListEl.appendChild(item);
  });
}

export function moveToTrash(cardId) {
  const card = state.cards[cardId];
  if (!card) return;
  COLUMN_IDS.forEach((columnId) => {
    const idx = state.columns[columnId].cardIds.indexOf(cardId);
    if (idx !== -1) {
      card.lastColumn = columnId;
      card.lastIndex = idx;
      state.columns[columnId].cardIds.splice(idx, 1);
    }
  });
  if (!state.trash.includes(cardId)) state.trash.unshift(cardId);
  saveState();
  renderBoard();
  renderTrash();
}

export function restoreFromTrash(cardId) {
  const card = state.cards[cardId];
  if (!card) return;
  state.trash = state.trash.filter((id) => id !== cardId);
  const targetColumn = card.lastColumn || 'todo';
  if (!state.columns[targetColumn].cardIds.includes(cardId)) {
    state.columns[targetColumn].cardIds.splice(card.lastIndex || 0, 0, cardId);
  }
  saveState();
  renderBoard();
  renderTrash();
}

export function emptyTrash() {
  state.trash.forEach((cardId) => delete state.cards[cardId]);
  state.trash = [];
  saveState();
  renderBoard();
  renderTrash();
}

export function openTrashPanel() {
  const panel = document.getElementById('trash-panel');
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

export function closeTrashPanel() {
  const panel = document.getElementById('trash-panel');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

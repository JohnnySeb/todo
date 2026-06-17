import { COLUMN_IDS } from './config.js';
import { state, generateId, saveState } from './state.js';

export function createCardElement(card) {
  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  cardEl.draggable = true;
  cardEl.dataset.cardId = card.id;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = card.title || 'Sans titre';
  cardEl.appendChild(title);

  if (card.labels && card.labels.length) {
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    card.labels.forEach((labelId) => {
      const label = state.labels.find((item) => item.id === labelId);
      if (!label) return;
      const chip = document.createElement('span');
      chip.className = 'label';
      chip.style.background = label.color;
      chip.style.color = label.textColor === 'white' ? '#fff' : '#1e1c19';
      chip.textContent = label.name;
      meta.appendChild(chip);
    });
    cardEl.appendChild(meta);
  }

  if (card.checklist && card.checklist.length) {
    const completed = card.checklist.filter((item) => item.done).length;
    const preview = document.createElement('div');
    preview.className = 'checklist-preview';
    preview.textContent = `Checklist ${completed}/${card.checklist.length}`;
    cardEl.appendChild(preview);
  }

  return cardEl;
}

export function renderBoard() {
  COLUMN_IDS.forEach((columnId) => {
    const list = document.querySelector(`[data-column-list="${columnId}"]`);
    if (!list) return;
    list.innerHTML = '';
    state.columns[columnId].cardIds.forEach((cardId) => {
      const card = state.cards[cardId];
      if (!card) return;
      list.appendChild(createCardElement(card));
    });
  });
}

export function syncOrderFromDOM() {
  COLUMN_IDS.forEach((columnId) => {
    const list = document.querySelector(`[data-column-list="${columnId}"]`);
    if (!list) return;
    state.columns[columnId].cardIds = [
      ...list.querySelectorAll('.card'),
    ].map((el) => el.dataset.cardId);
  });
}

// Retourne l'id de la nouvelle carte — openModal est appelé depuis main.js
export function createCard(columnId) {
  const id = generateId();
  state.cards[id] = { id, title: '', description: '', labels: [], checklist: [] };
  state.columns[columnId].cardIds.unshift(id);
  saveState();
  renderBoard();
  return id;
}

import { state, generateId, saveState } from './state.js';
import { renderBoard } from './board.js';
import { renderTrash } from './trash.js';

export let activeCardId = null;

export function persistAndRender(shouldRender = true) {
  saveState();
  if (shouldRender) {
    renderBoard();
    renderTrash();
  }
}

export function openModal(cardId) {
  const card = state.cards[cardId];
  if (!card) return;
  activeCardId = cardId;
  document.getElementById('card-title').value = card.title || '';
  document.getElementById('card-description').innerHTML = card.description || '';
  renderLabelOptions(card.labels || []);
  renderChecklist(card.checklist || []);
  const modal = document.getElementById('card-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('card-title').focus();
}

export function closeModal() {
  activeCardId = null;
  const modal = document.getElementById('card-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  renderBoard();
  renderTrash();
}

export function updateCardFromModal(shouldRender = true) {
  const card = state.cards[activeCardId];
  if (!card) return;
  card.title = document.getElementById('card-title').value.trim() || 'Sans titre';
  card.description = document.getElementById('card-description').innerHTML.trim();
  persistAndRender(shouldRender);
}

export function renderLabelOptions(selected) {
  const labelGrid = document.getElementById('label-grid');
  labelGrid.innerHTML = '';
  state.labels.forEach((label) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'label-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selected.includes(label.id);
    checkbox.dataset.labelId = label.id;
    checkbox.addEventListener('change', onLabelToggle);

    const swatch = document.createElement('span');
    swatch.className = 'label-swatch';
    swatch.style.background = label.color;

    const text = document.createElement('span');
    text.textContent = label.name;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(swatch);
    wrapper.appendChild(text);
    labelGrid.appendChild(wrapper);
  });
}

export function renderChecklist(items) {
  const checklistEl = document.getElementById('checklist');
  checklistEl.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'checklist-item';
    row.dataset.itemId = item.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.addEventListener('change', () => {
      item.done = checkbox.checked;
      persistAndRender();
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.value = item.text;
    input.addEventListener('input', () => {
      item.text = input.value;
      persistAndRender(false);
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ghost';
    removeBtn.textContent = 'Retirer';
    removeBtn.addEventListener('click', () => removeChecklistItem(item.id));

    row.appendChild(checkbox);
    row.appendChild(input);
    row.appendChild(removeBtn);
    checklistEl.appendChild(row);
  });
}

export function removeChecklistItem(itemId) {
  const card = state.cards[activeCardId];
  if (!card) return;
  card.checklist = card.checklist.filter((item) => item.id !== itemId);
  renderChecklist(card.checklist);
  persistAndRender();
}

export function onLabelToggle(event) {
  const card = state.cards[activeCardId];
  if (!card) return;
  const id = event.target.dataset.labelId;
  if (event.target.checked) {
    card.labels = [...new Set([...card.labels, id])];
  } else {
    card.labels = card.labels.filter((labelId) => labelId !== id);
  }
  persistAndRender(false);
}

export function addChecklistItem() {
  const checklistInput = document.getElementById('checklist-input');
  const text = checklistInput.value.trim();
  if (!text) return;
  const card = state.cards[activeCardId];
  if (!card) return;
  card.checklist.push({ id: generateId(), text, done: false });
  checklistInput.value = '';
  renderChecklist(card.checklist);
  persistAndRender();
}

import { state, saveState, generateId } from './state.js';
import { renderBoard } from './board.js';

export function openLabelsModal() {
  renderLabelsList();
  const modal = document.getElementById('labels-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

export function closeLabelsModal() {
  const modal = document.getElementById('labels-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  renderBoard();
}

function renderLabelsList() {
  const list = document.getElementById('labels-list');
  list.innerHTML = '';
  state.labels.forEach((label) => list.appendChild(createLabelRow(label)));
}

function createLabelRow(label) {
  const row = document.createElement('div');
  row.className = 'label-edit-row';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = label.color;
  colorInput.className = 'label-color-input';
  colorInput.title = 'Couleur de fond';
  colorInput.addEventListener('input', () => {
    label.color = colorInput.value;
    syncTextColorBtn(textColorBtn, label);
    saveState();
  });

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = label.name;
  nameInput.placeholder = 'Nom';
  nameInput.addEventListener('input', () => {
    label.name = nameInput.value;
    saveState();
  });

  const textColorBtn = document.createElement('button');
  textColorBtn.type = 'button';
  textColorBtn.className = 'label-text-toggle';
  syncTextColorBtn(textColorBtn, label);
  textColorBtn.addEventListener('click', () => {
    label.textColor = label.textColor === 'white' ? 'black' : 'white';
    syncTextColorBtn(textColorBtn, label);
    saveState();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'label-delete-btn';
  deleteBtn.textContent = '✕';
  deleteBtn.title = 'Supprimer';
  deleteBtn.addEventListener('click', () => {
    state.labels = state.labels.filter((l) => l.id !== label.id);
    Object.values(state.cards).forEach((card) => {
      card.labels = card.labels.filter((id) => id !== label.id);
    });
    saveState();
    renderLabelsList();
  });

  row.append(colorInput, nameInput, textColorBtn, deleteBtn);
  return row;
}

function syncTextColorBtn(btn, label) {
  btn.textContent = 'Aa';
  btn.style.background = label.color;
  btn.style.color = label.textColor === 'white' ? '#fff' : '#1e1c19';
  btn.title = `Texte ${label.textColor === 'white' ? 'blanc' : 'noir'} — cliquer pour changer`;
}

export function addLabel() {
  state.labels.push({
    id: `label_${generateId()}`,
    name: 'Nouvelle étiquette',
    color: '#cccccc',
    textColor: 'black',
  });
  saveState();
  renderLabelsList();
}

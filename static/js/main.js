import { DEFAULT_STATE } from './config.js';
import { state, loadStateFromStorage, saveState } from './state.js';
import { renderBoard, createCard } from './board.js';
import { renderTrash, moveToTrash, emptyTrash, openTrashPanel, closeTrashPanel } from './trash.js';
import {
  activeCardId,
  openModal,
  closeModal,
  updateCardFromModal,
  addChecklistItem,
} from './modal.js';
import { dragContext, handleDragStart, handleDragEnd, handleDragOver } from './drag.js';
import { openLabelsModal, closeLabelsModal, addLabel } from './labels-modal.js';
import { initBgColor, openBgModal, closeBgModal, setupBgListeners } from './bg-modal.js';

async function hydrateState() {
  try {
    const response = await fetch('/api/state', { cache: 'no-store' });
    if (!response.ok) throw new Error('load_failed');
    const data = await response.json();
    if (data && data.columns && data.cards) {
      Object.assign(state, data);
      if (!state.labels || !state.labels.length) state.labels = DEFAULT_STATE().labels;
    } else {
      Object.assign(state, DEFAULT_STATE());
    }
  } catch (err) {
    Object.assign(state, loadStateFromStorage());
  }
  renderBoard();
  renderTrash();
}

function setupListeners() {
  const boardEl = document.getElementById('board');
  const modalEl = document.getElementById('card-modal');
  const trashDropEl = document.getElementById('trash-drop');
  const trashFabBtnEl = document.getElementById('trash-fab-btn');
  const trashPanelBackdropEl = document.getElementById('trash-panel-backdrop');
  const closePanelBtn = document.getElementById('close-trash-panel');
  const emptyTrashBtn = document.getElementById('empty-trash');
  const saveCardBtn = document.getElementById('save-card');
  const trashCardBtn = document.getElementById('trash-card');
  const addChecklistBtn = document.getElementById('add-checklist-item');
  const checklistInput = document.getElementById('checklist-input');
  const editorToolbar = document.getElementById('editor-toolbar');
  const titleInput = document.getElementById('card-title');
  const descriptionEl = document.getElementById('card-description');

  // Board : ajout + clic sur carte
  boardEl.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-card');
    if (addButton) {
      const id = createCard(addButton.dataset.addColumn);
      openModal(id);
      return;
    }
    const card = event.target.closest('.card');
    if (card && !event.target.closest('button')) openModal(card.dataset.cardId);
  });

  // Drag & drop sur le board
  boardEl.addEventListener('dragstart', handleDragStart);
  boardEl.addEventListener('dragend', handleDragEnd);
  boardEl.addEventListener('dragover', handleDragOver);

  // Drag & drop sur le bouton corbeille
  trashDropEl.addEventListener('dragover', (event) => {
    event.preventDefault();
    trashDropEl.classList.add('active');
  });
  trashDropEl.addEventListener('dragleave', () => trashDropEl.classList.remove('active'));
  trashDropEl.addEventListener('drop', (event) => {
    event.preventDefault();
    trashDropEl.classList.remove('active');
    if (!dragContext.cardId) return;
    dragContext.trashed = true;
    moveToTrash(dragContext.cardId);
  });

  // Panneau corbeille
  trashFabBtnEl.addEventListener('click', openTrashPanel);
  closePanelBtn.addEventListener('click', closeTrashPanel);
  trashPanelBackdropEl.addEventListener('click', closeTrashPanel);

  emptyTrashBtn.addEventListener('click', () => {
    if (!state.trash.length) return;
    if (confirm('Vider la corbeille ?')) emptyTrash();
  });

  // Modal carte
  modalEl.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-modal]')) closeModal();
  });

  titleInput.addEventListener('input', () => updateCardFromModal(false));
  descriptionEl.addEventListener('input', () => updateCardFromModal(false));

  saveCardBtn.addEventListener('click', () => {
    updateCardFromModal();
    closeModal();
  });

  trashCardBtn.addEventListener('click', () => {
    if (activeCardId) {
      moveToTrash(activeCardId);
      closeModal();
    }
  });

  // Checklist
  addChecklistBtn.addEventListener('click', addChecklistItem);
  checklistInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addChecklistItem();
    }
  });

  // Éditeur de description
  editorToolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const cmd = button.dataset.cmd;
    if (!cmd) return;
    if (cmd === 'createLink') {
      const url = prompt('Lien URL:');
      if (url) document.execCommand(cmd, false, url);
    } else {
      document.execCommand(cmd, false, null);
    }
    descriptionEl.focus();
    updateCardFromModal();
  });

  // Modal étiquettes
  document.getElementById('open-labels-modal').addEventListener('click', openLabelsModal);
  document.getElementById('close-labels-modal').addEventListener('click', closeLabelsModal);
  document.getElementById('labels-modal-backdrop').addEventListener('click', closeLabelsModal);
  document.getElementById('add-label-btn').addEventListener('click', addLabel);

  // Couleur de fond
  setupBgListeners();

  // Fermeture au clavier
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (modalEl.classList.contains('open')) closeModal();
    if (document.getElementById('labels-modal').classList.contains('open')) closeLabelsModal();
    if (document.getElementById('bg-modal').classList.contains('open')) closeBgModal();
  });
}

initBgColor();
setupListeners();
hydrateState();

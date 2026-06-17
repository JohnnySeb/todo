import { state, saveState } from './state.js';
import { syncOrderFromDOM, renderBoard } from './board.js';
import { renderTrash } from './trash.js';

export let dragContext = { cardId: null, trashed: false };

export function handleDragStart(event) {
  const card = event.target.closest('.card');
  if (!card) return;
  dragContext = { cardId: card.dataset.cardId, trashed: false };
  card.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
}

export function handleDragEnd(event) {
  const card = event.target.closest('.card');
  if (card) card.classList.remove('dragging');
  if (!dragContext.cardId) return;
  if (dragContext.trashed) {
    dragContext = { cardId: null, trashed: false };
    return;
  }
  syncOrderFromDOM();
  saveState();
  renderBoard();
  renderTrash();
  dragContext = { cardId: null, trashed: false };
}

export function handleDragOver(event) {
  const list = event.target.closest('.card-list');
  if (!list) return;
  event.preventDefault();
  const dragging = document.querySelector('.card.dragging');
  if (!dragging) return;
  const afterElement = getDragAfterElement(list, event.clientY);
  if (afterElement == null) {
    list.appendChild(dragging);
  } else {
    list.insertBefore(dragging, afterElement);
  }
}

function getDragAfterElement(list, y) {
  const elements = [...list.querySelectorAll('.card:not(.dragging)')];
  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

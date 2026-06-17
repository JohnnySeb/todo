const BG_KEY = 'todo_bg_color';

export function initBgColor() {
  const saved = localStorage.getItem(BG_KEY);
  if (saved) document.body.style.background = saved;
}

export function openBgModal() {
  const saved = localStorage.getItem(BG_KEY);
  const picker = document.getElementById('bg-color-picker');
  if (saved) picker.value = saved;
  const modal = document.getElementById('bg-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

export function closeBgModal() {
  const modal = document.getElementById('bg-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

export function setupBgListeners() {
  const picker = document.getElementById('bg-color-picker');

  picker.addEventListener('input', () => {
    document.body.style.background = picker.value;
    localStorage.setItem(BG_KEY, picker.value);
  });

  document.getElementById('open-bg-modal').addEventListener('click', openBgModal);
  document.getElementById('close-bg-modal').addEventListener('click', closeBgModal);
  document.getElementById('close-bg-modal-btn').addEventListener('click', closeBgModal);
  document.getElementById('bg-modal-backdrop').addEventListener('click', closeBgModal);

  document.getElementById('reset-bg-color').addEventListener('click', () => {
    localStorage.removeItem(BG_KEY);
    document.body.style.background = '';
    picker.value = '#fffaf4';
  });
}

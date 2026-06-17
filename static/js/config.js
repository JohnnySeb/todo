export const STORAGE_KEY = 'formation_trello_board_v1';

export const DEFAULT_LABELS = [
  { id: 'project', name: 'Projet', color: '#b07ccf', textColor: 'black' },
  { id: 'adjustments', name: 'Ajustements', color: '#f6b93b', textColor: 'black' },
  { id: 'wordpress', name: 'Wordpress', color: '#b1fc03', textColor: 'black' },
  { id: 'elementor', name: 'Elementor', color: '#c79a72', textColor: 'black' },
  { id: 'statamic', name: 'Statamic', color: '#fc039d', textColor: 'white' },
  { id: 'craft', name: 'Craft', color: '#dc2626', textColor: 'white' },
  { id: 'ops', name: 'OPS', color: '#21b5cc', textColor: 'black' },
  { id: 'ai', name: 'AI powered', color: '#34ebb1', textColor: 'black' },
];

export const COLUMN_IDS = ['todo', 'waiting', 'doing', 'done'];

export const DEFAULT_STATE = () => ({
  columns: {
    todo: { name: 'À faire', cardIds: [] },
    waiting: { name: 'En attente', cardIds: [] },
    doing: { name: 'En cours', cardIds: [] },
    done: { name: 'Terminé', cardIds: [] },
  },
  cards: {},
  trash: [],
  labels: DEFAULT_LABELS.map((l) => ({ ...l })),
});

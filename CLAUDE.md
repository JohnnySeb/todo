# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
# Démarrage rapide (crée le venv si absent, installe les dépendances, lance)
./start.sh

# Ou manuellement
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

L'application tourne sur `http://127.0.0.1:5000`.

## Architecture

Tableau Kanban full-stack minimaliste — aucun outil de build, aucun framework frontend.

**Backend** : `app.py` (Flask) — 3 routes :
- `GET /` → sert `templates/index.html`
- `GET /api/state` → lit `board.json`
- `POST /api/state` → valide et écrit `board.json`

**Frontend** : JS vanilla en ES modules, CSS natif (pas de Tailwind, pas de compilation).

| Fichier | Rôle |
|---------|------|
| `static/js/main.js` | Point d'entrée, délégation d'événements |
| `static/js/state.js` | Source de vérité, sync serveur + fallback localStorage |
| `static/js/board.js` | Rendu colonnes et cartes |
| `static/js/modal.js` | Édition de carte (titre, description, labels, checklist) |
| `static/js/drag.js` | Drag & drop entre colonnes et vers la corbeille |
| `static/js/trash.js` | Panneau corbeille, restauration, vidage |
| `static/js/config.js` | Constantes : IDs colonnes, labels, état par défaut |

**Modèle de données** (`board.json`) :
```json
{
  "columns": { "todo": { "id": "todo", "title": "...", "cardIds": [] }, ... },
  "cards": { "[id]": { "id", "title", "description", "labels": [], "checklist": [] } },
  "trash": []
}
```

**CSS** : `static/styles.css` importe des modules dans `static/css/` (base, layout, card, modal, trash). Variables CSS pour la palette et les rayons — pas de Tailwind dans ce projet.

## Sauvegarde

L'auto-save est déclenché avec un debounce de 250 ms après chaque modification. Le state est écrit sur le serveur (`board.json`) avec un fallback localStorage si l'API échoue. L'indicateur de statut en en-tête reflète l'état de la dernière sync.

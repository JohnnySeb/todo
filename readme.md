# Todo board (Flask)

Petit tableau kanban avec cartes, labels, checklist et corbeille. Les donnees sont sauvegardees automatiquement: localement (localStorage) et cote serveur dans `board.json`.

## Fonctionnalites
- Colonnes: A faire, En attente, En cours, Termine
- Drag and drop pour reordonner les cartes
- Edition des cartes (titre, description riche, labels, checklist)
- Corbeille avec restauration ou suppression definitive
- Sauvegarde auto avec fallback local si le serveur est indisponible

## Prerequis
- Python 3.x
- pip

## Installation
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Lancer en local
```bash
python app.py
```
Puis ouvrir http://127.0.0.1:5000 ou todo.test dans le navigateur.

## API
- `GET /api/state` : retourne l'etat du board
- `POST /api/state` : sauvegarde l'etat du board (JSON avec `columns`, `cards`, `trash`)

## Stockage
- `board.json` contient la derniere sauvegarde cote serveur.
- Le navigateur conserve aussi une copie locale (localStorage).

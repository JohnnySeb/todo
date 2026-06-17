#!/bin/bash
cd "$(dirname "$0")"

# Crée le venv seulement s'il n'existe pas
if [ ! -d ".venv" ]; then
  echo "Création du venv..."
  python3 -m venv .venv
fi

source .venv/bin/activate

# Installe les dépendances seulement si requirements.txt a changé
pip install -q -r requirements.txt

python app.py

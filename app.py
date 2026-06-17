from flask import Flask, jsonify, render_template, request
from pathlib import Path
import json

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "board.json"


def default_state():
    return {
        "columns": {
            "todo": {"name": "À faire", "cardIds": []},
            "waiting": {"name": "En attente", "cardIds": []},
            "doing": {"name": "En cours", "cardIds": []},
            "done": {"name": "Terminé", "cardIds": []},
        },
        "cards": {},
        "trash": [],
        "labels": [],
    }


def load_state():
    if DATA_FILE.exists():
        try:
            return json.loads(DATA_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default_state()
    return default_state()


def normalize_state(payload):
    state = default_state()
    if not isinstance(payload, dict):
        return state
    state["cards"] = payload.get("cards", {}) or {}
    state["trash"] = payload.get("trash", []) or []
    state["labels"] = payload.get("labels", []) or []
    incoming_columns = payload.get("columns", {}) or {}
    for column_id in state["columns"]:
        if column_id in incoming_columns:
            state["columns"][column_id]["cardIds"] = incoming_columns[column_id].get(
                "cardIds", []
            )
    return state


def save_state(payload):
    normalized = normalize_state(payload)
    DATA_FILE.write_text(
        json.dumps(normalized, ensure_ascii=False, indent=2), encoding="utf-8"
    )


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/api/state")
def get_state():
    return jsonify(load_state())


@app.post("/api/state")
def post_state():
    payload = request.get_json(silent=True)
    if not payload or "columns" not in payload or "cards" not in payload:
        return jsonify({"error": "invalid_state"}), 400
    save_state(payload)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True)

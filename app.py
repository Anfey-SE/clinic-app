from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

CSV_FILE = "clinic.csv"

# ── CSV setup ──────────────────────────────────────────────
def init_csv():
    if not os.path.exists(CSV_FILE):
        df = pd.DataFrame(columns=[
            "id", "student_name", "roll_no", "symptoms",
            "doctor", "medicine", "status",
            "visit_date", "visit_time", "notes"
        ])
        df.to_csv(CSV_FILE, index=False)

def read_csv():
    init_csv()
    df = pd.read_csv(CSV_FILE)
    if df.empty:
        return df
    df["id"] = df["id"].astype(int)
    return df

def write_csv(df):
    df.to_csv(CSV_FILE, index=False)

def next_id(df):
    if df.empty:
        return 1
    return int(df["id"].max()) + 1

# ── Routes ─────────────────────────────────────────────────

@app.route("/")
def root():
    return jsonify({"message": "Campus Clinic API is live 🏥", "docs": "use /clinic endpoints"})


# ADD a new patient
@app.route("/clinic/add", methods=["POST"])
def add_patient():
    data = request.get_json()
    df = read_csv()

    required = ["student_name", "roll_no", "symptoms"]
    for field in required:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    new_row = {
        "id":           next_id(df),
        "student_name": data.get("student_name"),
        "roll_no":      data.get("roll_no"),
        "symptoms":     data.get("symptoms"),
        "doctor":       data.get("doctor", "unassigned"),
        "medicine":     data.get("medicine", "none"),
        "status":       data.get("status", "waiting"),
        "visit_date":   data.get("visit_date", datetime.now().strftime("%Y-%m-%d")),
        "visit_time":   data.get("visit_time", datetime.now().strftime("%H:%M")),
        "notes":        data.get("notes", "")
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    write_csv(df)
    return jsonify({"message": "Patient added", "id": new_row["id"]}), 201


# GET all patients
@app.route("/clinic/all", methods=["GET"])
def get_all():
    df = read_csv()
    return jsonify(df.to_dict(orient="records"))


# SEARCH patients
@app.route("/clinic/search", methods=["GET"])
def search():
    df = read_csv()
    status  = request.args.get("status")
    doctor  = request.args.get("doctor")
    date    = request.args.get("date")
    name    = request.args.get("name")

    if status:
        df = df[df["status"].str.lower() == status.lower()]
    if doctor:
        df = df[df["doctor"].str.lower().str.contains(doctor.lower())]
    if date:
        df = df[df["visit_date"] == date]
    if name:
        df = df[df["student_name"].str.lower().str.contains(name.lower())]

    return jsonify(df.to_dict(orient="records"))


# UPDATE a patient
@app.route("/clinic/update/<int:patient_id>", methods=["PATCH"])
def update_patient(patient_id):
    data = request.get_json()
    df = read_csv()

    if patient_id not in df["id"].values:
        return jsonify({"error": "Patient not found"}), 404

    allowed = ["student_name", "roll_no", "symptoms", "doctor",
               "medicine", "status", "notes"]
    for field in allowed:
        if field in data:
            df.loc[df["id"] == patient_id, field] = data[field]

    write_csv(df)
    updated = df[df["id"] == patient_id].to_dict(orient="records")[0]
    return jsonify({"message": "Patient updated", "patient": updated})


# DELETE a patient
@app.route("/clinic/remove/<int:patient_id>", methods=["DELETE"])
def remove_patient(patient_id):
    df = read_csv()

    if patient_id not in df["id"].values:
        return jsonify({"error": "Patient not found"}), 404

    df = df[df["id"] != patient_id]
    write_csv(df)
    return jsonify({"message": f"Patient {patient_id} removed"})


# STATS
@app.route("/clinic/stats", methods=["GET"])
def stats():
    df = read_csv()
    today = datetime.now().strftime("%Y-%m-%d")
    today_df = df[df["visit_date"] == today] if not df.empty else df

    return jsonify({
        "total_all_time":   len(df),
        "total_today":      len(today_df),
        "waiting":          len(today_df[today_df["status"] == "waiting"])  if not today_df.empty else 0,
        "treated":          len(today_df[today_df["status"] == "treated"])  if not today_df.empty else 0,
        "referred":         len(today_df[today_df["status"] == "referred"]) if not today_df.empty else 0,
        "doctors_on_duty":  today_df["doctor"].nunique() if not today_df.empty else 0,
        "date":             today
    })


# EXPORT CSV
@app.route("/clinic/export", methods=["GET"])
def export():
    init_csv()
    return send_file(CSV_FILE, as_attachment=True, download_name="clinic_records.csv")


if __name__ == "__main__":
    init_csv()
    print("🏥 Campus Clinic API starting...")
    print("📍 Running at http://127.0.0.1:5000")
    print("📄 Endpoints: /clinic/add, /clinic/all, /clinic/search, /clinic/update/<id>, /clinic/remove/<id>, /clinic/stats, /clinic/export")
    app.run(debug=True, port=5000)
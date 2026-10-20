# 🏥 ClinicQ — Campus Clinic Queue Manager

A full-stack web application to manage student clinic visits at FAST-NUCES.
Built with Flask (Python) + React.js + Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask, pandas |
| Database | CSV (via pandas) |
| Frontend | React.js, Tailwind CSS, Vite |
| API Testing | Postman, curl |

---

## ✨ Features

- Register new patient visits with symptoms, doctor, medicine and status
- Real-time dashboard with today's stats (waiting, treated, referred)
- Update patient status directly from the queue table
- Search and filter by name, doctor, status or date
- Export all records as CSV
- RESTful API with 7 endpoints

---

## 📁 Project Structure
clinic-app/

├── app.py              ← Flask backend (all API endpoints)

├── requirements.txt    ← Python dependencies

├── clinic.csv          ← Auto-generated database

└── frontend/

├── src/

│   ├── App.jsx

│   └── components/

│       ├── Dashboard.jsx

│       ├── AddPatient.jsx

│       ├── Queue.jsx

│       └── Search.jsx

└── package.json

---

## 🚀 How to Run

### Backend
```bash
pip install -r requirements.txt
python app.py
```
Runs at: http://127.0.0.1:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at: http://localhost:5173

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /clinic/all | Get all patients |
| POST | /clinic/add | Add new patient |
| PATCH | /clinic/update/\<id\> | Update patient |
| DELETE | /clinic/remove/\<id\> | Delete patient |
| GET | /clinic/search | Search/filter |
| GET | /clinic/stats | Today's stats |
| GET | /clinic/export | Download CSV |

---

## 👩‍💻 Developer

**Amna Hafeez** — BSc Software Engineering, FAST-NUCES Islamabad  
GitHub: [@Anfey-SE](https://github.com/Anfey-SE)

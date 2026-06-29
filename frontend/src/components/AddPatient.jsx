import { useState } from "react";
import { API } from "../App";

const DOCTORS = ["Dr. Ayesha", "Dr. Bilal", "Dr. Sara", "Unassigned"];
const STATUSES = ["waiting", "treated", "referred"];

export default function AddPatient({ onAdded }) {
  const [form, setForm] = useState({
    student_name: "", roll_no: "", symptoms: "",
    doctor: "Unassigned", medicine: "", status: "waiting", notes: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.student_name || !form.roll_no || !form.symptoms) {
      setMsg("❌ Name, Roll No and Symptoms are required");
      return;
    }
    setLoading(true);
    const res = await fetch(`${API}/clinic/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg(`✅ Patient added with ID #${data.id}`);
      setForm({ student_name: "", roll_no: "", symptoms: "", doctor: "Unassigned", medicine: "", status: "waiting", notes: "" });
      setTimeout(onAdded, 1000);
    } else {
      setMsg(`❌ ${data.error}`);
    }
  };

  const inputClass = "bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent w-full";
  const labelClass = "text-xs text-gray-500 uppercase tracking-wider font-medium";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Add Patient</h2>
        <p className="text-gray-400 text-sm mt-1">Register a new clinic visit</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Student Name *</label>
            <input placeholder="e.g. Amna Hafeez" value={form.student_name} onChange={(e) => set("student_name", e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Roll No *</label>
            <input placeholder="e.g. SE-01" value={form.roll_no} onChange={(e) => set("roll_no", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Symptoms *</label>
          <textarea rows={2} placeholder="e.g. headache, fever" value={form.symptoms} onChange={(e) => set("symptoms", e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Doctor</label>
            <select value={form.doctor} onChange={(e) => set("doctor", e.target.value)} className={inputClass}>
              {DOCTORS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Medicine</label>
          <input placeholder="e.g. Panadol 500mg" value={form.medicine} onChange={(e) => set("medicine", e.target.value)} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Notes</label>
          <textarea rows={2} placeholder="Any additional notes..." value={form.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        {msg && <p className="text-sm font-medium">{msg}</p>}

        <button onClick={submit} disabled={loading}
          className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-40 transition-all shadow-sm">
          {loading ? "Adding..." : "Add Patient to Queue"}
        </button>
      </div>
    </div>
  );
}
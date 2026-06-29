import { useEffect, useState } from "react";
import { API } from "../App";

const STATUS_STYLE = {
  waiting:  "bg-amber-100 text-amber-700 border border-amber-300",
  treated:  "bg-emerald-100 text-emerald-700 border border-emerald-300",
  referred: "bg-red-100 text-red-600 border border-red-300",
};

export default function Queue() {
  const [patients, setPatients] = useState([]);

  const load = () =>
    fetch(`${API}/clinic/all`).then((r) => r.json()).then(setPatients);

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/clinic/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Remove this patient record?")) return;
    await fetch(`${API}/clinic/remove/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Queue</h2>
          <p className="text-gray-400 text-sm mt-1">{patients.length} total records</p>
        </div>
        <button onClick={load} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm transition-all">
          ↻ Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Symptoms</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Medicine</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-10">No patients yet — add one!</td>
              </tr>
            )}
            {patients.map((p) => (
              <tr key={p.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 font-mono">{p.id}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800">{p.student_name}</p>
                  <p className="text-xs text-gray-400">{p.roll_no}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-32 truncate">{p.symptoms}</td>
                <td className="px-4 py-3 text-gray-500">{p.doctor}</td>
                <td className="px-4 py-3 text-gray-500">{p.medicine}</td>
                <td className="px-4 py-3">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer border-0 ${STATUS_STYLE[p.status] || ""}`}
                  >
                    <option value="waiting">waiting</option>
                    <option value="treated">treated</option>
                    <option value="referred">referred</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{p.visit_time}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(p.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
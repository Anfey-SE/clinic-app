import { useState } from "react";
import { API } from "../App";

const STATUS_STYLE = {
  waiting:  "bg-amber-100 text-amber-700 border border-amber-300",
  treated:  "bg-emerald-100 text-emerald-700 border border-emerald-300",
  referred: "bg-red-100 text-red-600 border border-red-300",
};

export default function Search() {
  const [filters, setFilters] = useState({ name: "", status: "", doctor: "", date: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const search = async () => {
    const params = new URLSearchParams();
    if (filters.name)   params.append("name",   filters.name);
    if (filters.status) params.append("status", filters.status);
    if (filters.doctor) params.append("doctor", filters.doctor);
    if (filters.date)   params.append("date",   filters.date);
    const res = await fetch(`${API}/clinic/search?${params}`);
    setResults(await res.json());
    setSearched(true);
  };

  const clear = () => { setFilters({ name: "", status: "", doctor: "", date: "" }); setResults([]); setSearched(false); };

  const inputClass = "bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Search</h2>
        <p className="text-gray-400 text-sm mt-1">Filter patient records</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Student Name</label>
            <input placeholder="Search by name..." value={filters.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Status</label>
            <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
              <option value="">All</option>
              <option value="waiting">Waiting</option>
              <option value="treated">Treated</option>
              <option value="referred">Referred</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Doctor</label>
            <input placeholder="Doctor name..." value={filters.doctor} onChange={(e) => set("doctor", e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Date</label>
            <input type="date" value={filters.date} onChange={(e) => set("date", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={search} className="px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-sm">Search</button>
          <button onClick={clear}  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-sm hover:text-gray-800 transition-all">Clear</button>
        </div>
      </div>

      {searched && (
        <div>
          <p className="text-sm text-gray-400 mb-3">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
          <div className="space-y-3">
            {results.length === 0 && <p className="text-gray-400 text-center py-10">No records match your search</p>}
            {results.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{p.student_name}</p>
                    <span className="text-xs text-gray-400">{p.roll_no}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">🩺 {p.symptoms}</p>
                  <p className="text-xs text-gray-400 mt-1">{p.doctor} · {p.medicine} · {p.visit_date} {p.visit_time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
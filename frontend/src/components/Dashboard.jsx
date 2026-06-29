import { useEffect, useState } from "react";
import { API } from "../App";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/clinic/stats`)
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = stats ? [
    { label: "Total Today",     value: stats.total_today,     color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200" },
    { label: "Waiting",         value: stats.waiting,          color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200"   },
    { label: "Treated",         value: stats.treated,          color: "text-green-600",   bg: "bg-green-50",    border: "border-green-200"   },
    { label: "Referred",        value: stats.referred,         color: "text-red-500",     bg: "bg-red-50",      border: "border-red-200"     },
    { label: "All Time",        value: stats.total_all_time,   color: "text-gray-700",    bg: "bg-gray-50",     border: "border-gray-200"    },
    { label: "Doctors On Duty", value: stats.doctors_on_duty,  color: "text-blue-600",    bg: "bg-blue-50",     border: "border-blue-200"    },
  ] : [];

  const pct = stats && stats.total_today > 0 ? {
    waiting:  Math.round((stats.waiting  / stats.total_today) * 100),
    treated:  Math.round((stats.treated  / stats.total_today) * 100),
    referred: Math.round((stats.referred / stats.total_today) * 100),
  } : { waiting: 0, treated: 0, referred: 0 };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Today — {stats?.date || "loading..."}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl p-5`}>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{c.label}</p>
            <p className={`text-4xl font-bold mt-2 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-4">Today's Queue Status</p>
          <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-gray-100">
            {stats.total_today > 0 ? (
              <>
                <div className="bg-amber-400 transition-all"  style={{ width: `${pct.waiting}%`  }} title="Waiting" />
                <div className="bg-emerald-400 transition-all" style={{ width: `${pct.treated}%`  }} title="Treated" />
                <div className="bg-red-400 transition-all"    style={{ width: `${pct.referred}%` }} title="Referred" />
              </>
            ) : (
              <div className="bg-gray-200 w-full rounded-full" />
            )}
          </div>
          <div className="flex gap-6 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Waiting ({stats.waiting})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>Treated ({stats.treated})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Referred ({stats.referred})</span>
          </div>
        </div>
      )}
    </div>
  );
}
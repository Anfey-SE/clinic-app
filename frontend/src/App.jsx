import { useState } from "react";
import Dashboard from "./components/Dashboard";
import AddPatient from "./components/AddPatient";
import Queue from "./components/Queue";
import Search from "./components/Search";

export const API = "http://127.0.0.1:5000";

const TABS = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Add Patient", icon: "➕" },
  { name: "Queue", icon: "🧾" },
  { name: "Search", icon: "🔍" },
];

export default function App() {
  const [tab, setTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-emerald-600">🏥 ClinicQ</h1>
          <p className="text-xs text-gray-400">Campus Clinic Queue Manager</p>
        </div>
        <nav className="ml-auto flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.name}
              onClick={() => setTab(t.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.name
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {t.icon} {t.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "Dashboard"   && <Dashboard />}
        {tab === "Add Patient" && <AddPatient onAdded={() => setTab("Queue")} />}
        {tab === "Queue"       && <Queue />}
        {tab === "Search"      && <Search />}
      </main>
    </div>
  );
}
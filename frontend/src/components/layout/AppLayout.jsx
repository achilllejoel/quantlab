import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <span className="text-sm text-slate-500">
            Interactive Quantitative Finance Models
          </span>

          <span className="text-sm font-semibold text-slate-700">
            QuantLab Studio
          </span>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
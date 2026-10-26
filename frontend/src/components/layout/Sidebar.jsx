
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Landmark,
  ArrowLeftRight,
  Activity,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Options", path: "/options", icon: ChartNoAxesCombined },
  { name: "Bonds", path: "/bonds", icon: Landmark },
  { name: "Swaps", path: "/swaps", icon: ArrowLeftRight },
  { name: "Exposure & PFE", path: "/exposure", icon: Activity },
  { name: "Credit Risk (CVA)", path: "/cva", icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col bg-slate-900 px-5 py-8 text-white">

      {/* Brand */}
      <div className="mb-12 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/30">
          <ChartNoAxesCombined
            size={24}
            className="text-white"
          />
        </div>

        <div className="min-w-0">
          <div className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-white">
            Quant<span className="text-blue-400">Lab</span>
          </div>

          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Quantitative Finance Studio
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex flex-1 flex-col gap-2"
      >
        {navigation.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-4 py-3",
                "text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-10 border-t border-slate-700/70 pt-5">
        <div className="flex items-center gap-2 px-3 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          QuantLab Studio
        </div>

        <p className="mt-2 px-3 text-[11px] text-slate-500">
          Quantitative Finance Platform
        </p>
      </div>
    </aside>
  );
}

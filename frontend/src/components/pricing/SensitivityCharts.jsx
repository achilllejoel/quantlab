import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const metrics = [
  { key: "price", label: "Option Price" },
  { key: "delta", label: "Delta" },
  { key: "gamma", label: "Gamma" },
  { key: "vega", label: "Vega" },
  { key: "theta", label: "Theta" },
  { key: "rho", label: "Rho" },
];

export default function SensitivityCharts({ series, variable }) {
  const [metric, setMetric] = useState("price");

  if (!series?.length) return null;

  const selectedMetric = metrics.find((m) => m.key === metric);

  const formatValue = (value) =>
    typeof value === "number" ? value.toFixed(4) : value;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Sensitivity Analysis
        </h3>

        <select
          value={metric}
          onChange={(event) => setMetric(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {metrics.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-80 w-full rounded-xl border border-slate-200 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey={variable}
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) => Number(value).toFixed(1)}
            />

            <YAxis
              width={65}
              domain={["auto", "auto"]}
              tickFormatter={(value) => Number(value).toFixed(2)}
            />

            <Tooltip
              formatter={formatValue}
              labelFormatter={(value) =>
                `${variable}: ${Number(value).toFixed(4)}`
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey={metric}
              name={selectedMetric.label}
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500">
        Sensitivities calculated using the Black-Scholes-Merton
        analytical model.
      </p>
    </div>
  );
}
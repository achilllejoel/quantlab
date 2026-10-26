import { useRef, useState } from "react";
import { Calculator, Info, RotateCcw, TrendingUp } from "lucide-react";
import { calculateBlackScholes, calculateSensitivities } from "../api/pricing";
import SensitivityCharts from "../components/pricing/SensitivityCharts";

const initialParams = {
  spot: 100,
  strike: 100,
  maturity: 1,
  volatility: 0.2,
  rate: 0.05,
  dividend: 0,
  option_type: "call",
};

const fields = [
  ["spot", "Spot price (S)"],
  ["strike", "Strike price (K)"],
  ["maturity", "Maturity (years, T)"],
  ["volatility", "Volatility (σ)"],
  ["rate", "Risk-free rate (r)"],
  ["dividend", "Dividend yield (q)"],
];

const greekNames = ["delta", "gamma", "vega", "theta", "rho"];

export default function Options() {
  const [params, setParams] = useState(initialParams);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sensitivityData, setSensitivityData] = useState(null);
  const [sensitivityError, setSensitivityError] = useState("");
  const requestId = useRef(0);

  function clearOutputs() {
    requestId.current += 1;
    setResults(null);
    setError("");
    setSensitivityData(null);
    setSensitivityError("");
    setLoading(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setParams((previous) => ({ ...previous, [name]: value }));
    clearOutputs();
  }

  function handleOptionType(type) {
    setParams((previous) => ({ ...previous, option_type: type }));
    clearOutputs();
  }

  function handleReset() {
    setParams({ ...initialParams });
    clearOutputs();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    setSensitivityError("");
    setResults(null);
    setSensitivityData(null);

    const normalizedParams = {
      ...params,
      spot: Number(params.spot),
      strike: Number(params.strike),
      maturity: Number(params.maturity),
      volatility: Number(params.volatility),
      rate: Number(params.rate),
      dividend: Number(params.dividend),
    };

    try {
      const pricingResponse = await calculateBlackScholes(normalizedParams);
      if (currentRequest !== requestId.current) return;
      setResults(pricingResponse.results);

      try {
        const sensitivityResponse = await calculateSensitivities({
          ...normalizedParams,
          variable: "spot",
          minimum: normalizedParams.spot * 0.5,
          maximum: normalizedParams.spot * 1.5,
          points: 51,
        });
        if (currentRequest !== requestId.current) return;
        setSensitivityData(sensitivityResponse);
      } catch (err) {
        if (currentRequest === requestId.current) {
          setSensitivityError(err.message || "Unable to calculate sensitivities.");
        }
      }
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(err.message || "Unable to calculate the option price.");
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page heading */}
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Pricing Models / Equity Derivatives
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Options Pricing
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            European option valuation and risk sensitivity analysis.
          </p>
        </div>
      </header>

      {/* Model navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Black-Scholes-Merton
        </span>
        {["Binomial Tree", "Monte Carlo", "Heston"].map((model) => (
          <button
            key={model}
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-lg px-4 py-2 text-sm text-slate-400"
          >
            {model}
          </button>
        ))}
      </div>

      {/* Pricing workspace */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Inputs</p>
              <h2 className="text-lg font-semibold text-slate-900">Model Parameters</h2>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map(([name, label]) => (
                <label key={name} className="block min-w-0">
                  <span className="mb-2 block text-xs font-medium text-slate-600">{label}</span>
                  <input
                    name={name}
                    type="number"
                    step="any"
                    min={["spot", "strike", "maturity", "volatility"].includes(name) ? "0.00000001" : undefined}
                    required
                    value={params[name]}
                    onChange={handleChange}
                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
            </div>

            <div>
              <span className="mb-2 block text-xs font-medium text-slate-600">Option type</span>
              <div className="grid grid-cols-2 gap-2">
                {["call", "put"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleOptionType(type)}
                    aria-pressed={params.option_type === type}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium capitalize ${
                      params.option_type === type
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Calculator size={18} /> {loading ? "Calculating..." : "Calculate Price"}
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              Calculation failed: {error}
            </p>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Outputs</p>
              <h2 className="text-lg font-semibold text-slate-900">Results &amp; Analytics</h2>
            </div>
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              Analytical
            </span>
          </div>

          {!results ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <TrendingUp size={44} className="mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-700">Ready to calculate</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Enter model parameters and click Calculate Price to display the option
                value and risk sensitivities.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <p className="text-sm text-slate-600">
                  European {params.option_type} option
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-blue-700">
                  {results.price.toFixed(4)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {greekNames.map((greek) => (
                  <div key={greek} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center">
                    <p className="text-xs font-medium uppercase text-slate-500">{greek}</p>
                    <p className="mt-1 text-base font-semibold tabular-nums tracking-tight text-slate-900">
                      {results[greek].toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                <Info size={16} className="shrink-0" />
                <p>
                  Theta is annualized. Vega and Rho are per unit change
                  (divide by 100 for a 1% change).
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {sensitivityError && (
        <p role="alert" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Sensitivity calculation failed: {sensitivityError}
        </p>
      )}

      {/* Full-width sensitivity chart */}
      {sensitivityData && (
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SensitivityCharts
            series={sensitivityData.series}
            variable={sensitivityData.variable}
          />
        </section>
      )}
    </div>
  );
}

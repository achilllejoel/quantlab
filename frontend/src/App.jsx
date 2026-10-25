
import { useState } from "react";
import { calculateBlackScholes } from "./api/pricing";
import "./App.css";

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
  ["spot", "Spot price"],
  ["strike", "Strike price"],
  ["maturity", "Maturity (years)"],
  ["volatility", "Volatility (decimal)"],
  ["rate", "Risk-free rate (decimal)"],
  ["dividend", "Dividend yield (decimal)"],
];

export default function App() {
  const [params, setParams] = useState(initialParams);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setParams((previous) => ({
      ...previous,
      [name]: value,
    }));

    setResults(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await calculateBlackScholes(params);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header className="header">
        <div className="brand">QuantLab</div>
        <p>Interactive Quantitative Finance Models</p>
      </header>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h1>Black-Scholes-Merton</h1>
            <p>European Option Pricing & Greeks</p>
          </div>
          <span className="tag">Analytical</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.map(([name, label]) => (
              <label key={name}>
                <span>{label}</span>
                <input
                  name={name}
                  type="number"
                  step="any"
                  required
                  value={params[name]}
                  onChange={handleChange}
                />
              </label>
            ))}

            <label>
              <span>Option type</span>
              <select
                name="option_type"
                value={params.option_type}
                onChange={handleChange}
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Calculating..." : "Calculate price"}
          </button>
        </form>

        {error && (
          <p className="error">Calculation failed: {error}</p>
        )}

        {results && (
          <div className="results">
            <h2>Pricing results</h2>

            <div className="price-card">
              <span>Option price</span>
              <strong>{results.price.toFixed(4)}</strong>
            </div>

            <div className="greeks-grid">
              {["delta", "gamma", "vega", "theta", "rho"].map(
                (greek) => (
                  <div className="greek-card" key={greek}>
                    <span>{greek.toUpperCase()}</span>
                    <strong>
                      {results[greek].toFixed(4)}
                    </strong>
                  </div>
                )
              )}
            </div>
            <p className="units">
              Theta is annualized. Vega and Rho are per
              unit change (divide by 100 for a 1% change).
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

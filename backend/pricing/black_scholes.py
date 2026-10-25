
from dataclasses import dataclass
from math import exp, log, sqrt

from scipy.stats import norm


@dataclass(frozen=True)
class BlackScholesParams:
    spot: float
    strike: float
    maturity: float
    rate: float
    volatility: float
    dividend: float = 0.0


def black_scholes(p: BlackScholesParams, option_type: str = "call") -> dict:
    if not (p.spot > 0 and p.strike > 0):
        raise ValueError("Spot and strike must be positive")
    if not (p.maturity > 0 and p.volatility > 0):
        raise ValueError("Maturity and volatility must be positive")
    if option_type not in ("call", "put"):
        raise ValueError("option_type must be 'call' or 'put'")

    from math import isfinite
    if not all(isfinite(x) for x in (
        p.spot, p.strike, p.maturity, p.rate,
        p.volatility, p.dividend
    )):
        raise ValueError("All parameters must be finite")

    s, k, t = p.spot, p.strike, p.maturity
    r, q, sigma = p.rate, p.dividend, p.volatility

    sqrt_t = sqrt(t)
    d1 = (log(s / k) + (r - q + 0.5 * sigma**2) * t) / (
        sigma * sqrt_t
    )
    d2 = d1 - sigma * sqrt_t

    df_r = exp(-r * t)
    df_q = exp(-q * t)
    pdf_d1 = norm.pdf(d1)

    gamma = df_q * pdf_d1 / (s * sigma * sqrt_t)
    vega = s * df_q * pdf_d1 * sqrt_t

    if option_type == "call":
        price = s * df_q * norm.cdf(d1) - k * df_r * norm.cdf(d2)
        delta = df_q * norm.cdf(d1)
        theta = (
            -s * df_q * pdf_d1 * sigma / (2 * sqrt_t)
            - r * k * df_r * norm.cdf(d2)
            + q * s * df_q * norm.cdf(d1)
        )
        rho = k * t * df_r * norm.cdf(d2)
    else:
        price = k * df_r * norm.cdf(-d2) - s * df_q * norm.cdf(-d1)
        delta = df_q * (norm.cdf(d1) - 1)
        theta = (
            -s * df_q * pdf_d1 * sigma / (2 * sqrt_t)
            + r * k * df_r * norm.cdf(-d2)
            - q * s * df_q * norm.cdf(-d1)
        )
        rho = -k * t * df_r * norm.cdf(-d2)

    result = {
        "price": float(price),
        "delta": float(delta),
        "gamma": float(gamma),
        "vega": float(vega),
        "theta": float(theta),
        "rho": float(rho),
    }

    if not all(isfinite(v) for v in result.values()):
        raise ValueError("Parameters produce non-finite results")

    return result

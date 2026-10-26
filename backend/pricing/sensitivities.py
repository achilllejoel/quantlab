from dataclasses import replace
from math import isfinite

from .black_scholes import BlackScholesParams, black_scholes


SUPPORTED_VARIABLES = ("spot", "volatility", "maturity")


def black_scholes_sensitivities(
    params: BlackScholesParams,
    option_type: str = "call",
    variable: str = "spot",
    minimum: float = 50.0,
    maximum: float = 150.0,
    points: int = 51,
) -> list[dict]:
    if variable not in SUPPORTED_VARIABLES:
        raise ValueError("Unsupported sensitivity variable")

    if not isinstance(points, int) or not 2 <= points <= 201:
        raise ValueError("points must be between 2 and 201")

    if not all(isfinite(x) for x in (minimum, maximum)):
        raise ValueError("Range bounds must be finite")

    if minimum <= 0 or maximum <= minimum:
        raise ValueError("Require 0 < minimum < maximum")

    # Validate base parameters even if the varied parameter
    # will be replaced at every grid point.
    black_scholes(params, option_type=option_type)

    step = (maximum - minimum) / (points - 1)
    series = []

    for i in range(points):
        value = minimum + i * step

        varied_params = replace(params, **{variable: value})

        result = black_scholes(
            varied_params,
            option_type=option_type,
        )

        series.append({
            variable: float(value),
            **result,
        })

    return series

from django.test import SimpleTestCase
from rest_framework.test import APIClient

from .black_scholes import BlackScholesParams, black_scholes
from .sensitivities import black_scholes_sensitivities



class BlackScholesTests(SimpleTestCase):

    def setUp(self):
        self.params = BlackScholesParams(
            spot=100,
            strike=100,
            maturity=1,
            rate=0.05,
            volatility=0.2,
        )

    def test_call_price(self):
        result = black_scholes(self.params, "call")
        self.assertAlmostEqual(result["price"], 10.45058357, places=6)

    def test_put_call_parity(self):
        call = black_scholes(self.params, "call")["price"]
        put = black_scholes(self.params, "put")["price"]

        from math import exp
        expected = (
            self.params.spot * exp(-self.params.dividend)
            - self.params.strike * exp(-self.params.rate)
        )
        self.assertAlmostEqual(call - put, expected, places=8)

    def test_invalid_volatility(self):
        from dataclasses import replace

        params = replace(self.params, volatility=-0.2)
        with self.assertRaises(ValueError):
            black_scholes(params)

    def test_api(self):
        client = APIClient()
        response = client.post(
            "/api/pricing/black-scholes/",
            {
                "spot": 100,
                "strike": 100,
                "maturity": 1,
                "rate": 0.05,
                "volatility": 0.2,
                "option_type": "call",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertAlmostEqual(
            response.data["results"]["price"],
            10.45058357,
            places=6,
        )


class BlackScholesSensitivityTests(SimpleTestCase):

    def setUp(self):
        self.params = BlackScholesParams(
            spot=100,
            strike=100,
            maturity=1,
            rate=0.05,
            volatility=0.2,
            dividend=0,
        )

    def test_series_length(self):
        series = black_scholes_sensitivities(
            self.params,
            minimum=50,
            maximum=150,
            points=51,
        )

        self.assertEqual(len(series), 51)
        self.assertAlmostEqual(series[0]["spot"], 50)
        self.assertAlmostEqual(series[-1]["spot"], 150)

    def test_at_the_money_price(self):
        series = black_scholes_sensitivities(
            self.params,
            minimum=50,
            maximum=150,
            points=51,
        )

        self.assertAlmostEqual(
            series[25]["price"],
            10.450583572185565,
            places=6,
        )

    def test_invalid_range(self):
        with self.assertRaises(ValueError):
            black_scholes_sensitivities(
                self.params,
                minimum=150,
                maximum=50,
            )
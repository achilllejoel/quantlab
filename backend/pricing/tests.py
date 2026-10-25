
from django.test import SimpleTestCase
from rest_framework.test import APIClient

from .black_scholes import BlackScholesParams, black_scholes


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

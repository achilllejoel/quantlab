from django.urls import path

from .views import (
    black_scholes_view,
    black_scholes_sensitivities_view,
)

urlpatterns = [
    path(
        "black-scholes/",
        black_scholes_view,
        name="black-scholes",
    ),
    path(
        "black-scholes/sensitivities/",
        black_scholes_sensitivities_view,
        name="black-scholes-sensitivities",
    ),
]
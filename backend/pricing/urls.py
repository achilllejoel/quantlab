from django.urls import path
from .views import black_scholes_view

urlpatterns = [
    path("black-scholes/", black_scholes_view, name="black-scholes"),
]

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .black_scholes import BlackScholesParams, black_scholes
from .serializers import BlackScholesSerializer

from .sensitivities import black_scholes_sensitivities
from .serializers import BlackScholesSensitivitySerializer


@api_view(["POST"])
def black_scholes_view(request):
    serializer = BlackScholesSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data

    params = BlackScholesParams(
        spot=data["spot"],
        strike=data["strike"],
        maturity=data["maturity"],
        rate=data["rate"],
        volatility=data["volatility"],
        dividend=data["dividend"],
    )

    try:
        result = black_scholes(
            params, option_type=data["option_type"]
        )
    except (ValueError, OverflowError, ZeroDivisionError) as exc:
        return Response(
            {"error": str(exc)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response({
        "model": "Black-Scholes-Merton",
        "option_type": data["option_type"],
        "results": result,
    })


@api_view(["POST"])
def black_scholes_sensitivities_view(request):
    serializer = BlackScholesSensitivitySerializer(
        data=request.data
    )
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data

    params = BlackScholesParams(
        spot=data["spot"],
        strike=data["strike"],
        maturity=data["maturity"],
        rate=data["rate"],
        volatility=data["volatility"],
        dividend=data["dividend"],
    )

    try:
        series = black_scholes_sensitivities(
            params=params,
            option_type=data["option_type"],
            variable=data["variable"],
            minimum=data["minimum"],
            maximum=data["maximum"],
            points=data["points"],
        )
    except (ValueError, OverflowError, ZeroDivisionError) as exc:
        return Response(
            {"error": str(exc)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response({
        "model": "Black-Scholes-Merton",
        "option_type": data["option_type"],
        "variable": data["variable"],
        "series": series,
    })




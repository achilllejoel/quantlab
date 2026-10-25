from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .black_scholes import BlackScholesParams, black_scholes
from .serializers import BlackScholesSerializer


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



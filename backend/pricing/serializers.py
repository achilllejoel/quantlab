from rest_framework import serializers


class BlackScholesSerializer(serializers.Serializer):
    spot = serializers.FloatField(min_value=0.000001)
    strike = serializers.FloatField(min_value=0.000001)
    maturity = serializers.FloatField(min_value=0.000001)
    rate = serializers.FloatField()
    volatility = serializers.FloatField(
        min_value=0.000001, max_value=5.0
    )
    dividend = serializers.FloatField(default=0.0)
    option_type = serializers.ChoiceField(
        choices=["call", "put"], default="call"
    )

    def validate(self, attrs):
        from math import isfinite

        for key, value in attrs.items():
            if isinstance(value, (int, float)) and not isfinite(value):
                raise serializers.ValidationError({
                    key: "Must be a finite number."
                })
        return attrs



class BlackScholesSensitivitySerializer(BlackScholesSerializer):
    variable = serializers.ChoiceField(
        choices=["spot", "volatility", "maturity"],
        default="spot",
    )

    minimum = serializers.FloatField()
    maximum = serializers.FloatField()

    points = serializers.IntegerField(
        min_value=2,
        max_value=201,
        default=51,
    )

    def validate(self, attrs):
        attrs = super().validate(attrs)

        if attrs["minimum"] <= 0:
            raise serializers.ValidationError({
                "minimum": "Must be positive."
            })

        if attrs["maximum"] <= attrs["minimum"]:
            raise serializers.ValidationError({
                "maximum": "Must be greater than minimum."
            })

        return attrs
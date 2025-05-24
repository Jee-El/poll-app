from random import choice
from rest_framework import serializers

from polls.models import Poll


class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poll
        fields = "__all__"

    def validate(self, data):
        super().validate(data)

        created_at = data.get("created_at") or getattr(
            self.instance, "created_at", None
        )
        deadline = data.get("deadline")
        if created_at and deadline and (created_at >= deadline):
            raise serializers.ValidationError(
                "deadline must be greater than created_at."
            )
        return data

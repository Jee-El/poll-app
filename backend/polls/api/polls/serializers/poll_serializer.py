from rest_framework import serializers
from polls.models.choice import Choice
from . import ChoiceSerializer
from polls.models import Poll


class PollSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Poll
        fields = "__all__"

    def create(self, validated_data):
        choices_data = validated_data.pop("choices")
        poll = Poll.objects.create(**validated_data)

        for choice_data in choices_data:
            Choice.objects.create(poll=poll, **choice_data)
        return poll

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

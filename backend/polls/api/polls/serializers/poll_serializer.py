from rest_framework import serializers
from polls.models.choice import Choice
from . import ChoiceSerializer
from polls.models import Poll


class PollSerializer(serializers.ModelSerializer):
    choice_set = ChoiceSerializer(many=True)
    user = serializers.SlugRelatedField(read_only=True, slug_field="username")
    is_active = serializers.ReadOnlyField()

    class Meta:
        model = Poll
        fields = "__all__"
        read_only_fields = ["user", "created_at", "is_active"]

    def create(self, validated_data):
        choices_data = validated_data.pop("choice_set")

        poll = Poll.objects.create(**validated_data)
        for choice_data in choices_data:
            Choice.objects.create(poll=poll, **choice_data)

        return poll

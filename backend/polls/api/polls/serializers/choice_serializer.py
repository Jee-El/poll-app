from rest_framework.serializers import ModelSerializer

from polls.models import Choice


class ChoiceSerializer(ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"
        read_only_fields = ["vote_count", "poll"]

from rest_framework.serializers import ModelSerializer

from polls.models import Choice


class ChoiceSerializer(ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"

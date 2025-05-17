from rest_framework.serializers import ModelSerializer

from polls.models import Question
from polls.models import Choice


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class ChoiceSerializer(ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"

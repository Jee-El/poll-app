from rest_framework.serializers import ModelSerializer

from polls.models import Poll


class PollSerializer(ModelSerializer):
    class Meta:
        model = Poll
        fields = "__all__"

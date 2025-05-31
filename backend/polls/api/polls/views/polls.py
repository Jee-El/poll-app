from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers import PollSerializer
from polls.models import Poll


@api_view(["GET"])
@permission_classes([AllowAny])
def get_polls(request):
    polls = Poll.objects.all().prefetch_related("choice_set").order_by("-created_at")
    serializedPolls = PollSerializer(polls, many=True)
    return Response(serializedPolls.data)

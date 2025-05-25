from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers import PollSerializer
from polls.models import Poll


@api_view(["GET"])
@permission_classes([AllowAny])
def getPoll(request, id: int):
    poll = Poll.objects.prefetch_related("choice_set").get(pk=id)
    serializedPoll = PollSerializer(poll)
    return Response(serializedPoll.data)

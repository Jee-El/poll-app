from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers import QuestionSerializer
from polls.models import Question


@api_view(["GET"])
@permission_classes([AllowAny])
def getPoll(request, id: int):
    poll = Question.objects.get(pk=id)
    serializedPoll = QuestionSerializer(poll)
    return Response(serializedPoll.data)

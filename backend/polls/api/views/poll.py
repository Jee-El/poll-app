from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import QuestionSerializer
from polls.models import Question


@api_view(["GET"])
def getPoll(request, id: int):
    poll = Question.objects.get(pk=id)
    serializedPoll = QuestionSerializer(poll)
    return Response(serializedPoll.data)

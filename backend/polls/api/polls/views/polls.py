from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers import QuestionSerializer
from polls.models import Question


@api_view(["GET"])
@permission_classes([AllowAny])
def getPolls(request):
    polls = Question.objects.prefetch_related("choices").all()
    serializedPolls = QuestionSerializer(polls, many=True)
    return Response(serializedPolls.data)

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from polls.models.poll import Poll
from ..serializers import VoteSerializer, PollSerializer


@api_view(["POST"])
def vote(request):
    serializers = [
        VoteSerializer(data=vote, context={"request": request}) for vote in request.data
    ]

    are_valid = True
    for serializer in serializers:
        if not serializer.is_valid():
            are_valid = False
            break
    if are_valid:
        for serializer in serializers:
            vote = serializer.save()
        poll = Poll.objects.get(id=vote.poll.id)
        serializedPoll = PollSerializer(poll)
        return Response(
            serializedPoll.data,
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

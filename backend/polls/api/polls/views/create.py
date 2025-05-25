from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..serializers import PollSerializer


@api_view(["POST"])
def create(request):
    deserializedNewPoll = PollSerializer(data=request.data)

    if deserializedNewPoll.is_valid():
        deserializedNewPoll = deserializedNewPoll.save(user=request.user)
        serializedNewPoll = PollSerializer(deserializedNewPoll)
        return Response(
            serializedNewPoll.data,
            status=status.HTTP_201_CREATED,
        )

    return Response(deserializedNewPoll.errors, status=status.HTTP_400_BAD_REQUEST)

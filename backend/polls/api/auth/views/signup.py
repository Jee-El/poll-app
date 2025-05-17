from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..serializers import SignupSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    user = SignupSerializer(data=request.data)

    if user.is_valid():
        user.save()

        return Response(
            {"status": "success", "message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )

    return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

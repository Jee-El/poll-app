from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from polls.models import Vote, Poll


@api_view(["GET"])
def get_user_stats(request):
    user = request.user
    date_joined = user.date_joined.isoformat()
    user_polls = Poll.objects.filter(user=user)

    total_polls = user_polls.count()
    active_polls = len([None for p in user_polls if p.is_active])
    expired_polls = total_polls - active_polls
    total_votes = Vote.objects.filter(user=user).count()

    user_stats = {
        "total_polls": total_polls,
        "active_polls": active_polls,
        "expired_polls": expired_polls,
        "total_votes": total_votes,
        "date_joined": date_joined,
    }

    return Response(user_stats, status.HTTP_200_OK)

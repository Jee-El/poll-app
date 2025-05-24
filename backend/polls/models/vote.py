from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from .poll import Poll
from .choice import Choice


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "poll", "choice"], name="unique_vote_per_poll"
            )
        ]

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from .question import Question
from .choice import Choice


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "question", "choice"], name="unique_vote_per_poll"
            )
        ]

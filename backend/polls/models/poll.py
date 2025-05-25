from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.functions import Now
from django.db.models import Q, F


class Poll(models.Model):
    question = models.CharField(max_length=90)
    description = models.CharField(max_length=220, default="", blank=True)
    allows_multiple_choices = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField("Published on", default=timezone.now)
    deadline = models.DateTimeField("Ends on")
    is_active = models.BooleanField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(deadline__gt=F("created_at")), name="deadline_not_in_past"
            ),
            models.CheckConstraint(
                condition=Q(is_active=False, deadline__gte=Now())
                | Q(is_active=True, deadline__lt=Now()),
                name="is_active_matches_deadline",
            ),
        ]

    def __str__(self):
        return self.question

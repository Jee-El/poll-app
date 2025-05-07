from django.db import models
from django.utils import timezone


class Question(models.Model):
    question_txt = models.CharField(max_length=90)
    description = models.CharField(max_length=220)
    created_at = models.DateTimeField("Published on", default=timezone.now)
    deadline = models.DateTimeField("Ends on")

    def __str__(self):
        return self.question_txt

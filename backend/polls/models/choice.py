from django.db import models
from .question import Question


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_txt = models.CharField(max_length=50)
    votes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.choice_txt

from django.db import models

# Create your models here.


class Question(models.Model):
    question_txt = models.CharField(max_length=90)
    description = models.CharField(max_length=220)
    created_at = models.DateTimeField("Published on")
    deadline = models.DateTimeField("Ends on")


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=50)
    votes = models.PositiveIntegerField(default=0)

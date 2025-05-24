from django.db import models
from .poll import Poll


class Choice(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    choice_txt = models.CharField(max_length=50)
    vote_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.choice_txt

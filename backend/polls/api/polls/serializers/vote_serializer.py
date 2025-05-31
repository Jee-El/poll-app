from rest_framework import serializers
from polls.models.choice import Choice
from polls.models.vote import Vote
from polls.models import Poll
from django.db.models import F


class VoteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Vote
        fields = "__all__"

    def validate(self, attrs):
        attrs["user"] = self.context["request"].user
        user = attrs["user"]
        poll = attrs["poll"]
        choice = attrs["choice"]

        if Vote.objects.filter(user=user, poll=poll, choice=choice).exists():
            raise serializers.ValidationError("You have already voted on this poll!")

        return super().validate(attrs)

    def create(self, validated_data):
        vote = super().create(validated_data)

        Choice.objects.filter(id=vote.choice.id).update(vote_count=F("vote_count") + 1)

        return vote

    def delete(self, *args, **kwargs):
        Choice.objects.filter(pk=self.choice_id).update(vote_count=F("vote_count") - 1)
        super().delete(*args, **kwargs)

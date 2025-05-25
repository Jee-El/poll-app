from django.urls import path, include

urlpatterns = [
    path("polls/", include("polls.api.polls.urls")),
    path("auth/", include("polls.api.auth.urls")),
]

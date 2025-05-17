from django.urls import path, include

urlpatterns = [
    path("", include("polls.api.polls.urls")),
    path("auth/", include("polls.api.auth.urls")),
]

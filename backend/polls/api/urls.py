from django.urls import path, include
from . import views

urlpatterns = [
    path("polls/", include("polls.api.polls.urls")),
    path("auth/", include("polls.api.auth.urls")),
    path("user_stats/", views.get_user_stats, name="me"),
]

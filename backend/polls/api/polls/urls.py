from django.urls import path
from . import views


urlpatterns = [
    path("", views.get_polls, name="get_polls"),
    path("<int:id>/", views.get_poll, name="get_poll"),
    path("create/", views.create, name="create"),
    path("vote/", views.vote, name="vote"),
]

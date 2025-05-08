from django.urls import path
from . import views

urlpatterns = [
    path("", views.getPolls, name="getPolls"),
    path("<int:pollId>/", views.getPoll, name="getPoll"),
]

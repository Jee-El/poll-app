from django.urls import path
from . import views


urlpatterns = [
    path("", views.getPolls, name="getPolls"),
    path("<int:id>/", views.getPoll, name="getPoll"),
    path("create/", views.create, name="create"),
]

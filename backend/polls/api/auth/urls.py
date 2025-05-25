from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from polls.api.auth.views import whoami
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh_token/", TokenRefreshView.as_view(), name="refresh_token"),
    path("verify_token/", TokenVerifyView.as_view(), name="verify_token"),
    path("whoami/", views.whoami, name="whoami"),
]

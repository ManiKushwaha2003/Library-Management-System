
from django.urls import path
from .api_views import UserAPI
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


urlpatterns = [
    path('login/',TokenObtainPairView.as_view(),name="login"),
    path('refreshtoken/',TokenRefreshView.as_view(),name="refresh"),
    path('users/', UserAPI.as_view()),
    path('users/<int:id>/', UserAPI.as_view()),

    ]

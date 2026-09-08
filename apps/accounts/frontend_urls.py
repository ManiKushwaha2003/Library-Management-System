from django.urls import path
from . import frontend_views

urlpatterns = [
    path("", frontend_views.login, name="home"), 
    path("login/", frontend_views.login, name="login"),
    path("users/", frontend_views.users, name="users"),

]
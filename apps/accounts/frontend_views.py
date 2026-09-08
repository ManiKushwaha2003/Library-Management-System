from django.shortcuts import render

def login(request):
    return render(request, "login.html")

def users(request):
    return render(request, "users.html")


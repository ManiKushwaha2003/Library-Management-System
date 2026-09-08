from django.shortcuts import render

def dashboard(request):
    return render(request, "dashboard.html")

def libraries(request):
    return render(request, "libraries.html")

def books(request):
    return render(request, "books.html")

def book_issue(request):
    return render(request, "book_issue.html")

def upload_csv(request):
    return render(request, "upload_csv.html")

# ================= USER =================



def user_dashboard(request):
    return render(request, "user/dashboard.html")

def user_profile(request):
    return render(request, "user/profile.html")

def user_edit_profile(request):
    return render(request, "user/edit_profile.html")

def user_issues(request):
    return render(request, "user/issues.html")

def user_libraries(request):
    return render(request, "user/libraries.html")

def library_books(request, id):
    return render(request, "user/books.html")

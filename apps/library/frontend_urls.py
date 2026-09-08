from django.urls import path
from . import frontend_views

urlpatterns = [
    path("dashboard/", frontend_views.dashboard, name="dashboard"),
    path("libraries/", frontend_views.libraries, name="libraries"),
    path("books/", frontend_views.books, name="books"),
    path("issues/", frontend_views.book_issue, name="book_issue"),
    path("upload/", frontend_views.upload_csv, name="upload_csv"),




    path("user-dashboard/", frontend_views.user_dashboard, name="user-dashboard"),
    path("user-profile/", frontend_views.user_profile, name="user-profile"),
    path("user-edit-profile/", frontend_views.user_edit_profile, name="user-edit-profile"),
    path("user-issues/", frontend_views.user_issues, name="user-issues"),
    path("user-libraries/", frontend_views.user_libraries, name="user-libraries"),
    path("library-books/<int:id>/", frontend_views.library_books, name="library-books"),
]
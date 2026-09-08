from django.urls import path

from .api_views import LibraryAPI, BookAPI,UserBookMappingAPI,BookCSVUploadAPI



urlpatterns = [

    path('libraries/',LibraryAPI.as_view(), name='libraries'),
    path('libraries/<int:id>/',LibraryAPI.as_view(),name="library"),
    path('books/',BookAPI.as_view(),name='books'),
    path('books/<int:id>/',BookAPI.as_view(),name="book"),
    path('bookissues/',UserBookMappingAPI.as_view(),name='issues'),
    path('bookissues/<int:id>/', UserBookMappingAPI.as_view(),name="issues"),



    path('book/upload-csv/', BookCSVUploadAPI.as_view()),
]
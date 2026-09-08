from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from .models import Library, Book, UserBookMapping
from .serializers import (
    LibrarySerializer,
    BookSerializer,
    UserBookMappingSerializer
)
import csv
import io
from . paginations import PageNumberPagination

# Create your views here.
class LibraryAPI(APIView):
    permission_classes=[IsAuthenticated]


    def get(self, request, id=None):

        if id:
            library = Library.objects.get(id=id)
            serializer = LibrarySerializer(library)
            return Response(serializer.data) 
        library = Library.objects.all()

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(library, request)

        serializer = LibrarySerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self,request):
        serializer=LibrarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


    def put(self,request,id):
        library=Library.objects.get(id=id)
        Serializer=LibrarySerializer(library,data=request.data,partial=True)
        if Serializer.is_valid():
            Serializer.save()
            return Response(Serializer.data)
        return Response(Serializer.errors)

    def delete(self,request,id):
        library=Library.objects.get(id=id)
        library.delete()
        return Response({'msg':'delete_data'})


class BookAPI(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self, request, id=None):

        if id:
            book = Book.objects.get(id=id)
            serializer = BookSerializer(book)
            return Response(serializer.data)

        books = Book.objects.all()

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(books, request)

        serializer = BookSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self,request):

        serializer=BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
        

    def put(self,request,id):
        book=Book.objects.get(id=id)
        Serializer=BookSerializer(book,data=request.data,partial=True)
        if Serializer.is_valid():
            Serializer.save()
            return Response(Serializer.data)
        return Response(Serializer.errors)

    def delete(self,request,id):
        book=Book.objects.get(id=id)
        book.delete()
        return Response({'msg':'delete_data'})



class BookCSVUploadAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        csv_file = request.FILES.get('file')

        if not csv_file:
            return Response(
                {"error": "Please upload a CSV file"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not csv_file.name.endswith('.csv'):
            return Response(
                {"error": "Only CSV file is allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)

            reader = csv.DictReader(io_string)

            books = []

            for row in reader:
                books.append(
                    Book(
                        book_name=row['book_name'],
                        author_name=row['author_name'],
                        library_id=row['library']
                    )
                )

            created_books=Book.objects.bulk_create(books)
            serializer = BookSerializer(created_books, many=True)


            return Response(
                {
                    "message": "Books inserted successfully",
                    "total_books": len(books),
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
                return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )    


class UserBookMappingAPI(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     data = UserBookMapping.objects.all()
    #     serializer = UserBookMappingSerializer(data, many=True)
    #     return Response(serializer.data)

    def get(self, request):

        if request.user.is_superuser:

            data = UserBookMapping.objects.all()

        else:

            data = UserBookMapping.objects.filter(user=request.user)

        serializer = UserBookMappingSerializer(data, many=True)

        return Response(serializer.data)    

    # def post(self, request):

    #     serializer = UserBookMappingSerializer(data=request.data)

    #     book_id = request.data.get("book")

    #     exists = UserBookMapping.objects.filter(
    #         user_id=request.data.get("user"),
    #         book_id=book_id
    #     ).exists()

    #     if exists:
    #         return Response(
    #             {"msg":"Book already issued to this user"},
    #             status=status.HTTP_400_BAD_REQUEST
    #         )  

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response( serializer.data)

    #     return Response(serializer.errors)

    def post(self, request):

        user_id = request.data.get("user")
        book_id = request.data.get("book")

        # Same book dobara issue na ho
        if UserBookMapping.objects.filter(book_id=book_id).exists():
            return Response(
                {"msg": "Book is already issued"},
                status=400
            )

        serializer = UserBookMappingSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)    

    def put(self, request, id):

        mapping = UserBookMapping.objects.get(id=id)

        serializer = UserBookMappingSerializer(
            mapping,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors)



    def delete(self, request, id):
        mapping = UserBookMapping.objects.get(id=id)
        mapping.delete()
        return Response({"msg": "delete"})         
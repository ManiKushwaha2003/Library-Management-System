from rest_framework import serializers
from .models import Library, Book, UserBookMapping


class LibrarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Library
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = '__all__'


class UserBookMappingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserBookMapping
        fields = '__all__'

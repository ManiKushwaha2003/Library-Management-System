from django.db import models
from apps.accounts.models import User


# Create your models here.

class Library(models.Model):
    library_name=models.CharField(max_length=100)
    def __str__(self):
        return self.library_name


class Book(models.Model):
    book_name=models.CharField(max_length=50)
    author_name=models.CharField(max_length=100) 
    library=models.ForeignKey(Library,related_name='books',blank=True,null=True,on_delete=models.SET_NULL)
    def __str__(self):
        return self.book_name

class UserBookMapping(models.Model):
    user=models.ForeignKey(User,related_name='users',on_delete=models.CASCADE)
    book=models.ForeignKey(Book,related_name='books',on_delete=models.CASCADE)
    due_date = models.DateField()

    def __str__(self):
        return self.user.username
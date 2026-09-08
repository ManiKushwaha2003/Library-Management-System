from django.contrib import admin
from .models import Library,Book,UserBookMapping
# Register your models here.

@admin.register(Library)
class LibraryAdmin(admin.ModelAdmin):
    list_display=['id','library_name']

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display=['id','book_name','author_name']


@admin.register(UserBookMapping)
class UserBookMappingAdmin(admin.ModelAdmin):
    list_display=['id','user_id','book_id','due_date']
    


    
    


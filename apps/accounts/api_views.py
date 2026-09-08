from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.serializers import UserSerializer
from .models import User
from django.core.mail import send_mail
from django.conf import settings
from . paginations import PageNumberPagination
# Create your views here.


class UserAPI(APIView):
    permission_classes = [IsAuthenticated]


    # def get(self, request):
    #     users = User.objects.all()
    #     paginator = PageNumberPagination()
    #     page = paginator.paginate_queryset(users, request)
    #     serializer = UserSerializer(page, many=True)
    #     # return Response(serializer.data)
    #     return paginator.get_paginated_response(serializer.data)
    def get(self, request, id=None):

        if id:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response(serializer.data)

        users = User.objects.all().order_by("-id")

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(users, request)

        serializer = UserSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)


    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            if user.email:
                send_mail(
                    subject="Account Created Successfully",
                    message=f"Hello {user.username}, your account has been created successfully.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=False,
                )

            return Response({
                "message": "Account created successfully and email sent",
                "data": serializer.data
            })

        return Response(serializer.errors)
 

    def put(self, request, id):
        user = User.objects.get(id=id)

        serializer = UserSerializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


    def delete(self, request, id):
        user = User.objects.get(id=id)
        user.delete()
        return Response({'msg': 'delete_data' })   
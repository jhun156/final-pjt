from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer, UserInfoSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_list_or_404, get_object_or_404

User = get_user_model()

@api_view(['GET'])
def user_info(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def other_user_info(request, userid):
    user = get_object_or_404(User, pk=userid)
    serializer = UserInfoSerializer(user)
    return Response({
        "user": serializer.data,
        "movies": serializer.data.get('movies', [])
    })
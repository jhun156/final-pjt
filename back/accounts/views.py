from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserInfoSerializer,UserFollowSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_list_or_404, get_object_or_404

User = get_user_model()

@api_view(['GET'])
def user_info(request):
    serializer = UserInfoSerializer(request.user)
    return Response({
        "user": serializer.data,
        "movies": serializer.data.get('movies', [])
    })

@api_view(['GET'])
def other_user_info(request, userid):
    user = get_object_or_404(User, pk=userid)
    serializer = UserInfoSerializer(user)
    return Response({
        "user": serializer.data,
        "movies": serializer.data.get('movies', [])
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def follow(request, user_pk):
    User = get_user_model()
    person = get_object_or_404(User, pk=user_pk)

    if request.method == 'GET':
        serializer = UserFollowSerializer(person, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        if person == request.user:
            return Response({'error': '자기 자신은 팔로우할 수 없습니다.'}, status=400)

        if request.user in person.followers.all():
            person.followers.remove(request.user)
            followed = False
        else:
            person.followers.add(request.user)
            followed = True

        return Response({'followed': followed})

    else:
        return Response({'error': '허용되지 않은 요청입니다.'}, status=405)


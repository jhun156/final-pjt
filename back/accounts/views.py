from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserInfoSerializer,UserFollowSerializer,UserMovieSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import status
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_user(request):
    """
    현재 로그인된 유저가 좋아요를 누른 영화 목록을 반환합니다.
    """
    if request.method == 'GET':
        # 현재 로그인된 유저 객체를 가져옵니다.
        user = request.user

        serializer = UserMovieSerializer(user)

        # 직렬화된 데이터를 응답으로 반환합니다.
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # GET 요청 외의 다른 메서드가 들어왔을 경우
    return Response({"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
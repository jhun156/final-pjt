from django.shortcuts import render
from rest_framework import status
from .models import Movie,Comment
from django.shortcuts import get_list_or_404, get_object_or_404
from .serializers.movies import MovieListSerializer,MovieSerializer
from .serializers.comment import CommentSerializer,CommentUserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET','POST'])
def movie_list(request):
    if request.method == 'GET':
        movies = get_list_or_404(Movie, user = request.user)
        serializer = MovieListSerializer(movies, many = True)
        return Response(serializer.data)

    elif request.method == 'POST':
        user = request.user
        title = request.data.get('title')
        if Movie.objects.filter(user = user, title = title).exists():
            return Response({'message': '이미 저장된 영화입니다.'}, status=400)
        
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
def movie_detail(request, movie_pk):
    if request.method == 'GET':
        movie = get_object_or_404(Movie, pk = movie_pk)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)
    

@api_view(['GET', 'POST'])
def comment_list(request):
    if request.method == 'GET':
        comments = Comment.objects.all() 
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)
    
    elif request.method == 'POST':
        serializer = CommentUserSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user = request.user)
            return Response(serializer.data, status=201)
        

@api_view(['DELETE'])
def comment_delete(request, comment_pk):
    comment = get_object_or_404(Comment, pk = comment_pk)
    if comment.user != request.user:
        return Response({'detail': '권한이 없습니다.'}, status=403)
    comment.delete()
    return Response({'detail': '삭제 성공!'}, status=204)

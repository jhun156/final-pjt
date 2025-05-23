from rest_framework import serializers
from django.contrib.auth import get_user_model
from movies.models import Movie, Comment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', )

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    
    comments = CommentSerializer(many=True, read_only=True, source='comment_set')

    class Meta:
        model = Movie
        fields = ('id', 'title', 'description', 'genre', 'score', 'poster', 'release_date', 'runtime', 'comments', )

class UserInfoSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True, source='movie_set')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'movies', )
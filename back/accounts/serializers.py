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

class UserFollowSerializer(serializers.ModelSerializer):
    followers_count = serializers.IntegerField(source='followers.count', read_only=True)
    followings_count = serializers.IntegerField(source='followings.count', read_only=True)
    followed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'followers_count',
            'followings_count',
            'followed',
        )

    def get_followed(self, user):
        request = self.context.get('request')
        current_user = request.user if request else None
        if not current_user or not current_user.is_authenticated:
            return False
        return current_user in user.followers.all()

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title')  # id도 포함해두는 걸 추천

class UserMovieSerializer(serializers.ModelSerializer):
    movie_set = MovieSerializer(many=True, read_only=True)  # movie_set: 기본 related_name

    class Meta:
        model = User
        fields = ('username', 'movie_set')


        
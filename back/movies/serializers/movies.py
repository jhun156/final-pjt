from rest_framework import serializers
from ..models import Movie, Comment
from accounts.models import User

# 전체 영화 목록
class MovieListSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Movie 
        fields = ('title', 'description', 'poster', 'movie_num', )

# 단일 영화 정보 (리뷰목록 포함)
class MovieSerializer(serializers.ModelSerializer):
    class CommentListSerializer(serializers.ModelSerializer): 
        class Meta: 
            model = Comment
            fields = ('subtitle', 'content',) 
            
    comment_set = CommentListSerializer(many=True, read_only=True)
    movie_num = serializers.IntegerField()

    class Meta: 
        model = Movie
        fields = '__all__'
        read_only_fields = ('user',)  # user 필드를 read_only로 지정!
        



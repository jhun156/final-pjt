from rest_framework import serializers
from ..models import Movie, Comment
from accounts.models import User
from django.contrib.auth import get_user_model
User = get_user_model()


# 단일 코멘트 정보 (영화 정보 포함)
class CommentSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Comment
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'nickname', )


class CommentUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

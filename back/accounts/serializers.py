from rest_framework import serializers
from django.contrib.auth import get_user_model
from movies.models import Movie, Comment
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer
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
        fields = ('id', 'title', 'description', 'genre', 'score', 'poster', 'release_date', 'runtime', 'comments', 'movie_num', )

class UserInfoSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True, source='movie_set')

    class Meta:
        model = User
        fields = '__all__'

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


class CustomRegisterSerializer(RegisterSerializer):
    age=serializers.IntegerField(required=True)
    gender=serializers.ChoiceField(choices=User.GENDER_CHOICES,required=True)
    nickname=serializers.CharField(required=False)
    genre=serializers.CharField(required=False)

    def get_cleaned_data(self):
        data=super().get_cleaned_data()
        data['gender']=self.validated_data.get('gender')
        data['age']=self.validated_data.get('age')
        data['nickname']=self.validated_data.get('nickname')
        data['genre']=self.validated_data.get('genre')
        return data
    
    def save(self, request):
        user=super().save(request)
        user.gender=self.validated_data.get('gender')
        user.age=self.validated_data.get('age')
        user.nickname=self.validated_data.get('nickname')
        user.genre=self.validated_data.get('genre')
        user.save()
        return user
    
class UserUpdateSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['age', 'gender', 'genre', 'password1', 'password2']

    def validate(self, data):
        pw1 = data.get('password1')
        pw2 = data.get('password2')
        
        # 비밀번호 둘 다 비어있으면 검사 X
        if pw1 is not None and pw2 is not None and (pw1 != "" or pw2 != ""):
            if pw1 != pw2:
                raise serializers.ValidationError("비밀번호가 일치하지 않습니다.")
            if len(pw1) < 8:
                raise serializers.ValidationError("비밀번호는 최소 8자 이상이어야 합니다.")
        return data


    def update(self, instance, validated_data):
        if 'age' in validated_data:
            instance.age = validated_data['age']
        if 'gender' in validated_data:
            instance.gender = validated_data['gender']
        if 'genre' in validated_data:
            instance.genre = validated_data['genre']
        if validated_data.get('password1'):
            instance.set_password(validated_data['password1'])

        instance.save()
        return instance
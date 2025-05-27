from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

class Movie(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField()   
    genre = models.TextField()
    score = models.FloatField()
    poster = models.TextField()
    release_date = models.TextField()
    runtime = models.IntegerField()
    movie_num = models.IntegerField()

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.CharField(max_length=20)
    subtitle = models.CharField(max_length=20)
    content = models.TextField()
    username = models.CharField(max_length=50)
    nickname = models.CharField(max_length=50)
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    followings=models.ManyToManyField('self',symmetrical=False,related_name='followers')
    GENDER_CHOICES = (
        ('MEN', 'MEN'),
        ('WOMEN', 'WOMEN'),
        ('SECRET', 'SECRET'),
    )
    
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    nickname = models.CharField(max_length=30, unique=True, null=True, blank=True)
    genre = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.username
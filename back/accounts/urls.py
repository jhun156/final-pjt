from django.urls import path
from . import views

urlpatterns = [
    path('userinfo/', views.user_info),
    path('userinfo/<int:userid>/', views.other_user_info),
]

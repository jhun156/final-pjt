from django.urls import path
from . import views

urlpatterns = [
    path('', views.movie_list),
    path('<int:movie_pk>/', views.movie_detail),
    path('comments/',views.comment_list),
    path('comments/<int:comment_pk>/', views.comment_delete)
]

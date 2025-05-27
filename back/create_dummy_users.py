import os
import django
import json
from django.contrib.auth.hashers import make_password

# Django 설정 불러오기
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "movieproject.settings")  # 여기를 프로젝트 이름으로 바꾸세요
django.setup()

from accounts.models import User

users = []
num_users = 10
password_plain = "1q2w3e4r!"
hashed_password = make_password(password_plain)

# 팔로잉 관계 (test1은 test2, test3 팔로잉 등)
followings_map = {
    1: [2, 3],
    2: [3, 4],
    3: [4, 5],
    4: [5, 6],
    5: [6, 7],
    6: [7, 8],
    7: [8, 9],
    8: [9, 10],
    9: [10],
    10: []
}

for i in range(1, num_users + 1):
    user = {
        "model": "accounts.user",
        "pk": i,
        "fields": {
            "password": hashed_password,
            "last_login": None,
            "is_superuser": False,
            "username": f"test{i}",
            "first_name": "",
            "last_name": "",
            "email": "",
            "is_staff": False,
            "is_active": True,
            "date_joined": "2025-05-27T00:00:00Z",
            "gender": "SECRET",
            "age": 20 + i,
            "nickname": f"닉네임{i}",
            "genre": "",
            "followings": followings_map.get(i, [])
        }
    }
    users.append(user)

with open("users_with_followings.json", "w", encoding="utf-8") as f:
    json.dump(users, f, ensure_ascii=False, indent=2)

print("users_with_followings.json 파일이 생성되었습니다!")

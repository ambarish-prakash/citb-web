from django.urls import path
from .views import GameView, AllGamesView, GameActionView

urlpatterns = [
    path('game', GameView.as_view(), name='game'),
    path('game/<str:game_id>', GameActionView.as_view(), name='game_action'),
    path('games/all', AllGamesView.as_view(), name='all_games'),
]

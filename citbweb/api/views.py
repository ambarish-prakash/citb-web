from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import GameSerializer
from .game_logic.game import Game
from rl.masked_dqn import MaskedDQN

# Create your views here.

class GameView(APIView):
    def get(self, request, format=None):
        code = request.query_params.get('code', None)
        if code:
            game = request.games.get(code, None)
            if not game:
                return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = GameSerializer(game)
            return Response(serializer.data)
        return Response({'error': 'No code provided'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        #serializer = GameSerializer(data=request.data)
        #if serializer.is_valid():
        game = Game()
        request.games[game.code] = game
        return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllGamesView(APIView):
    def get(self, request, format=None):
        games = request.games.values()  # Retrieve all games from middleware
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)


class GameActionView(APIView):
    def _get_ai_agent(self, request):
        if request.ai_agent:
            return request.ai_agent
        
        import os
        print(os.getcwd())
        
        ai_agent = MaskedDQN.load('model')
        request.ai_agent = ai_agent
        return ai_agent

    def post(self, request, game_id, format=None):
        game = request.games.get(game_id, None)
        if not game:
            return Response({'error': 'Invalid Game Id. No such Game.'}, status=status.HTTP_404_NOT_FOUND)
        if request.data['action'] == 'nextRound':
            game.next_round()
        else:
            game.play_action(int(request.data['action']), request.data['player_number'])
            game._perform_bot_actions(self._get_ai_agent(request))
        return Response(GameSerializer(game).data, status=status.HTTP_200_OK)

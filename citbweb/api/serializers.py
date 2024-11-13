from rest_framework import serializers
from .game_logic.game import Game

class PublicPlayerSerializer(serializers.Serializer):
    nickname = serializers.CharField(max_length=32)
    player_number = serializers.IntegerField()
    valid_colors = serializers.ListField(child=serializers.BooleanField())
    collected_sets = serializers.IntegerField()
    bet = serializers.IntegerField()
    scores = serializers.ListField(child=serializers.IntegerField())
    bonuses = serializers.ListField(child=serializers.IntegerField())
    overall_score = serializers.IntegerField()

class PrivatePlayerSerializer(serializers.Serializer):
    hand = serializers.ListField(child=serializers.IntegerField())
    discarded_card = serializers.IntegerField()
    valid_moves = serializers.ListField(child=serializers.IntegerField())

class BoardSerializer(serializers.Serializer):
    places = serializers.ListField(child=serializers.ListField(child=serializers.IntegerField()))

class GameSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=8, required=False)
    round_number = serializers.IntegerField()
    turn_number = serializers.IntegerField()
    board = BoardSerializer()
    players = serializers.ListField(child=PublicPlayerSerializer())
    private_info = serializers.SerializerMethodField()
    starting_player_idx = serializers.IntegerField()
    played_moves = serializers.ListField(child=serializers.IntegerField())
    red_played = serializers.BooleanField()
    round_over = serializers.BooleanField()
    game_over = serializers.BooleanField()
    logs = serializers.ListField(child=serializers.CharField(max_length=128))
    
    def get_private_info(self, obj):
        return PrivatePlayerSerializer(obj.players[0]).data

    def create(self, validated_data):
        return Game(**validated_data)

    def update(self, instance, validated_data):
        instance.code = validated_data.get('code', instance.code)
        return instance

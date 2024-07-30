from django.db import models
from django.contrib.postgres.fields import ArrayField
import random
import string

# WHAT DO I WANT TO SAVE? I GUESS ONLY GAME STATE SO THAT IT CAN BE REFRESHED.

# def generate_unique_code():    
#     while True:
#         code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
#         if not Game.objects.filter(code=code).exists():
#             break
#     return code

# Create your models here.
# class Game(models.Model):
#     code = models.CharField(max_length=8, unique=True, default=generate_unique_code)
#     round_number = models.IntegerField(default=1)
#     created_at = models.DateTimeField(auto_now_add=True)

# class Round(models.Model):
#     game = models.ForeignKey(Game, on_delete=models.CASCADE)
#     number = models.IntegerField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = (("game", "number"),)

# class Board(models.Model):
#     game = models.ForeignKey(Game, on_delete=models.CASCADE)
#     places = ArrayField(models.IntegerField(default=0), size = 32)

# class Player(models.Model):
#     game = models.ForeignKey(Game, on_delete=models.CASCADE)
#     name = models.CharField(max_length=32)
#     bet = models.IntegerField(default=0)
#     cards_in_hand = ArrayField(models.IntegerField(default=-1), size = 10)
#     discard_card = models.IntegerField(default=-1)
#     played_cards = ArrayField(models.IntegerField(default=-1), size = 8)
#     sets_won = models.IntegerField(default=0)
#     scores = ArrayField(models.IntegerField(default=0), size = 3)
    

import random

class Player:
    # Field called hand - list of ints
    def __init__(self, player_number, nickname='Botsky'):
        self.player_number = player_number
        self.hand = []
        self.discarded_card = -1
        self.played_cards = []
        self.collected_sets = 0
        self.scores = []
        self.bonuses = []
        self.overall_score = 0
        self.valid_moves = []
        self.valid_colors = [True, True, True, True]
        self.bet = 0
        self.nickname = nickname
        self.paradox = False
        self.action_num = 0

    def set_name(self, name):
        self.nickname = name

    def get_score(self):
        return self.score
    
    def get_hand(self):
        return self.hand
    
    def get_played_cards(self):
        return self.played_cards
    
    def get_colors(self):
        return [int(x) for x in self.valid_colors]
    
    def get_sets_won(self):
        return self.collected_sets

    def calc_score(self, bonus):
        bonus_val = 0
        if self.paradox:
            score_val = -1 * self.collected_sets
        else:
            score_val = self.collected_sets
            if self.bet == self.collected_sets:
                bonus_val = bonus

        self.scores.append(score_val)
        self.bonuses.append(bonus_val)
        self.overall_score += score_val + bonus_val

    def set_hand(self, cards):
        # Set the hand
        self.hand = cards

        #Setup valid moves:
        unique_numbers = set(cards)
        for x in unique_numbers:
            for i in [x-1, x-1+8, x-1+16, x-1+24]:
                self.valid_moves.append(i)

    def reset_round(self):
        self.hand = []
        self.discarded_card = -1
        self.valid_moves = []
        self.valid_colors = [True, True, True, True]
        self.played_cards = []
        self.collected_sets = 0
        self.bet = 0
        self.paradox = False
        self.action_num = 0

    def caused_paradox(self):
        self.paradox = True

    def remove_valid_move(self, move):
        if move in self.valid_moves:
            self.valid_moves.remove(move)

    def win_set(self):
        self.collected_sets += 1
    
    def remove_card_from_hand(self, card_number):
        self.hand.remove(card_number)
        self.played_cards += [card_number]

        # If youve played that card, and you dont have a spare, you cant play that number anymore
        if card_number not in self.hand:
            for i in [card_number-1, 8+card_number-1, 16+card_number-1, 24+card_number-1]:
                self.remove_valid_move(i)

    def update_after_play(self, played_move, base_color):
        # remove the card from hand, update valid moves and colors
        card_number = (played_move%8) + 1
        self.remove_card_from_hand(card_number)
        
        # If you played a different color than the base color, you need to remove the token from that color
        if base_color != -1:
            move_color = int(played_move / 8)
            if(move_color != base_color):
                self.valid_colors[base_color] = False
                for i in range(8):
                    self.remove_valid_move(base_color*8+i)

        self.action_num += 1
   
    def discard_card(self, card_number):    
        self.discarded_card = card_number    
        self.remove_card_from_hand(card_number)
        self.action_num = 1

    def set_bet(self, bet):
        self.bet = bet
        self.action_num += 1

    def get_bet(self):
        return self.bet

    # def dis_valid_moves(self):
    #     ll = []
    #     maap = {0: 'R', 1: 'B', 2: 'G', 3: 'Y'}
    #     for x in self.valid_moves:
    #         color = maap[int(x/8)]
    #         num = x%8 + 1
    #         ll.append(f'{color}{num}')
    #     return ll


    # def play_card(self, played_moves, valid_playable_moves, observation=None):
    #     # intersection of self.valid_moves and valid_playable_moves
    #     playable_moves = list(set(self.valid_moves) & set(valid_playable_moves))
    #     if(len(playable_moves) == 0):
    #         return -1
        
    #     base_color = -1
    #     if(len(played_moves) > 0):
    #         base_card = played_moves[0]
    #         base_color = int(base_card / 8)

    #     return self.play_anti_paradox_strat(playable_moves, base_color)
    
    # def play_random_card(self, playable_moves, base_color):
    #     move = random.choice(playable_moves)
    #     self.update_after_play(move, base_color)

    #     return move

    # def play_anti_paradox_strat(self, playable_moves, base_color):
    #     base_color_playable_moves = [x for x in playable_moves if int(x/8) == base_color]
    #     if(len(base_color_playable_moves) > 0):
    #         move = random.choice(base_color_playable_moves)
    #         self.update_after_play(move, base_color)
    #         return move
        
    #     return self.play_random_card(playable_moves, base_color)

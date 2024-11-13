import random
import string
import numpy as np

from .board import Board
from .player import Player

class Game:
    UNPLAYED_CARD = 32
    COLOR_MAP = { 0: 'R', 1: 'B', 2: 'G', 3: 'Y' }

    def __init__(self, code=None):
        if not code: 
            code = self._create_unique_code()
        self.code = code
        self.round_number = 0
        self.players = [Player(0, 'You'),
                        Player(1, 'Botsky-Alpha'),
                        Player(2, 'Botsky-Beta'),
                        Player(3, 'Botsky-Gamma')]
        self.logs = ['++ Game Start ++']
        self.game_over = False
        self._setup_round()

    def _setup_round(self):
        self.board = Board()
        self.starting_player_idx = random.randint(0,3)
        self.current_player_idx = self.starting_player_idx
        self.played_moves = []
        self.turn_number = 0
        self.bets_set = 0
        self.paradox_player = -1
        self.red_played = False
        self.round_over = False
        self._append_to_log('default', {'log': f'Round {self.round_number+1} begins.'})

        for pl in self.players:
            pl.reset_round()

        self._distribute_cards()

    def _create_unique_code(self):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        return code
    
    def _distribute_cards(self):
        cards = [1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8]
        random.shuffle(cards)
        for i,player in enumerate(self.players):
            player.set_hand(cards[i*10:i*10+10])

    def _move_to_readable(self, move):
        return f'{move%8 + 1}{self.COLOR_MAP[int(move/8)]}'

    def _append_to_log(self, log_type, log_dict):
        match log_type:
            case 'default':
                self.logs.append(log_dict['log'])
            case 'discard':
                log = f'{log_dict['player']} discards a card.'
                self.logs.append(log)
            case 'bet':
                log = f'{log_dict['player']} bets {log_dict["bet"]}.'
                self.logs.append(log)
            case 'play':
                move = log_dict['move']
                log = f'{log_dict["player"]} plays {self._move_to_readable(move)}.'
                self.logs.append(log)
            case 'win_set':
                played_moves_readable = ', '.join([self._move_to_readable(m) for m in self.played_moves])
                player_and_move = f'{log_dict["player"]} ({self._move_to_readable(log_dict['move'])})'
                log = f'{player_and_move} wins the set of {played_moves_readable}.'
                self.logs.append(log)
            case 'paradox':
                log = f'{log_dict["player"]} caused a paradox!'
                self.logs.append(log)


    def next_round(self):
        self.round_number += 1
        self._setup_round()

    def play_action(self, action, player_number):
        req_player = self.players[player_number]

        # Assume that action validity has already been by FE
        if action == -1:
                self.players[player_number].caused_paradox()
                self.paradox_player = 0
                self._append_to_log('paradox', {'player': req_player.nickname})
                self._end_round()
        elif action<8:
            req_player.discard_card(action+1)
            self._append_to_log('discard', {'player': req_player.nickname})

        elif action<11:
            self._current_player_set_bet(action-7)

        else:
            move = action-11
            self._current_player_play_card(move)
    
    def _current_player_set_bet(self, bet):
        self.players[self.current_player_idx].set_bet(bet)
        self.bets_set += 1
        if self.bets_set == 4:
            self.turn_number = 2
        self._append_to_log('bet', {'player': self.players[self.current_player_idx].nickname, 
                                    'bet': bet})
        self.current_player_idx = (self.current_player_idx + 1) % 4

    def _perform_bot_actions(self, ai_agent):
        if self.paradox_player != -1 or self.turn_number == 10:
            return

        if self.turn_number == 0:
            for i in range(3):
                obs = self._get_observation(i+1)
                action, _states = ai_agent.predict(obs, deterministic=True)
                self.players[i+1].discard_card(action+1)
                player_name = self.players[i+1].nickname
                self._append_to_log('discard', {'player': player_name})
            self.turn_number = 1
            self._perform_bot_actions(ai_agent)

        elif self.turn_number == 1:
            while self.current_player_idx != 0 and self.bets_set < 4:
                obs = self._get_observation(self.current_player_idx)
                action, _states = ai_agent.predict(obs, deterministic=True)
                self._current_player_set_bet(action-7)
            
            if self.bets_set == 4:
                self._perform_bot_actions(ai_agent)

        else:
            while self.current_player_idx != 0 and len(self.played_moves) < 4:
                paradoxed = self._player_has_no_valid_moves(self.current_player_idx)
                if paradoxed:
                    self.players[self.current_player_idx].caused_paradox()
                    self.paradox_player = self.current_player_idx
                    self._append_to_log('paradox', {'player': self.players[self.current_player_idx].nickname})
                    self._end_round()
                    return
                obs = self._get_observation(self.current_player_idx)
                action, _states = ai_agent.predict(obs, deterministic=True)
                move = action - 11
                self._current_player_play_card(move)

            if len(self.played_moves) == 4:
                self._complete_set()
                self.turn_number += 1
                self._perform_bot_actions(ai_agent)

    def _player_has_no_valid_moves(self, player_idx):
        player = self.players[player_idx]
        valid_board_moves = self.board.get_valid_places(self.starting_player_idx == player_idx)
        playable_moves = list(set(player.valid_moves) & set(valid_board_moves))
        if(len(playable_moves) == 0):
            return True
        
        return False

    def _end_round(self):
        self._calculate_player_scores()
        self.round_over = True
        self.game_over = True
        log = 'Game Over!'
        if self.round_number < 2:
            log = f' Round {self.round_number+1} over!'
            self.game_over = False
        self._append_to_log("default", {'log': log})

    def _complete_set(self):
        winning_card_idx = self._calculate_winner()
        winning_player_idx = (self.starting_player_idx + winning_card_idx ) % 4
        self.players[winning_player_idx].win_set()
        self._append_to_log('win_set', {'player': self.players[winning_player_idx].nickname, 
                                        'move': self.played_moves[winning_card_idx]})
        if self.turn_number == 9:
            # Eight sets have been played, round is over
            self._end_round()
            return
        self.starting_player_idx = winning_player_idx
        self.current_player_idx = self.starting_player_idx
        self.played_moves = []

    def _calculate_winner(self):
        played_moves = self.played_moves
        reds = [x for x in played_moves if x<8]
        if(len(reds) > 0):
            highest_red = max(reds)
            return played_moves.index(highest_red)
        
        # Case 2 - no red - highest suite of base color
        base_color = int(played_moves[0] / 8)
        colors = [x for x in played_moves if int(x/8) == base_color]
        highest_color = max(colors)
        return played_moves.index(highest_color)
    
    def _calculate_player_scores(self):
        for i,player in enumerate(self.players):
            bonus = 0
            if player.bet == player.collected_sets:
                bonus = self.board.get_bonus(i+1)
            player.calc_score(bonus)

    def _get_observation(self, player_idx):
        player = self.players[player_idx]
        player_idx_diff = player_idx
        
        action_num = player.action_num
        obs_space_list = [player.action_num]
        if action_num == 0:
            obs_space_list += [1,0,0] # discard phase
        elif action_num == 1:
            obs_space_list += [0,1,0] # bet phase
        else:
            obs_space_list += [0,0,1] # play phase
        
        # board
        board_places = self.board.get_places()
        board_places_flattened = [item for sublist in board_places for item in sublist]
        board_places_flattened = [((x-1-player_idx_diff)%4)+1 if x !=0 else 0 for x in board_places_flattened]
        obs_space_list += board_places_flattened

        # hand cards
        cards_in_hand = player.get_hand()
        for i in range(1,9):
            obs_space_list.append(cards_in_hand.count(i))
        
        # played / discarded cards
        played_cards = player.get_played_cards()
        for i in range(1,9):
            obs_space_list.append(played_cards.count(i))
        
        # colors, bets and sets won (player stats)
        player_colors = []
        player_bets = []
        player_collected_sets = []
        for i in range(len(self.players)):
            ith_player = self.players[(i+player_idx_diff)%4]
            player_colors += ith_player.get_colors()
            player_bets += [ith_player.get_bet()]
            player_collected_sets += [ith_player.get_sets_won()]

        obs_space_list += player_colors
        obs_space_list += player_bets
        obs_space_list += player_collected_sets

        # Current set played cards
        current_played_moves = self.played_moves.copy()
        current_played_moves.extend([self.UNPLAYED_CARD] * (4-len(self.played_moves)))
        obs_space_list += current_played_moves

        # Starting Player
        obs_space_list += [(self.starting_player_idx-player_idx_diff)%4]

        return np.array(obs_space_list)
   
    def _get_base_color(self):
        if len(self.played_moves) == 0:
            return -1
        return int(self.played_moves[0] / 8)

    def _current_player_play_card(self, move):
        player = self.players[self.current_player_idx]
        player.update_after_play(move, self._get_base_color())
        self._play_move(move)
        self.current_player_idx = (self.current_player_idx + 1) % 4
    
    def _play_move(self, move):
        # Place the piece on the board
        self.board.place_piece(move, self.current_player_idx+1)

        # Remove it from the valid moves in the board as well as all players
        for player in self.players:
            player.remove_valid_move(move)

        # Add it to the list of played moves
        self.played_moves.append(move)
        player_name = self.players[self.current_player_idx].nickname
        self._append_to_log('play', {'player': player_name, 'move': move})

        if move < 8:
            self.red_played = True

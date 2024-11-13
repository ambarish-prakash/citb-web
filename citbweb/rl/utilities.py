import torch

def get_invalid_actions(observations: torch.Tensor, device='cpu') -> torch.Tensor:
    N = observations.shape[0]
    invalid_actions = torch.zeros((N, 43), dtype=torch.bool).to(device)
    INVALID_VAL = True

    # Invalidate (set to high negative) q values for action if board space used up
    mask_board_space_used = observations[:, 4:36] != 0
    invalid_actions[:, 11:43] = (mask_board_space_used).to(device)

    # Where no card number to play Invalidate q values for discard and play_card action
    mask_no_card_number = (observations[:, 36:44] == 0).to(device)
    invalid_actions[:, :8] = torch.where(mask_no_card_number, INVALID_VAL, invalid_actions[:, :8])
    for offset in [0, 8, 16, 24]:
        invalid_actions[:, 11 + offset:19 + offset] = torch.where(mask_no_card_number, INVALID_VAL, invalid_actions[:, 11 + offset:19 + offset])

    # Invalidate q values for action where the color is not available
    mask_color_not_available = (observations[:, 52:56] == 0).to(device)
    # Repeat fill_tensor to match the required shape
    fill_tensor = torch.full((N, 32), INVALID_VAL).to(device)
    mask_repeated = mask_color_not_available.repeat_interleave(8, dim=1).to(device)
    invalid_actions[:, 11:43] = torch.where(mask_repeated, fill_tensor, invalid_actions[:, 11:43])

    # Invalidate q values for action if starting with red when you cannot
    mask1 = (observations[:, 80] == 0).to(device)
    mask2 = torch.all(observations[:, 4:12] == 0, dim=1).to(device)
    final_mask = torch.logical_and(mask1, mask2).unsqueeze(1).to(device)
    fill_tensor = torch.full((invalid_actions.shape[0], 8), INVALID_VAL).to(device)
    invalid_actions[:, 11:19] = torch.where(final_mask, fill_tensor, invalid_actions[:, 11:19])

    # Invalidate q values for actions based on game phase
    # Discard phase
    mask = (observations[:, 1] == 1).to(device)
    fill_tensor = torch.full((invalid_actions.shape[0], 43 - 8), INVALID_VAL).to(device)
    invalid_actions[:, 8:43] = torch.where(mask[:, None], fill_tensor, invalid_actions[:, 8:43])

    # Bet phase
    mask = (observations[:, 2] == 1).to(device)
    fill_tensor = torch.full((invalid_actions.shape[0], 8), INVALID_VAL).to(device)
    invalid_actions[:, 0:8] = torch.where(mask[:, None], fill_tensor, invalid_actions[:, 0:8]).to(device)
    fill_tensor = torch.full((invalid_actions.shape[0], 43 - 11), INVALID_VAL).to(device)
    invalid_actions[:, 11:43] = torch.where(mask[:, None], fill_tensor, invalid_actions[:, 11:43])

    # Play phase
    mask = (observations[:, 3] == 1).to(device)
    fill_tensor = torch.full((invalid_actions.shape[0], 11), INVALID_VAL).to(device)
    invalid_actions[:, 0:11] = torch.where(mask[:, None], fill_tensor, invalid_actions[:, 0:11])

    return invalid_actions

// Exportador de handlers de modales

import { handleTournamentRegisterModal } from './teamRegister.js';
import { handleModalCreateTournament } from './createTournament.js';
import { handleModalSubmitResult } from './submitResult.js';
import { handleSubmitResultWithImageModal } from './submitResultWithImage.js';
import { handleSendLobbyCode } from './sendLobbyCode.js';

export const modalHandlers = {
  'tournament_register_modal': handleTournamentRegisterModal,
  'modal_create_tournament': handleModalCreateTournament,
  'modal_submit_result': handleModalSubmitResult,
  'modal_send_lobby_code': handleSendLobbyCode,
  // Dynamic handlers
  _dynamic: {
    submit_result_with_image: handleSubmitResultWithImageModal
  }
};
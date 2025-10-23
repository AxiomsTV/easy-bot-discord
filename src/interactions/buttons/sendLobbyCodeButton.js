// Handler para enviar código de lobby a todos los equipos

import { 
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from 'discord.js';

export async function handlePanelSendLobbyCode(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('modal_send_lobby_code')
    .setTitle('Enviar Codigo de Lobby');

  const matchNumberInput = new TextInputBuilder()
    .setCustomId('match_number')
    .setLabel('Numero de Match')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: 1, 2, 3...')
    .setMinLength(1)
    .setMaxLength(3)
    .setRequired(true);

  const lobbyCodeInput = new TextInputBuilder()
    .setCustomId('lobby_code')
    .setLabel('Codigo de Lobby')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: ABCD1234')
    .setMinLength(3)
    .setMaxLength(20)
    .setRequired(true);

  const row1 = new ActionRowBuilder().addComponents(matchNumberInput);
  const row2 = new ActionRowBuilder().addComponents(lobbyCodeInput);

  modal.addComponents(row1, row2);

  await interaction.showModal(modal);
}

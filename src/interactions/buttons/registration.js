// Handler para el botón de registro de equipos

import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { tournamentManager } from '../../services/tournament/manager.js';
import { ERROR_MESSAGES, LIMITS } from '../../utils/constants.js';

export async function handleTournamentRegisterButton(interaction) {
  try {
    if (!tournamentManager.hasActiveTournament()) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_ACTIVE_TOURNAMENT,
        ephemeral: true
      });
    }

    const tournament = tournamentManager.getActiveTournament();

    if (!tournament.isRegistrationOpen()) {
      return await interaction.reply({
        content: ERROR_MESSAGES.REGISTRATION_CLOSED,
        ephemeral: true
      });
    }

    const teamCount = tournamentManager.getTeamCount();
    if (!tournament.canRegisterMoreTeams(teamCount)) {
      return await interaction.reply({
        content: ERROR_MESSAGES.TOURNAMENT_FULL,
        ephemeral: true
      });
    }

    // Verificar si el usuario ya está registrado
    if (tournamentManager.isUserRegistered(interaction.user.id)) {
      const userTeam = tournamentManager.findTeamByMember(interaction.user.id);
      return await interaction.reply({
        content: `❌ Ya estás registrado en el equipo **${userTeam.name}**.`,
        ephemeral: true
      });
    }

    // Crear modal de registro
    const modal = new ModalBuilder()
      .setCustomId('tournament_register_modal')
      .setTitle('📝 Registrar Equipo');

    const teamNameInput = new TextInputBuilder()
      .setCustomId('team_name')
      .setLabel('Nombre del Equipo')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(LIMITS.MIN_TEAM_NAME)
      .setMaxLength(LIMITS.MAX_TEAM_NAME)
      .setPlaceholder('Ej: Los Invencibles');

    const teamTagInput = new TextInputBuilder()
      .setCustomId('team_tag')
      .setLabel('Tag del Equipo (Opcional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMinLength(LIMITS.MIN_TEAM_TAG)
      .setMaxLength(LIMITS.MAX_TEAM_TAG)
      .setPlaceholder('Ej: INV');

    const membersInput = new TextInputBuilder()
      .setCustomId('team_members')
      .setLabel(`Menciona los Miembros (${tournament.teamSize} jugadores total)`)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder(`Menciona a tus compañeros: @Usuario1 @Usuario2\nEscribe @ y selecciónalos de la lista`);

    const rows = [
      new ActionRowBuilder().addComponents(teamNameInput),
      new ActionRowBuilder().addComponents(teamTagInput),
      new ActionRowBuilder().addComponents(membersInput)
    ];

    modal.addComponents(...rows);
    await interaction.showModal(modal);

  } catch (error) {
    console.error('Error en tournament register button:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al abrir el formulario de registro';
      
    await interaction.reply({ content: errorMessage, ephemeral: true });
  }
}
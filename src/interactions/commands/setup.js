// Handler para el comando /tournament-setup

import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { tournamentManager } from '../../services/tournament/manager.js';
import { ChannelService } from '../../services/discord/channels.js';
import { RoleService } from '../../services/discord/roles.js';
import { PermissionService } from '../../services/discord/permissions.js';
import { EmbedBuilder } from '../../utils/embeds.js';
import { ERROR_MESSAGES, TOURNAMENT_COLORS } from '../../utils/constants.js';

export async function handleTournamentSetup(interaction) {
  try {
    // Verificar permisos
    if (!PermissionService.hasAdminPermissions(interaction.member)) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_PERMISSIONS,
        ephemeral: true
      });
    }

    // Verificar si ya hay un torneo activo
    if (tournamentManager.hasActiveTournament()) {
      return await interaction.reply({
        content: ERROR_MESSAGES.TOURNAMENT_EXISTS,
        ephemeral: true
      });
    }

    const tournamentName = interaction.options.getString('name');
    const maxTeams = interaction.options.getInteger('max-teams');
    const teamSize = interaction.options.getInteger('team-size');
    const format = interaction.options.getString('format');
    const game = interaction.options.getString('game') || 'warzone';

    await interaction.deferReply();

    // Crear estructura de Discord
    const categoryId = await ChannelService.createTournamentCategory(
      interaction.guild, 
      tournamentName
    );

    const channels = await ChannelService.createTournamentChannels(
      interaction.guild,
      categoryId
    );

    const participantRole = await RoleService.createParticipantRole(
      interaction.guild,
      tournamentName
    );

    // Crear torneo en el manager
    const tournament = tournamentManager.createTournament({
      name: tournamentName,
      maxTeams,
      teamSize,
      format,
      game,
      createdBy: interaction.user.id,
      categoryId,
      channels,
      roles: { participant: participantRole.id }
    });

    // Enviar confirmación
    const embed = EmbedBuilder.createTournamentSetupSuccess(tournament);
    await interaction.editReply({ embeds: [embed] });

    // Enviar panel de registro
    await ChannelService.sendRegistrationPanel(
      interaction.guild.channels.cache.get(channels.registration)
    );

    // Anuncio público
    await ChannelService.sendTournamentAnnouncement(
      interaction.guild.channels.cache.get(channels.announcements),
      tournament
    );

  } catch (error) {
    console.error('Error en tournament setup:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al configurar el torneo';
      
    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}
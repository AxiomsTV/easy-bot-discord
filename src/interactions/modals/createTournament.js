// Handler para el modal de creación de torneo

import { tournamentManager } from '../../services/tournament/manager.js';
import { ChannelService } from '../../services/discord/channels.js';
import { RoleService } from '../../services/discord/roles.js';
import { EmbedBuilder } from '../../utils/embeds.js';
import { LIMITS } from '../../utils/constants.js';

export async function handleModalCreateTournament(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    // Obtener valores del modal
    const tournamentName = interaction.fields.getTextInputValue('tournament_name');
    const maxTeams = parseInt(interaction.fields.getTextInputValue('max_teams'));
    const teamSize = parseInt(interaction.fields.getTextInputValue('team_size'));
    const format = interaction.fields.getTextInputValue('tournament_format');
    const description = interaction.fields.getTextInputValue('tournament_description') || '';

    // Validar datos
    if (isNaN(maxTeams) || maxTeams < LIMITS.MIN_TEAMS || maxTeams > LIMITS.MAX_TEAMS) {
      return await interaction.editReply({
        content: `❌ El número de equipos debe ser entre ${LIMITS.MIN_TEAMS} y ${LIMITS.MAX_TEAMS}`
      });
    }

    if (isNaN(teamSize) || teamSize < LIMITS.MIN_TEAM_SIZE || teamSize > LIMITS.MAX_TEAM_SIZE) {
      return await interaction.editReply({
        content: `❌ El tamaño de equipo debe ser entre ${LIMITS.MIN_TEAM_SIZE} y ${LIMITS.MAX_TEAM_SIZE}`
      });
    }

    const participantRole = await RoleService.createParticipantRole(
      interaction.guild,
      tournamentName
    );

    const channels = await ChannelService.createTournamentChannels(
      interaction.guild,
      null,
      participantRole.id
    );

    // Crear torneo (guardar ambos IDs de categorías)
    const tournament = tournamentManager.createTournament({
      name: tournamentName,
      maxTeams,
      teamSize,
      format,
      game: 'warzone',
      createdBy: interaction.user.id,
      categoryId: channels.category2, // Categoría de registro como principal
      category1: channels.category1, // Categoría de control
      category2: channels.category2, // Categoría de registro
      channels,
      roles: { participant: participantRole.id },
      description
    });

    // Enviar confirmación
    const embed = EmbedBuilder.createTournamentSetupSuccess(tournament);
    await interaction.editReply({ 
      content: `✅ **¡Torneo creado exitosamente!**\n\n` +
        `📊 Actualizando panel de administración...`,
      embeds: [embed] 
    });

    // Actualizar panel automáticamente
    try {
      const { updatePanelAutomatically } = await import('../commands/panel.js');
      const updated = await updatePanelAutomatically(interaction.guild);
      
      if (updated) {
        await interaction.editReply({ 
          content: `✅ **¡Torneo creado exitosamente!**\n\n` +
            `✅ Panel de administración actualizado. Los botones están ahora habilitados.`,
          embeds: [embed] 
        });
      } else {
        await interaction.editReply({ 
          content: `✅ **¡Torneo creado exitosamente!**\n\n` +
            `⚠️ No se encontró el panel para actualizar. Usa /panel para crear uno nuevo.`,
          embeds: [embed] 
        });
      }
    } catch (error) {
      console.error('Error actualizando panel:', error);
    }

    // Enviar panel de registro con valores iniciales (0 equipos de maxTeams)
    await ChannelService.sendRegistrationPanel(
      interaction.guild.channels.cache.get(channels.registration),
      0,
      maxTeams
    );

    // Anuncio público
    await ChannelService.sendTournamentAnnouncement(
      interaction.guild.channels.cache.get(channels.announcements),
      tournament
    );

  } catch (error) {
    console.error('Error al crear torneo desde modal:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al crear el torneo. Inténtalo de nuevo.';
      
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}

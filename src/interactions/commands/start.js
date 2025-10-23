// Handler para el comando /tournament-start

import { tournamentManager } from '../../services/tournament/manager.js';
import { PermissionService } from '../../services/discord/permissions.js';
import { EmbedBuilder as DiscordEmbed } from 'discord.js';
import { ERROR_MESSAGES, TOURNAMENT_COLORS } from '../../utils/constants.js';

export async function handleTournamentStart(interaction) {
  try {
    // Verificar permisos
    if (!PermissionService.hasAdminPermissions(interaction.member)) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_PERMISSIONS,
        ephemeral: true
      });
    }

    if (!tournamentManager.hasActiveTournament()) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_ACTIVE_TOURNAMENT,
        ephemeral: true
      });
    }

    const tournament = tournamentManager.getActiveTournament();
    
    // Verificar si ya está iniciado
    if (tournament.status === 'active') {
      return await interaction.reply({
        content: '❌ El torneo ya está iniciado.',
        ephemeral: true
      });
    }

    // Verificar que haya al menos 2 equipos registrados
    const teamCount = tournamentManager.getTeamCount();
    if (teamCount < 2) {
      return await interaction.reply({
        content: `❌ Necesitas al menos 2 equipos registrados para iniciar el torneo. Actualmente hay ${teamCount} equipo(s).`,
        ephemeral: true
      });
    }

    await interaction.deferReply();

    // Cambiar estado del torneo a "active"
    tournament.status = 'active';
    tournament.startedAt = new Date().toISOString();

    // Crear embed de anuncio
    const embed = new DiscordEmbed()
      .setTitle('🎮 ¡TORNEO INICIADO!')
      .setDescription(`**${tournament.name}** ha comenzado oficialmente.`)
      .setColor(TOURNAMENT_COLORS.success)
      .addFields(
        { name: '📊 Equipos Registrados', value: `${teamCount}/${tournament.maxTeams}`, inline: true },
        { name: '👥 Formato', value: tournament.format, inline: true },
        { name: '🎯 Juego', value: 'Call of Duty: Warzone', inline: true },
        { name: '📋 Estado', value: '✅ Registros Cerrados - Torneo Activo', inline: false }
      )
      .addFields({
        name: '📝 Instrucciones',
        value: '• Los equipos deben jugar sus partidas\n' +
               '• Después de cada partida, envíen sus resultados\n' +
               '• Formato: Posición + Kills totales del equipo\n' +
               '• El sistema calculará automáticamente los puntos',
        inline: false
      })
      .setFooter({ text: 'Sistema de Puntuación: Kills × Multiplicador (1°=x1.6, 2°-5°=x1.4, 6°-10°=x1.2, 11°-15°=x1.0)' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Anuncio público en el canal de anuncios
    const announcementChannel = interaction.guild.channels.cache.get(tournament.channels.announcements);
    if (announcementChannel) {
      await announcementChannel.send({ 
        content: '@everyone',
        embeds: [embed] 
      });
    }

    // Actualizar panel automáticamente
    const { updatePanelAutomatically } = await import('./panel.js');
    await updatePanelAutomatically(interaction.guild);

  } catch (error) {
    console.error('Error en tournament start:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al iniciar el torneo';
      
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}
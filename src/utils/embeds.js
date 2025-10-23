// Utilidades para crear embeds reutilizables

import { EmbedBuilder as DiscordEmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { 
  TOURNAMENT_COLORS, 
  STATUS_EMOJIS, 
  FORMAT_EMOJIS, 
  GAME_EMOJIS 
} from './constants.js';

export class EmbedBuilder {
  // Embed de configuración exitosa del torneo
  static createTournamentSetupSuccess(tournament) {
    return new DiscordEmbedBuilder()
      .setTitle('🏆 ¡Torneo Configurado Exitosamente!')
      .setDescription(`**${tournament.name}** está listo para recibir registros.`)
      .addFields(
        { name: '👥 Equipos Máximos', value: `${tournament.maxTeams}`, inline: true },
        { name: '🎮 Jugadores por Equipo', value: `${tournament.teamSize}`, inline: true },
        { name: '🏁 Formato', value: tournament.format, inline: true },
        { name: '🎯 Juego', value: tournament.game.toUpperCase(), inline: true },
        { name: '📍 Estado', value: '🟢 Abierto para Registros', inline: true }
      )
      .setColor(TOURNAMENT_COLORS.success)
      .setTimestamp()
      .setFooter({ text: 'Los jugadores pueden registrarse en el canal de registro' });
  }

  // Embed del panel de registro
  static createRegistrationPanel(teamCount = 0, maxTeams = 0) {
    return new DiscordEmbedBuilder()
      .setTitle('📝 Registro de Equipos')
      .setDescription('¡Registra tu equipo para participar en el torneo!')
      .addFields(
        { name: '📊 Equipos Registrados', value: `${teamCount}/${maxTeams}`, inline: true },
        { name: '🎮 Estado', value: teamCount >= maxTeams ? '🔴 Completo' : '🟢 Abierto', inline: true }
      )
      .setColor(TOURNAMENT_COLORS.info)
      .setTimestamp();
  }

  // Embed actualizado del panel de registro
  static createUpdatedRegistrationPanel(teamCount, maxTeams) {
    return this.createRegistrationPanel(teamCount, maxTeams);
  }

  // Componentes del panel de registro
  static createRegistrationComponents(isFull = false) {
    const registerButton = new ButtonBuilder()
      .setCustomId('tournament_register_btn')
      .setLabel('🎮 Registrar Equipo')
      .setStyle(isFull ? ButtonStyle.Danger : ButtonStyle.Primary)
      .setDisabled(isFull);

    const dashboardButton = new ButtonBuilder()
      .setCustomId('tournament_dashboard_btn')
      .setLabel('📊 Ver Dashboard')
      .setStyle(ButtonStyle.Secondary);

    return [new ActionRowBuilder().addComponents(registerButton, dashboardButton)];
  }

  // Embed de anuncio del torneo
  static createTournamentAnnouncement(tournament) {
    return new DiscordEmbedBuilder()
      .setTitle(`🚨 ¡Nuevo Torneo: ${tournament.name}!`)
      .setDescription('¡El registro está abierto! Únete con tu equipo.')
      .addFields(
        { 
          name: '📊 Información', 
          value: `**Equipos:** ${tournament.maxTeams}\n**Formato:** ${tournament.format}\n**Jugadores:** ${tournament.teamSize}`, 
          inline: true 
        },
        { 
          name: '📝 Cómo Registrarse', 
          value: 'Ve al canal de registro y usa el botón de registro', 
          inline: true 
        }
      )
      .setColor(TOURNAMENT_COLORS.primary)
      .setTimestamp();
  }

  // Embed de bienvenida al equipo
  static createTeamWelcome(team) {
    return new DiscordEmbedBuilder()
      .setTitle(`🎮 Bienvenidos al canal de ${team.name}!`)
      .setDescription('Este es vuestro canal privado de equipo para coordinar estrategias.')
      .addFields(
        { name: '👤 Capitán', value: team.captain.displayName, inline: true },
        { name: '👥 Miembros', value: team.getMemberList(), inline: true }
      )
      .setColor(TOURNAMENT_COLORS.info)
      .setTimestamp();
  }

  // Embed de confirmación de registro exitoso
  static createTeamRegistrationSuccess(team, teamCount, maxTeams) {
    const teamDisplayName = team.tag ? `[${team.tag}] ${team.name}` : team.name;
    const membersList = team.members.map(m => m.displayName || m.username).join(', ');
    
    return new DiscordEmbedBuilder()
      .setTitle('✅ ¡Equipo Registrado Exitosamente!')
      .setDescription(`**${teamDisplayName}** se ha registrado en el torneo.`)
      .addFields(
        { name: '👤 Capitán', value: team.captain.displayName || team.captain.username, inline: true },
        { name: '👥 Miembros', value: membersList || 'Sin miembros adicionales', inline: true },
        { name: '📊 Estado', value: `${teamCount}/${maxTeams} equipos`, inline: true }
      )
      .setColor(TOURNAMENT_COLORS.success)
      .setTimestamp();
  }

  // Embed del dashboard del torneo
  static createTournamentDashboard(tournament, teams) {
    const embed = new DiscordEmbedBuilder()
      .setTitle(`🏆 Dashboard: ${tournament.name}`)
      .setDescription('Estado actual del torneo competitivo')
      .addFields(
        { 
          name: '📊 Información General', 
          value: `**Estado:** ${STATUS_EMOJIS[tournament.status]} ${tournament.status}\n**Formato:** ${FORMAT_EMOJIS[tournament.format]} ${tournament.format}\n**Juego:** ${GAME_EMOJIS[tournament.game]} ${tournament.game.toUpperCase()}`,
          inline: true 
        },
        { 
          name: '👥 Equipos', 
          value: `**Registrados:** ${teams.length}/${tournament.maxTeams}\n**Jugadores por equipo:** ${tournament.teamSize}\n**Total jugadores:** ${teams.length * tournament.teamSize}`,
          inline: true 
        },
        { 
          name: '⏰ Tiempo', 
          value: `**Creado:** <t:${Math.floor(tournament.createdAt.getTime() / 1000)}:R>\n**Por:** <@${tournament.createdBy}>`,
          inline: true 
        }
      )
      .setColor(TOURNAMENT_COLORS.info)
      .setTimestamp();

    // Agregar lista de equipos si hay equipos registrados
    if (teams.length > 0) {
      const teamsList = teams.map((team, index) => 
        `${index + 1}. **${team.getDisplayName()}**\n   👤 ${team.captain.displayName} (${team.members.length + 1} jugadores)`
      ).join('\n');

      embed.addFields({
        name: `🎮 Equipos Registrados (${teams.length})`,
        value: teamsList.length > 1024 ? teamsList.substring(0, 1021) + '...' : teamsList,
        inline: false
      });
    }

    return embed;
  }

  // Embed de torneo eliminado
  static createTournamentDeleted(tournamentName) {
    return new DiscordEmbedBuilder()
      .setTitle('🗑️ Torneo Eliminado')
      .setDescription(`**${tournamentName}** ha sido completamente eliminado.`)
      .addFields(
        { name: '✅ Eliminado', value: 'Categoría, canales, roles y datos', inline: true },
        { name: '🔄 Estado', value: 'Sistema listo para nuevo torneo', inline: true }
      )
      .setColor(TOURNAMENT_COLORS.danger)
      .setTimestamp();
  }

  // Embed de anuncio de nuevo equipo registrado
  static createTeamRegistrationAnnouncement(team, teamCount, maxTeams) {
    return new DiscordEmbedBuilder()
      .setTitle('🎉 ¡Nuevo Equipo Registrado!')
      .setDescription(`**${team.getDisplayName()}** se ha unido al torneo.`)
      .addFields(
        { name: '👤 Capitán', value: team.captain.displayName, inline: true },
        { name: '📊 Progreso', value: `${teamCount}/${maxTeams} equipos`, inline: true }
      )
      .setColor(TOURNAMENT_COLORS.primary)
      .setTimestamp();
  }

  // Embed de error genérico
  static createError(message) {
    return new DiscordEmbedBuilder()
      .setTitle('❌ Error')
      .setDescription(message)
      .setColor(TOURNAMENT_COLORS.danger)
      .setTimestamp();
  }

  // Embed de función en desarrollo
  static createComingSoon(feature) {
    return new DiscordEmbedBuilder()
      .setTitle('🚧 Función en Desarrollo')
      .setDescription(`**${feature}** estará disponible próximamente.`)
      .setColor(TOURNAMENT_COLORS.warning)
      .setTimestamp();
  }
}
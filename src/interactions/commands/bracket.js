// Handler para mostrar tabla de posiciones y brackets

import { tournamentManager } from '../../services/tournament/manager.js';
import { EmbedBuilder as DiscordEmbed } from 'discord.js';
import { TOURNAMENT_COLORS } from '../../utils/constants.js';

export async function handleTournamentBracket(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    const tournament = tournamentManager.getActiveTournament();
    if (!tournament) {
      return await interaction.editReply({ content: '❌ No hay torneo activo' });
    }

    // Obtener canal de brackets
    const bracketsChannelId = tournament.channels.brackets;
    if (!bracketsChannelId) {
      return await interaction.editReply({ 
        content: '❌ No se encontró el canal de brackets' 
      });
    }

    const bracketsChannel = interaction.guild.channels.cache.get(bracketsChannelId);
    if (!bracketsChannel) {
      return await interaction.editReply({ 
        content: '❌ No se pudo encontrar el canal de brackets' 
      });
    }

    // Generar tabla de posiciones
    await updateBracketsTable(bracketsChannel, tournament);

    await interaction.editReply({ 
      content: `✅ Tabla de posiciones actualizada en <#${bracketsChannelId}>` 
    });

  } catch (error) {
    console.error('Error en tournament bracket:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al actualizar los brackets';
      
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}

/**
 * Actualizar canal de brackets con tabla de posiciones
 * Esta función es exportada para poder ser llamada desde otros módulos
 */
export async function updateBracketsTable(channel, tournament) {
  try {
    // Obtener equipos del tournament manager
    const teams = tournamentManager.getRegisteredTeams();
    
    // Obtener submissions del data storage
    const tournamentData = tournamentManager.getData();
    const submissions = tournamentData.submissions || [];
    
    // Calcular puntuaciones por equipo
    const teamScores = {};
    
    for (const team of teams) {
      teamScores[team.name] = {
        totalScore: 0,
        totalKills: 0,
        gamesPlayed: 0,
        bestPosition: 15,
        results: []
      };
    }

    // Procesar todos los resultados enviados
    if (submissions && submissions.length > 0) {
      for (const submission of submissions) {
        const teamName = submission.teamName;
        if (teamScores[teamName]) {
          teamScores[teamName].totalScore += submission.finalScore || 0;
          teamScores[teamName].totalKills += submission.kills || 0;
          teamScores[teamName].gamesPlayed += 1;
          
          if (submission.position < teamScores[teamName].bestPosition) {
            teamScores[teamName].bestPosition = submission.position;
          }
          
          teamScores[teamName].results.push({
            position: submission.position,
            kills: submission.kills,
            score: submission.finalScore
          });
        }
      }
    }

    // Ordenar equipos por puntuación total
    const sortedTeams = Object.entries(teamScores)
      .sort(([, a], [, b]) => b.totalScore - a.totalScore);

    // Crear embed de tabla de posiciones
    let leaderboardText = '';
    
    for (let i = 0; i < sortedTeams.length; i++) {
      const [teamName, stats] = sortedTeams[i];
      const position = i + 1;
      
      let medal = '';
      if (position === 1) medal = '🥇';
      else if (position === 2) medal = '🥈';
      else if (position === 3) medal = '🥉';
      else medal = `${position}º`;

      const avgKills = stats.gamesPlayed > 0 
        ? (stats.totalKills / stats.gamesPlayed).toFixed(1) 
        : '0.0';

      leaderboardText += `${medal} **${teamName}**\n`;
      leaderboardText += `   📊 Puntos: **${stats.totalScore.toFixed(1)}** | `;
      leaderboardText += `💀 Kills: **${stats.totalKills}** (avg: ${avgKills}) | `;
      leaderboardText += `🎮 Partidas: **${stats.gamesPlayed}**\n`;
      
      if (stats.gamesPlayed > 0) {
        leaderboardText += `   🏆 Mejor posición: **#${stats.bestPosition}**\n`;
      }
      
      leaderboardText += '\n';
    }

    if (leaderboardText === '') {
      leaderboardText = '⏳ Aún no hay resultados registrados.\n\nLos equipos deben enviar sus resultados usando el sistema de imágenes o el botón "Enviar Resultado" en el panel.';
    }

    const embed = new DiscordEmbed()
      .setTitle(`🏆 Tabla de Posiciones - ${tournament.name}`)
      .setDescription(leaderboardText)
      .setColor(TOURNAMENT_COLORS.primary)
      .addFields({
        name: '📋 Información',
        value: `**Equipos registrados:** ${teams.length}\n` +
               `**Resultados enviados:** ${submissions.length}\n` +
               `**Estado:** ${tournament.status === 'active' ? '🟢 En curso' : '⚪ Pendiente'}`
      })
      .setFooter({ 
        text: 'Sistema de Puntuación: Kills × Multiplicador (1°=x1.6, 2°-5°=x1.4, 6°-10°=x1.2, 11°-15°=x1.0)' 
      })
      .setTimestamp();

    // Buscar mensaje anterior y actualizarlo, o crear uno nuevo
    const messages = await channel.messages.fetch({ limit: 10 });
    const existingMessage = messages.find(msg => 
      msg.author.bot && 
      msg.embeds.length > 0 && 
      msg.embeds[0].title?.includes('Tabla de Posiciones')
    );

    if (existingMessage) {
      await existingMessage.edit({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }

  } catch (error) {
    console.error('Error actualizando brackets:', error);
    throw error;
  }
}

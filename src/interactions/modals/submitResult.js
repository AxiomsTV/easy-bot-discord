// Handler para el modal de enviar resultado

import { tournamentManager } from '../../services/tournament/manager.js';
import { EmbedBuilder as DiscordEmbed } from 'discord.js';
import { TOURNAMENT_COLORS } from '../../utils/constants.js';
import { ScoringService } from '../../services/tournament/scoring.js';

export async function handleModalSubmitResult(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    // Obtener valores del modal
    const teamName = interaction.fields.getTextInputValue('result_team_name');
    const position = parseInt(interaction.fields.getTextInputValue('result_position'));
    const totalKills = parseInt(interaction.fields.getTextInputValue('result_kills'));

    // Validar datos
    if (isNaN(position) || !ScoringService.isValidPosition(position)) {
      return await interaction.editReply({
        content: '❌ La posición debe ser un número entre 1 y 15'
      });
    }

    if (isNaN(totalKills) || !ScoringService.isValidKills(totalKills)) {
      return await interaction.editReply({
        content: '❌ Los kills deben ser un número entre 0 y 999'
      });
    }

    // Enviar resultado
    const result = await tournamentManager.submitResult({
      teamName,
      position,
      totalKills,
      submittedBy: interaction.user.tag,
      userId: interaction.user.id
    });

    // Calcular puntuación para mostrar
    const scoreData = ScoringService.calculateTeamScore(totalKills, position);

    // Crear embed de confirmación
    const embed = new DiscordEmbed()
      .setTitle('✅ Resultado Guardado')
      .setDescription(`**Equipo:** ${teamName}`)
      .setColor(TOURNAMENT_COLORS.success)
      .addFields(
        { 
          name: '📍 Posición', 
          value: `${position}° lugar ${scoreData.positionInfo.emoji}`, 
          inline: true 
        },
        { 
          name: '💀 Total Kills', 
          value: `${totalKills} kills`, 
          inline: true 
        },
        { 
          name: '✨ Multiplicador', 
          value: `x${scoreData.multiplier}`, 
          inline: true 
        },
        { 
          name: '🏆 Puntuación Final', 
          value: `**${scoreData.finalScore} puntos**\n\n📊 Cálculo: ${totalKills} × ${scoreData.multiplier} = ${scoreData.finalScore}`, 
          inline: false 
        }
      )
      .setFooter({ text: `Registrado por ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Opcional: Enviar anuncio al canal de anuncios
    if (tournamentManager.hasActiveTournament()) {
      const tournament = tournamentManager.getTournamentInfo();
      const announcementChannel = interaction.guild.channels.cache.get(tournament.channels.announcements);
      
      if (announcementChannel) {
        const publicEmbed = new DiscordEmbed()
          .setTitle('🎯 Nuevo Resultado Registrado')
          .setDescription(`**${teamName}** ha completado su partida`)
          .setColor(TOURNAMENT_COLORS.info)
          .addFields(
            { name: '📍 Posición', value: `${position}°`, inline: true },
            { name: '💀 Kills', value: `${totalKills}`, inline: true },
            { name: '🏆 Puntos', value: `**${scoreData.finalScore}**`, inline: true }
          )
          .setTimestamp();
        
        await announcementChannel.send({ embeds: [publicEmbed] });
      }
    }

  } catch (error) {
    console.error('Error al enviar resultado desde modal:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al guardar el resultado. Verifica que el equipo esté registrado.';
      
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}

// Handler para el comando /tournament-dashboard

import { tournamentManager } from '../../services/tournament/manager.js';
import { EmbedBuilder } from '../../utils/embeds.js';
import { ERROR_MESSAGES } from '../../utils/constants.js';

export async function handleTournamentDashboard(interaction) {
  try {
    if (!tournamentManager.hasActiveTournament()) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_ACTIVE_TOURNAMENT,
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const status = tournamentManager.getTournamentStatus();
    const embed = EmbedBuilder.createTournamentDashboard(status.tournament, status.teams);

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Error en tournament dashboard:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al mostrar el dashboard del torneo';
      
    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}
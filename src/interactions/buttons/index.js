// Exportador de handlers de botones

import { handleTournamentRegisterButton } from './registration.js';
import { handleTournamentDashboard } from '../../interactions/commands/dashboard.js';
import { handleTournamentStart } from '../../interactions/commands/start.js';
import { handleTournamentReset } from '../../interactions/commands/reset.js';
import { handleSubmitResultImageButton } from './submitResultImage.js';
import { handlePanelSendLobbyCode } from './sendLobbyCodeButton.js';
import { 
  handlePanelCreateTournament,
  handlePanelHelp
} from '../../interactions/commands/panel.js';

export const buttonHandlers = {
  'tournament_register_btn': handleTournamentRegisterButton,
  'tournament_dashboard_btn': handleTournamentDashboard,
  // Panel buttons
  'panel_create_tournament': handlePanelCreateTournament,
  'panel_view_dashboard': handleTournamentDashboard,
  'panel_start_tournament': handleTournamentStart,
  'panel_view_teams': handlePanelViewTeams,
  'panel_reset_tournament': handleTournamentReset,
  'panel_send_lobby_code': handlePanelSendLobbyCode,
  'panel_help': handlePanelHelp,
  // Dynamic handlers
  _dynamic: {
    submit_result: handleSubmitResultImageButton
  }
};

// Handler para ver equipos
async function handlePanelViewTeams(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    
    const { tournamentManager } = await import('../../services/tournament/manager.js');
    const { EmbedBuilder: DiscordEmbed } = await import('discord.js');
    const { TOURNAMENT_COLORS } = await import('../../utils/constants.js');
    
    if (!tournamentManager.hasActiveTournament()) {
      return await interaction.editReply({ content: '❌ No hay torneo activo' });
    }
    
    const tournament = tournamentManager.getActiveTournament();
    const teams = tournamentManager.getRegisteredTeams();
    
    const embed = new DiscordEmbed()
      .setTitle(`📋 Equipos Registrados - ${tournament.name}`)
      .setDescription(teams.length > 0 ? 
        `**${teams.length}/${tournament.maxTeams}** equipos registrados` : 
        'No hay equipos registrados aún'
      )
      .setColor(TOURNAMENT_COLORS.info)
      .setTimestamp();
    
    if (teams.length > 0) {
      const teamList = teams.map((team, index) => {
        const captain = team.captain ? `<@${team.captain.id}>` : 'N/A';
        const members = team.members ? team.members.map(m => `<@${m.id}>`).join(', ') : 'N/A';
        return `**${index + 1}.** ${team.name}\n👤 Capitán: ${captain}\n👥 Jugadores: ${members}`;
      }).join('\n\n');
      
      embed.addFields({ name: '👥 Equipos', value: teamList.slice(0, 1024) });
    }
    
    await interaction.editReply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error al ver equipos:', error);
    await interaction.editReply({ content: '❌ Error al mostrar los equipos' });
  }
}

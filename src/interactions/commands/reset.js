// Handler para el comando /tournament-reset

import { tournamentManager } from '../../services/tournament/manager.js';
import { ChannelService } from '../../services/discord/channels.js';
import { RoleService } from '../../services/discord/roles.js';
import { PermissionService } from '../../services/discord/permissions.js';
import { googleSheetsService } from '../../services/google/sheets.js';
import { EmbedBuilder } from '../../utils/embeds.js';
import { ERROR_MESSAGES } from '../../utils/constants.js';

export async function handleTournamentReset(interaction) {
  try {
    // Verificar permisos
    if (!PermissionService.hasAdminPermissions(interaction.member)) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_PERMISSIONS,
        ephemeral: true
      });
    }

    // Si viene de un comando slash, verificar confirmación
    if (interaction.options) {
      const confirm = interaction.options.getBoolean('confirm');
      
      if (!confirm) {
        return await interaction.reply({
          content: '❌ Debes confirmar que quieres eliminar el torneo.',
          ephemeral: true
        });
      }
    }
    // Si viene del botón del panel, continuar sin confirmación extra
    // (ya es un botón de acción destructiva rojo)

    if (!tournamentManager.hasActiveTournament()) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_ACTIVE_TOURNAMENT,
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const tournament = tournamentManager.getActiveTournament();
    const tournamentName = tournament.name;

    try {
      await interaction.editReply('🗑️ Eliminando canales del torneo...');
      
      // Eliminar estructura de Discord (canales y categorías)
      await ChannelService.deleteTournamentStructure(interaction.guild, tournament.categoryId);
      
      await interaction.editReply('🗑️ Eliminando roles del torneo...');
      
      // Eliminar roles (limpia TODOS los roles de participantes)
      await RoleService.deleteTournamentRole(interaction.guild, tournament.roles.participant);

      await interaction.editReply('🗑️ Limpiando Google Sheets...');
      
      // Limpiar todas las hojas de Google Sheets
      await googleSheetsService.clearAllTournamentData();

      await interaction.editReply('🗑️ Limpiando datos del torneo...');
      
      // Limpiar datos del manager
      tournamentManager.deleteTournament();

      // Intentar actualizar panel (puede fallar si el canal fue borrado, pero no es crítico)
      try {
        const { updatePanelAutomatically } = await import('./panel.js');
        await updatePanelAutomatically(interaction.guild);
      } catch (panelError) {
        console.log('No se pudo actualizar el panel (puede haber sido eliminado):', panelError.message);
      }

      const embed = EmbedBuilder.createTournamentDeleted(tournamentName);
      await interaction.editReply({ 
        content: '✅ **Limpieza completada:**\n- Canales eliminados ✅\n- Roles eliminados ✅\n- Google Sheets limpiado ✅\n- Datos limpiados ✅',
        embeds: [embed] 
      });

    } catch (error) {
      console.error('Error eliminando estructuras del torneo:', error);
      await interaction.editReply('⚠️ Torneo eliminado pero hubo errores borrando algunos elementos.');
    }

  } catch (error) {
    console.error('Error en tournament reset:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al eliminar el torneo';
      
    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}
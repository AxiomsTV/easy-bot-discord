// Handler para enviar código de lobby a todos los equipos

import { tournamentManager } from '../../services/tournament/manager.js';
import { EmbedBuilder as DiscordEmbed } from 'discord.js';
import { TOURNAMENT_COLORS } from '../../utils/constants.js';

export async function handleSendLobbyCode(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    if (!tournamentManager.hasActiveTournament()) {
      return await interaction.editReply({
        content: '❌ No hay torneo activo'
      });
    }

    const tournament = tournamentManager.getActiveTournament();
    const matchNumber = interaction.fields.getTextInputValue('match_number');
    const lobbyCode = interaction.fields.getTextInputValue('lobby_code');

    // Crear embed del código de lobby
    const lobbyEmbed = new DiscordEmbed()
      .setTitle('🎮 CÓDIGO DE LOBBY')
      .setDescription(`**Match #${matchNumber}**`)
      .addFields(
        { 
          name: '📋 Código de Lobby', 
          value: `\`\`\`${lobbyCode}\`\`\``, 
          inline: false 
        },
        {
          name: '📌 Instrucciones',
          value: '• Copia el código de arriba\n• Únete a la lobby de Warzone\n• Ingresa el código\n• Espera a que comience la partida',
          inline: false
        }
      )
      .setColor(TOURNAMENT_COLORS.success)
      .setTimestamp()
      .setFooter({ text: `Torneo: ${tournament.name}` });

    // Obtener canal de lobby alert (buscar por ID o por nombre)
    console.log(`🔍 Buscando canal lobby-alert con ID guardado: ${tournament.channels?.lobbyAlert}`);
    console.log(`📋 tournament.channels:`, tournament.channels);
    
    let lobbyAlertChannel = null;
    
    // Primero intentar por ID si existe
    if (tournament.channels?.lobbyAlert) {
      lobbyAlertChannel = interaction.guild.channels.cache.get(tournament.channels.lobbyAlert);
      console.log(`Búsqueda por ID (${tournament.channels.lobbyAlert}): ${lobbyAlertChannel ? `✅ Encontrado: ${lobbyAlertChannel.name}` : '❌ No encontrado en cache'}`);
      
      if (!lobbyAlertChannel) {
        // Mostrar todos los canales de texto disponibles para debug
        console.log(`\n📝 Canales de texto en el servidor:`);
        interaction.guild.channels.cache
          .filter(ch => ch.type === 0)
          .forEach(ch => {
            console.log(`  - ${ch.name} (ID: ${ch.id}) ${ch.id === tournament.channels.lobbyAlert ? '👈 ESTE ES EL QUE BUSCO' : ''}`);
          });
      }
    } else {
      console.log(`⚠️ tournament.channels.lobbyAlert está vacío o undefined`);
    }
    
    // Si no se encuentra por ID, buscar por nombre en la categoría del torneo
    if (!lobbyAlertChannel && tournament.categoryId) {
      lobbyAlertChannel = interaction.guild.channels.cache.find(
        ch => ch.parentId === tournament.categoryId && 
              (ch.name === '-lobbyalert' || ch.name === 'lobbyalert' || ch.name === 'lobby-alert')
      );
      console.log(`Búsqueda por nombre en categoría: ${lobbyAlertChannel ? '✅ Encontrado' : '❌ No encontrado'}`);
    }
    
    // Si aún no se encuentra, buscar en todo el servidor
    if (!lobbyAlertChannel) {
      lobbyAlertChannel = interaction.guild.channels.cache.find(
        ch => ch.name === '-lobbyalert' || ch.name === 'lobbyalert' || ch.name === 'lobby-alert'
      );
      console.log(`Búsqueda global por nombre: ${lobbyAlertChannel ? '✅ Encontrado' : '❌ No encontrado'}`);
    }
    
    // Enviar a canal de lobby alert
    let lobbyAlertSent = false;
    if (lobbyAlertChannel) {
      try {
        await lobbyAlertChannel.send({
          embeds: [lobbyEmbed]
        });
        lobbyAlertSent = true;
        console.log(`✅ Código enviado a lobby-alert: ${lobbyAlertChannel.name}`);
      } catch (error) {
        console.error('❌ Error enviando a lobby-alert:', error.message);
      }
    } else {
      console.error('❌ No se encontró el canal de lobby-alert en ninguna búsqueda');
      console.log(`📋 Canales disponibles en el servidor:`);
      interaction.guild.channels.cache.forEach(ch => {
        if (ch.type === 0) { // Solo canales de texto
          console.log(`  - ${ch.name} (ID: ${ch.id}, Categoría: ${ch.parentId})`);
        }
      });
    }

    // Enviar a todos los canales de equipos
    const teams = tournamentManager.getRegisteredTeams();
    let sentCount = 0;
    let failedCount = 0;

    console.log(`📊 Total de equipos registrados: ${teams.length}`);
    console.log(`📋 Información de equipos:`);
    teams.forEach(team => {
      console.log(`  - ${team.name}: channelId=${team.channelId || 'undefined'}`);
    });

    for (const team of teams) {
      console.log(`\n🔍 Procesando equipo: ${team.name}`);
      
      // Primero intentar con channelId si existe
      let teamChannel = null;
      
      if (team.channelId) {
        teamChannel = interaction.guild.channels.cache.get(team.channelId);
        console.log(`  Búsqueda por channelId (${team.channelId}): ${teamChannel ? '✅' : '❌'}`);
      }
      
      // Si no se encuentra por ID, buscar por nombre del equipo
      if (!teamChannel) {
        const channelName = team.name.toLowerCase().replace(/\s+/g, '-');
        
        // Buscar txt-nombre o -nombre
        teamChannel = interaction.guild.channels.cache.find(
          ch => ch.name === `txt-${channelName}` || ch.name === `-${channelName}`
        );
        console.log(`  Búsqueda por nombre (txt-${channelName} o -${channelName}): ${teamChannel ? '✅' : '❌'}`);
        
        // Si se encuentra, actualizar el channelId del equipo
        if (teamChannel) {
          team.channelId = teamChannel.id;
          console.log(`  ✅ channelId actualizado para ${team.name}: ${teamChannel.id}`);
        }
      }
      
      if (teamChannel) {
        try {
          await teamChannel.send({
            embeds: [lobbyEmbed]
          });
          sentCount++;
          console.log(`  ✅ Mensaje enviado a ${teamChannel.name}`);
          // Pequeño delay para evitar rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`  ❌ Error enviando mensaje:`, error.message);
          failedCount++;
        }
      } else {
        console.error(`  ❌ No se encontró canal para ${team.name}`);
        failedCount++;
      }
    }

    // Respuesta al administrador
    await interaction.editReply({
      content: `✅ **Código de Lobby Enviado**\n\n` +
        `📊 **Match:** #${matchNumber}\n` +
        `🔑 **Código:** \`${lobbyCode}\`\n\n` +
        `📤 **Enviado a:**\n` +
        `• Canal lobby-alert: ${lobbyAlertSent ? '✅' : '❌'}\n` +
        `• ${sentCount}/${teams.length} canales de equipos\n` +
        (failedCount > 0 ? `⚠️ ${failedCount} equipos no recibieron el mensaje` : '')
    });

    // Actualizar panel
    const { updatePanelAutomatically } = await import('../commands/panel.js');
    await updatePanelAutomatically(interaction.guild);

  } catch (error) {
    console.error('Error enviando código de lobby:', error);
    
    const errorMsg = interaction.deferred || interaction.replied 
      ? 'editReply' 
      : 'reply';
      
    await interaction[errorMsg]({ 
      content: '❌ Error al enviar el código de lobby', 
      ephemeral: true 
    }).catch(() => {});
  }
}

// Handler para el panel de control interactivo

import { 
  EmbedBuilder as DiscordEmbed, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { tournamentManager } from '../../services/tournament/manager.js';
import { PermissionService } from '../../services/discord/permissions.js';
import { ERROR_MESSAGES, TOURNAMENT_COLORS } from '../../utils/constants.js';

export async function handleTournamentPanel(interaction) {
  try {
    if (!PermissionService.hasAdminPermissions(interaction.member)) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_PERMISSIONS,
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const ADMIN_CATEGORY_ID = '1430649040827322389';
    
    let panelChannel = interaction.guild.channels.cache.find(
      ch => ch.name === '-panel-admin' && ch.parentId === ADMIN_CATEGORY_ID
    );
    
    if (!panelChannel) {
      const { PermissionFlagsBits } = await import('discord.js');
      
      panelChannel = await interaction.guild.channels.create({
        name: '-panel-admin',
        type: 0,
        parent: ADMIN_CATEGORY_ID,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel, 
              PermissionFlagsBits.SendMessages, 
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.EmbedLinks
            ]
          }
        ]
      });
      
      const adminMembers = interaction.guild.members.cache.filter(
        member => PermissionService.hasAdminPermissions(member)
      );
      
      for (const [, member] of adminMembers) {
        await panelChannel.permissionOverwrites.create(member, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true
        });
      }
    }

    const messages = await panelChannel.messages.fetch({ limit: 20 });
    const existingPanel = messages.find(msg => 
      msg.author.id === interaction.client.user.id && 
      msg.embeds.length > 0 && 
      msg.embeds[0].title && 
      (msg.embeds[0].title.includes('Panel de Control') || msg.embeds[0].title.includes('Torneos'))
    );

    const hasActiveTournament = tournamentManager.hasActiveTournament();

    const embed = new DiscordEmbed()
      .setTitle(' Panel de Control - Torneos ')
      .setDescription(
        hasActiveTournament 
          ? ' **Torneo Activo**\n\nUsa los botones para gestionar el torneo actual.'
          : ' **Sin Torneo Activo**\n\nUsa el botón \"Crear Torneo\" para comenzar.'
      )
      .setColor(hasActiveTournament ? TOURNAMENT_COLORS.success : TOURNAMENT_COLORS.info)
      .addFields(
        { name: ' Crear Torneo', value: 'Configura un nuevo torneo', inline: true },
        { name: ' Dashboard', value: 'Ver información del torneo', inline: true },
        { name: ' Iniciar Torneo', value: 'Comenzar y cerrar registros', inline: true },
        { name: ' Ver Equipos', value: 'Lista de equipos registrados', inline: true },
        { name: ' Enviar Lobby', value: 'Enviar código a todos los equipos', inline: true },
        { name: ' Reiniciar', value: 'Resetear torneo actual', inline: true },
        { name: ' Ayuda', value: 'Guía de uso del bot', inline: true }
      )
      .setFooter({ text: 'Sistema de Puntuación: Kills  Multiplicador (1°=x1.6, 2°-5°=x1.4, 6°-10°=x1.2, 11°-15°=x1.0)' })
      .setTimestamp();

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_create_tournament')
          .setLabel(' Crear Torneo')
          .setStyle(ButtonStyle.Success)
          .setDisabled(hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_view_dashboard')
          .setLabel(' Dashboard')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_start_tournament')
          .setLabel(' Iniciar Torneo')
          .setStyle(ButtonStyle.Success)
          .setDisabled(!hasActiveTournament)
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_view_teams')
          .setLabel(' Ver Equipos')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_send_lobby_code')
          .setLabel(' Enviar Lobby')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_reset_tournament')
          .setLabel(' Reiniciar Torneo')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(!hasActiveTournament)
      );

    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_help')
          .setLabel(' Ayuda')
          .setStyle(ButtonStyle.Secondary)
      );

    if (existingPanel) {
      await existingPanel.edit({ 
        embeds: [embed], 
        components: [row1, row2, row3]
      });
      
      await interaction.editReply({
        content: ` Panel actualizado en <#${panelChannel.id}>`
      });
    } else {
      await panelChannel.send({ 
        embeds: [embed], 
        components: [row1, row2, row3]
      });

      await interaction.editReply({
        content: ` Panel creado en <#${panelChannel.id}>\n\n **Tip:** El panel se actualizará automáticamente.`
      });
    }

  } catch (error) {
    console.error('Error en panel principal:', error);
    
    const errorMsg = interaction.deferred || interaction.replied 
      ? 'editReply' 
      : 'reply';
      
    await interaction[errorMsg]({ 
      content: ' Error al mostrar el panel de control', 
      ephemeral: true 
    }).catch(() => {});
  }
}

export async function handlePanelCreateTournament(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('modal_create_tournament')
    .setTitle(' Crear Nuevo Torneo');

  const nameInput = new TextInputBuilder()
    .setCustomId('tournament_name')
    .setLabel('Nombre del Torneo')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: Copa Warzone 2025')
    .setMinLength(3)
    .setMaxLength(50)
    .setRequired(true);

  const maxTeamsInput = new TextInputBuilder()
    .setCustomId('max_teams')
    .setLabel('Número Máximo de Equipos')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: 20 (mínimo 4, máximo 64)')
    .setMinLength(1)
    .setMaxLength(2)
    .setRequired(true);

  const teamSizeInput = new TextInputBuilder()
    .setCustomId('team_size')
    .setLabel('Jugadores por Equipo')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: 3 (para Tríos)')
    .setMinLength(1)
    .setMaxLength(2)
    .setRequired(true);

  const formatInput = new TextInputBuilder()
    .setCustomId('tournament_format')
    .setLabel('Formato del Torneo')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: Tríos, Solos, Duos, Cuartetos')
    .setMinLength(2)
    .setMaxLength(30)
    .setRequired(true);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('tournament_description')
    .setLabel('Descripción (Opcional)')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Información adicional del torneo...')
    .setRequired(false);

  const row1 = new ActionRowBuilder().addComponents(nameInput);
  const row2 = new ActionRowBuilder().addComponents(maxTeamsInput);
  const row3 = new ActionRowBuilder().addComponents(teamSizeInput);
  const row4 = new ActionRowBuilder().addComponents(formatInput);
  const row5 = new ActionRowBuilder().addComponents(descriptionInput);

  modal.addComponents(row1, row2, row3, row4, row5);

  await interaction.showModal(modal);
}

export async function handlePanelHelp(interaction) {
  const embed = new DiscordEmbed()
    .setTitle(' Guía del Bot de Torneos')
    .setDescription('**Guía rápida para gestionar torneos**')
    .setColor(TOURNAMENT_COLORS.info)
    .addFields(
      { name: '1 Crear Torneo', value: 'Configura un nuevo torneo con nombre, equipos y formato', inline: false },
      { name: '2 Registro', value: 'Los equipos se registran en el canal de registro automáticamente', inline: false },
      { name: '3 Iniciar', value: 'Cierra registros y comienza el torneo', inline: false },
      { name: '4 Resultados', value: 'Los equipos envían sus resultados en sus canales privados', inline: false },
      { name: '5 Dashboard', value: 'Ver estado actual y estadísticas del torneo', inline: false }
    )
    .setFooter({ text: 'Sistema de Puntuación: Kills  Multiplicador según posición' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function handlePanelRefresh(interaction) {
  try {
    if (!PermissionService.hasAdminPermissions(interaction.member)) {
      return await interaction.reply({
        content: ERROR_MESSAGES.NO_PERMISSIONS,
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const ADMIN_CATEGORY_ID = '1430649040827322389';
    
    let panelChannel = interaction.guild.channels.cache.find(
      ch => ch.name === '-panel-admin' && ch.parentId === ADMIN_CATEGORY_ID
    );

    if (!panelChannel) {
      return await interaction.editReply({
        content: ' No se encontró el canal de panel. Usa `/panel` para crear uno.'
      });
    }

    const messages = await panelChannel.messages.fetch({ limit: 100 });
    const botMessages = messages.filter(msg => msg.author.id === interaction.client.user.id);
    
    let deletedCount = 0;
    for (const [, msg] of botMessages) {
      try {
        await msg.delete();
        deletedCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error borrando mensaje:', error);
      }
    }

    const hasActiveTournament = tournamentManager.hasActiveTournament();

    const embed = new DiscordEmbed()
      .setTitle(' Panel de Control - Torneos ')
      .setDescription(
        hasActiveTournament 
          ? ' **Torneo Activo**\n\nUsa los botones para gestionar el torneo actual.'
          : ' **Sin Torneo Activo**\n\nUsa el botón "Crear Torneo" para comenzar.'
      )
      .setColor(hasActiveTournament ? TOURNAMENT_COLORS.success : TOURNAMENT_COLORS.info)
      .addFields(
        { name: ' Crear Torneo', value: 'Configura un nuevo torneo', inline: true },
        { name: ' Dashboard', value: 'Ver información del torneo', inline: true },
        { name: ' Iniciar Torneo', value: 'Comenzar y cerrar registros', inline: true },
        { name: ' Ver Equipos', value: 'Lista de equipos registrados', inline: true },
        { name: ' Enviar Lobby', value: 'Enviar código a todos los equipos', inline: true },
        { name: ' Reiniciar', value: 'Resetear torneo actual', inline: true },
        { name: ' Ayuda', value: 'Guía de uso del bot', inline: true }
      )
      .setFooter({ text: 'Sistema de Puntuación: Kills  Multiplicador (1°=x1.6, 2°-5°=x1.4, 6°-10°=x1.2, 11°-15°=x1.0)' })
      .setTimestamp();

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_create_tournament')
          .setLabel(' Crear Torneo')
          .setStyle(ButtonStyle.Success)
          .setDisabled(hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_view_dashboard')
          .setLabel(' Dashboard')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_start_tournament')
          .setLabel(' Iniciar Torneo')
          .setStyle(ButtonStyle.Success)
          .setDisabled(!hasActiveTournament)
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_view_teams')
          .setLabel(' Ver Equipos')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_send_lobby_code')
          .setLabel(' Enviar Lobby')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_reset_tournament')
          .setLabel(' Reiniciar Torneo')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(!hasActiveTournament)
      );

    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_help')
          .setLabel(' Ayuda')
          .setStyle(ButtonStyle.Secondary)
      );

    await panelChannel.send({ 
      embeds: [embed], 
      components: [row1, row2, row3]
    });

    await interaction.editReply({
      content: ` Panel refrescado exitosamente!\n\n Se borraron ${deletedCount} mensajes antiguos\n Nuevo panel creado en <#${panelChannel.id}> SIN check-in`
    });

  } catch (error) {
    console.error('Error en panel-refresh:', error);
    
    const errorMsg = interaction.deferred || interaction.replied 
      ? 'editReply' 
      : 'reply';
      
    await interaction[errorMsg]({ 
      content: ' Error al refrescar el panel de control', 
      ephemeral: true 
    }).catch(() => {});
  }
}

export async function updatePanelAutomatically(guild) {
  try {
    const ADMIN_CATEGORY_ID = '1430649040827322389';
    
    const panelChannel = guild.channels.cache.find(
      ch => ch.name === '-panel-admin' && ch.parentId === ADMIN_CATEGORY_ID
    );
    
    if (!panelChannel) return false;

    const messages = await panelChannel.messages.fetch({ limit: 10 });
    const existingPanel = messages.find(msg => 
      msg.author.id === guild.client.user.id && 
      msg.embeds.length > 0 && 
      msg.embeds[0].title?.includes('Panel de Control')
    );

    if (!existingPanel) return false;

    const hasActiveTournament = tournamentManager.hasActiveTournament();

    const embed = new DiscordEmbed()
      .setTitle(' Panel de Control - Torneos ')
      .setDescription(
        hasActiveTournament 
          ? ' **Torneo Activo**\n\nUsa los botones para gestionar el torneo actual.'
          : ' **Sin Torneo Activo**\n\nUsa el botón \"Crear Torneo\" para comenzar.'
      )
      .setColor(hasActiveTournament ? TOURNAMENT_COLORS.success : TOURNAMENT_COLORS.info)
      .addFields(
        { name: ' Crear Torneo', value: 'Configura un nuevo torneo', inline: true },
        { name: ' Dashboard', value: 'Ver información del torneo', inline: true },
        { name: ' Iniciar Torneo', value: 'Comenzar y cerrar registros', inline: true },
        { name: ' Ver Equipos', value: 'Lista de equipos registrados', inline: true },
        { name: ' Enviar Lobby', value: 'Enviar código a todos los equipos', inline: true },
        { name: ' Reiniciar', value: 'Resetear torneo actual', inline: true },
        { name: ' Ayuda', value: 'Guía de uso del bot', inline: true }
      )
      .setFooter({ text: 'Sistema de Puntuación: Kills  Multiplicador (1°=x1.6, 2°-5°=x1.4, 6°-10°=x1.2, 11°-15°=x1.0)' })
      .setTimestamp();

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_create_tournament')
          .setLabel(' Crear Torneo')
          .setStyle(ButtonStyle.Success)
          .setDisabled(hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_view_dashboard')
          .setLabel(' Dashboard')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_start_tournament')
          .setLabel(' Iniciar Torneo')
          .setStyle(ButtonStyle.Success)
          .setDisabled(!hasActiveTournament)
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_view_teams')
          .setLabel(' Ver Equipos')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_send_lobby_code')
          .setLabel(' Enviar Lobby')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(!hasActiveTournament),
        new ButtonBuilder()
          .setCustomId('panel_reset_tournament')
          .setLabel(' Reiniciar Torneo')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(!hasActiveTournament)
      );

    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('panel_help')
          .setLabel(' Ayuda')
          .setStyle(ButtonStyle.Secondary)
      );

    await existingPanel.edit({ 
      embeds: [embed], 
      components: [row1, row2, row3]
    });

    console.log(' Panel actualizado automáticamente');
    return true;
  } catch (error) {
    console.error('Error actualizando panel automáticamente:', error);
    return false;
  }
}

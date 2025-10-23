// Handler para el modal de registro de equipos

import { tournamentManager } from '../../services/tournament/manager.js';
import { ChannelService } from '../../services/discord/channels.js';
import { RoleService } from '../../services/discord/roles.js';
import { EmbedBuilder } from '../../utils/embeds.js';
import { Validator } from '../../utils/validators.js';

export async function handleTournamentRegisterModal(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    const teamName = interaction.fields.getTextInputValue('team_name');
    const teamTag = interaction.fields.getTextInputValue('team_tag') || '';
    const membersText = interaction.fields.getTextInputValue('team_members');

    // Validaciones básicas
    Validator.validateTeamName(teamName);
    if (teamTag) Validator.validateTeamTag(teamTag);

    const tournament = tournamentManager.getActiveTournament();
    
    // Extraer IDs de usuarios (pueden venir como menciones <@123> o IDs directos 123456789)
    let userIds = [];
    
    // Buscar menciones primero
    const mentions = membersText.match(/<@!?(\d+)>/g);
    if (mentions) {
      userIds = mentions.map(mention => mention.replace(/<@!?(\d+)>/, '$1'));
    } else {
      // Si no hay menciones, buscar números separados por comas o espacios
      userIds = membersText
        .split(/[,\s]+/)
        .map(id => id.trim())
        .filter(id => /^\d+$/.test(id)); // Solo números válidos
    }

    // Validar cantidad de miembros
    const expectedMembers = tournament.teamSize - 1;
    if (userIds.length !== expectedMembers) {
      throw new Error(`❌ Debes mencionar exactamente ${expectedMembers} usuario(s) (sin incluirte a ti como capitán).\n\n` + 
        `📝 Tu equipo será de ${tournament.teamSize} jugadores: Tú + ${expectedMembers} más.\n` +
        `✅ Para mencionar: Escribe @ y selecciona al usuario de la lista\n` +
        `✅ Formato: @Usuario1 @Usuario2 (separados por espacios)\n` +
        `❌ Mencionaste ${userIds.length} usuario(s), necesitas ${expectedMembers}.`);
    }

    // Obtener información completa de los usuarios
    const membersList = [];
    for (const userId of userIds) {
      try {
        const member = await interaction.guild.members.fetch(userId);
        membersList.push({
          id: member.id,
          username: member.user.username,
          displayName: member.displayName
        });
      } catch (error) {
        throw new Error(`❌ No se pudo encontrar al usuario mencionado.\n\n` +
          `💡 Asegúrate de:\n` +
          `1. Mencionar usuarios escribiendo @ y seleccionándolos de la lista\n` +
          `2. Los usuarios deben estar en este servidor\n` +
          `3. Verifica que las menciones sean correctas (@Usuario)`);
      }
    }

    // Registrar equipo usando el manager
    const team = tournamentManager.registerTeam({
      name: teamName,
      tag: teamTag,
      captain: {
        id: interaction.user.id,
        username: interaction.user.username,
        displayName: interaction.member.displayName
      },
      members: membersList
    });

    // IDs de todos los miembros del equipo (capitán + miembros)
    const allMemberIds = [interaction.user.id, ...userIds];

    // 1. Crear rol específico del equipo
    const teamRole = await RoleService.createTeamRole(
      interaction.guild,
      teamName,
      tournament.name
    );
    team.roleId = teamRole.id;

    // 2. Asignar rol de participante general a todos los miembros
    await RoleService.assignParticipantRole(
      interaction.guild, 
      allMemberIds, 
      tournament.roles.participant
    );

    // 3. Asignar rol específico del equipo a todos los miembros
    await RoleService.assignTeamRole(
      interaction.guild,
      allMemberIds,
      teamRole.id
    );

    // 4. Crear categoría de equipos si no existe
    let teamsCategory = interaction.guild.channels.cache.find(
      c => c.name === '👥 EQUIPOS' && c.type === 4 // CategoryChannel
    );
    
    if (!teamsCategory) {
      teamsCategory = await interaction.guild.channels.create({
        name: '👥 EQUIPOS',
        type: 4, // CategoryChannel
        position: 100 // Posición más alta para que aparezca abajo
      });
    }

    // 5. Crear canal de TEXTO privado del equipo
    const channelName = teamName.toLowerCase().replace(/\s+/g, '-');
    
    console.log('🔍 DEBUG Permisos del canal:');
    console.log('  - @everyone ID:', interaction.guild.id);
    console.log('  - Participant Role ID:', tournament.roles.participant);
    console.log('  - Team Role ID:', teamRole.id);
    
    const textChannel = await interaction.guild.channels.create({
      name: `txt-${channelName}`,
      type: 0, // GuildText
      parent: teamsCategory.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id, // @everyone no puede ver
          deny: ['ViewChannel']
        },
        {
          id: tournament.roles.participant, // Rol Participante puede ver
          allow: ['ViewChannel', 'ReadMessageHistory']
        },
        {
          id: teamRole.id, // El rol del equipo puede ver y escribir
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles', 'EmbedLinks']
        }
      ]
    });
    team.channelId = textChannel.id;

    // 6. Crear canal de VOZ privado del equipo
    const voiceChannel = await interaction.guild.channels.create({
      name: `🔊 ${teamName}`,
      type: 2, // GuildVoice
      parent: teamsCategory.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id, // @everyone no puede ver ni conectarse
          deny: ['ViewChannel', 'Connect']
        },
        {
          id: tournament.roles.participant, // Rol Participante puede ver
          allow: ['ViewChannel']
        },
        {
          id: teamRole.id, // El rol del equipo puede ver y conectarse
          allow: ['ViewChannel', 'Connect', 'Speak', 'UseVAD', 'Stream']
        }
      ]
    });
    team.voiceChannelId = voiceChannel.id;

    // 7. Mensaje de bienvenida en el canal de texto del equipo
    const welcomeMessage = `# 👋 ¡Bienvenido ${teamName}!\n\n` +
      `Este es el canal privado de tu equipo para el torneo **${tournament.name}**.\n\n` +
      `**👥 Miembros del equipo:**\n` +
      `${allMemberIds.map(id => `- <@${id}>`).join('\n')}\n\n` +
      `**📢 Canales del equipo:**\n` +
      `- 📝 Texto: <#${textChannel.id}>\n` +
      `- 🔊 Voz: <#${voiceChannel.id}>\n\n` +
      `**📋 Usa estos canales para:**\n` +
      `- Coordinarse con tu equipo\n` +
      `- **Enviar resultados:** Sube una captura de pantalla de tus resultados aquí\n` +
      `- Comunicación interna del equipo\n` +
      `- Jugar juntos en el canal de voz\n\n` +
      `🎯 **Cómo enviar resultados:** Simplemente sube una imagen de tus resultados en este canal y el bot te ayudará a registrarlos.\n\n` +
      `¡Buena suerte! 🎮`;
    
    await textChannel.send(welcomeMessage);

    // Enviar confirmación
    const teamCount = tournamentManager.getTeamCount();
    const confirmEmbed = EmbedBuilder.createTeamRegistrationSuccess(
      team, 
      teamCount, 
      tournament.maxTeams
    );
    await interaction.editReply({ 
      content: `✅ **¡Equipo registrado exitosamente!**\n\n` +
        `🎭 **Rol del equipo:** <@&${teamRole.id}>\n` +
        `� **Canal de texto:** <#${textChannel.id}>\n` +
        `🔊 **Canal de voz:** <#${voiceChannel.id}>\n` +
        `👥 **Miembros:** ${allMemberIds.length} jugadores`,
      embeds: [confirmEmbed] 
    });

    // Actualizar panel de registro
    await ChannelService.updateRegistrationPanel(
      interaction.guild, 
      tournament.channels, 
      teamCount, 
      tournament.maxTeams
    );

    // Anuncio público
    const announcementChannel = interaction.guild.channels.cache.get(tournament.channels.announcements);
    if (announcementChannel) {
      const announcementEmbed = EmbedBuilder.createTeamRegistrationAnnouncement(
        team, 
        teamCount, 
        tournament.maxTeams
      );
      await announcementChannel.send({ embeds: [announcementEmbed] });
    }

  } catch (error) {
    console.error('Error en tournament register modal:', error);
    
    const errorMessage = error.message.startsWith('❌') ? 
      error.message : 
      '❌ Error al procesar el registro del equipo';
      
    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}
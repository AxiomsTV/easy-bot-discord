// Servicio para gestión de permisos de Discord

import { PermissionFlagsBits } from 'discord.js';

export class PermissionService {
  // Verificar permisos de administrador
  static hasAdminPermissions(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator) || 
           member.permissions.has(PermissionFlagsBits.ManageGuild);
  }

  // Verificar permisos de gestión de canales
  static hasChannelManagePermissions(member) {
    return member.permissions.has(PermissionFlagsBits.ManageChannels) ||
           this.hasAdminPermissions(member);
  }

  // Verificar permisos de gestión de roles
  static hasRoleManagePermissions(member) {
    return member.permissions.has(PermissionFlagsBits.ManageRoles) ||
           this.hasAdminPermissions(member);
  }

  // Crear overwrites de permisos para categoría de torneo
  static createTournamentCategoryPermissions(guild) {
    return [
      {
        id: guild.roles.everyone,
        allow: [PermissionFlagsBits.ViewChannel],
        deny: [PermissionFlagsBits.SendMessages]
      }
    ];
  }

  // Crear overwrites para canal de anuncios
  static createAnnouncementChannelPermissions(guild, participantRoleId) {
    return [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: participantRoleId,
        allow: [PermissionFlagsBits.ViewChannel],
        deny: [PermissionFlagsBits.SendMessages]
      }
    ];
  }

  // Crear overwrites para canal de registro
  static createRegistrationChannelPermissions(guild, participantRoleId) {
    return [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: participantRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      }
    ];
  }

  // Crear overwrites para canal de check-in
  static createCheckinChannelPermissions(guild, participantRoleId) {
    return [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: participantRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory
        ],
        deny: [PermissionFlagsBits.SendMessages]
      }
    ];
  }

  // Crear overwrites para canal de brackets
  static createBracketChannelPermissions(guild, participantRoleId) {
    return [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: participantRoleId,
        allow: [PermissionFlagsBits.ViewChannel],
        deny: [PermissionFlagsBits.SendMessages]
      }
    ];
  }

  // Crear overwrites para canal privado de equipo
  static createTeamChannelPermissions(guild, teamMemberIds) {
    return [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      ...teamMemberIds.map(memberId => ({
        id: memberId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      }))
    ];
  }

  // Verificar si el bot tiene permisos necesarios
  static async validateBotPermissions(guild) {
    const botMember = guild.members.cache.get(guild.client.user.id);
    
    const requiredPermissions = [
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.UseExternalEmojis
    ];

    const missingPermissions = requiredPermissions.filter(
      permission => !botMember.permissions.has(permission)
    );

    if (missingPermissions.length > 0) {
      throw new Error(
        `❌ El bot necesita los siguientes permisos: ${missingPermissions.join(', ')}`
      );
    }

    return true;
  }
}
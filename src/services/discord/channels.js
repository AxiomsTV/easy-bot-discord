﻿// Servicio para gestión de canales de Discord

import { ChannelType } from 'discord.js';
import { PermissionService } from './permissions.js';
import { EmbedBuilder } from '../../utils/embeds.js';

export class ChannelService {
  // Crear categoría principal del torneo
  static async createTournamentCategory(guild, tournamentName) {
    const category = await guild.channels.create({
      name: ` ${tournamentName}`,
      type: ChannelType.GuildCategory,
      permissionOverwrites: PermissionService.createTournamentCategoryPermissions(guild)
    });
    
    return category.id;
  }

  // Crear canales principales del torneo
  static async createTournamentChannels(guild, unusedCategoryId, participantRoleId) {
    console.log('🔧 Creando categoría del torneo...');
    
    // Buscar la categoría "Giveme Roles" para posicionar la categoría del torneo debajo de ella
    const givemeRolesCategory = guild.channels.cache.find(
      c => c.type === ChannelType.GuildCategory && c.name === '▌𝙂𝙞𝙫𝙚𝙢𝙚 𝙍𝙤𝙡𝙚𝙨▐'
    );
    
    let targetPosition = 0;
    if (givemeRolesCategory) {
      targetPosition = givemeRolesCategory.position + 1;
      console.log(`📍 Posicionando categoría debajo de "${givemeRolesCategory.name}" (posición ${targetPosition})`);
    }
    
    // Crear UNA SOLA categoría: Tournament Control
    const tournamentControlCategory = await guild.channels.create({
      name: '▌ 𝙏𝙤𝙪𝙧𝙣𝙖𝙢𝙚𝙣𝙩 𝘾𝙤𝙣𝙩𝙧𝙤𝙡 ▐',
      type: ChannelType.GuildCategory,
      permissionOverwrites: PermissionService.createAnnouncementChannelPermissions(guild, participantRoleId)
    });
    const categoryId = tournamentControlCategory.id;
    console.log(`✅ Categoría creada: ${categoryId}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Posicionar la categoría
    console.log('📌 Posicionando categoría...');
    await tournamentControlCategory.setPosition(targetPosition);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📋 Creando todos los canales en Tournament Control...');
    
    const lobbyAlertChannel = await guild.channels.create({
      name: '🔔-lobbyalert',
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createAnnouncementChannelPermissions(guild, participantRoleId)
    });

    const leaderboardSheetChannel = await guild.channels.create({
      name: '📊-leaderboard-sheet',
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createBracketChannelPermissions(guild, participantRoleId)
    });

    const playerListChannel = await guild.channels.create({
      name: '📋-player-list',
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createRegistrationChannelPermissions(guild, participantRoleId)
    });

    const resultsChannel = await guild.channels.create({
      name: '🎮-results',
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createCheckinChannelPermissions(guild, participantRoleId)
    });

    const announcementChannel = await guild.channels.create({
      name: '📢-anuncios',
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createAnnouncementChannelPermissions(guild, participantRoleId)
    });

    const registrationChannel = await guild.channels.create({
      name: '📝-registro-equipos',
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createRegistrationChannelPermissions(guild, participantRoleId)
    });
    
    console.log('✅ Todos los canales creados exitosamente en una sola categoría');

    return {
      category1: categoryId,
      lobbyAlert: lobbyAlertChannel.id,
      leaderboardSheet: leaderboardSheetChannel.id,
      playerList: playerListChannel.id,
      results: resultsChannel.id,
      announcements: announcementChannel.id,
      registration: registrationChannel.id
    };
  }

  static async createTeamChannel(guild, team, categoryId) {
    const teamChannel = await guild.channels.create({
      name: `-${team.name.toLowerCase().replace(/\s+/g, '-')}`,
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: PermissionService.createTeamChannelPermissions(guild, team.getMemberIds())
    });

    const welcomeEmbed = EmbedBuilder.createTeamWelcome(team);
    await teamChannel.send({ embeds: [welcomeEmbed] });

    return teamChannel.id;
  }

  static async sendRegistrationPanel(channel, teamCount = 0, maxTeams = 0) {
    const embed = EmbedBuilder.createRegistrationPanel(teamCount, maxTeams);
    const components = EmbedBuilder.createRegistrationComponents(teamCount >= maxTeams);
    await channel.send({ embeds: [embed], components });
  }

  static async sendTournamentAnnouncement(channel, tournament) {
    const embed = EmbedBuilder.createTournamentAnnouncement(tournament);
    await channel.send({ embeds: [embed] });
  }

  static async updateRegistrationPanel(guild, channels, teamCount, maxTeams) {
    try {
      const registrationChannel = guild.channels.cache.get(channels.registration);
      if (!registrationChannel) return;

      const messages = await registrationChannel.messages.fetch({ limit: 50 });
      const botMessages = messages.filter(msg => 
        msg.author.id === guild.client.user.id && 
        msg.embeds.length > 0 && 
        msg.embeds[0].title?.includes('Registro de Equipos')
      );

      if (botMessages.size > 0) {
        const latestMessage = botMessages.first();
        const embed = EmbedBuilder.createUpdatedRegistrationPanel(teamCount, maxTeams);
        const components = EmbedBuilder.createRegistrationComponents(teamCount >= maxTeams);
        await latestMessage.edit({ embeds: [embed], components });
      }
    } catch (error) {
      console.error('Error actualizando panel de registro:', error);
    }
  }

  static async deleteTournamentStructure(guild, categoryId) {
    try {
      let deletedCount = 0;
      
      // Buscar y eliminar las categorías del torneo por nombre
      const tournamentCategories = guild.channels.cache.filter(
        c => c.type === ChannelType.GuildCategory && 
        (c.name === '▌ 𝙏𝙤𝙪𝙧𝙣𝙖𝙢𝙚𝙣𝙩 𝘾𝙤𝙣𝙩𝙧𝙤𝙡 ▐' || c.name === '▌ 𝙏𝙤𝙪𝙧𝙣𝙖𝙢𝙚𝙣𝙩 Register ▐')
      );
      
      for (const [, category] of tournamentCategories) {
        const channelsToDelete = guild.channels.cache.filter(
          channel => channel.parentId === category.id
        );
        
        for (const [, channel] of channelsToDelete) {
          try {
            await channel.delete();
            deletedCount++;
            console.log(`✅ Canal eliminado: ${channel.name}`);
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`Error eliminando canal ${channel.name}:`, error.message);
          }
        }
        
        try {
          await category.delete();
          deletedCount++;
          console.log(`✅ Categoría eliminada: ${category.name}`);
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Error eliminando categoría ${category.name}:`, error.message);
        }
      }
      
      // Eliminar la categoría de equipos si existe
      const teamsCategory = guild.channels.cache.find(
        c => c.name === '👥 EQUIPOS' && c.type === 4
      );
      
      if (teamsCategory) {
        const teamsCategoryChannels = guild.channels.cache.filter(
          channel => channel.parentId === teamsCategory.id
        );
        
        for (const [, channel] of teamsCategoryChannels) {
          try {
            await channel.delete();
            deletedCount++;
            console.log(`✅ Canal de categoría EQUIPOS eliminado: ${channel.name}`);
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`Error eliminando canal ${channel.name}:`, error.message);
          }
        }
        
        try {
          await teamsCategory.delete();
          deletedCount++;
          console.log('✅ Categoría de equipos eliminada');
        } catch (error) {
          console.error('Error eliminando categoría de equipos:', error.message);
        }
      }
      
      console.log(`✅ Total de canales eliminados: ${deletedCount}`);
      
    } catch (error) {
      console.error('Error eliminando estructura de canales:', error);
    }
  }
}

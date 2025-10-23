// Utilidades de validación

import { LIMITS } from './constants.js';

export class Validator {
  // Validar nombre del torneo
  static validateTournamentName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('❌ El nombre del torneo es requerido');
    }

    if (name.length < LIMITS.MIN_TOURNAMENT_NAME) {
      throw new Error(`❌ El nombre debe tener al menos ${LIMITS.MIN_TOURNAMENT_NAME} caracteres`);
    }

    if (name.length > LIMITS.MAX_TOURNAMENT_NAME) {
      throw new Error(`❌ El nombre no puede tener más de ${LIMITS.MAX_TOURNAMENT_NAME} caracteres`);
    }

    // Validar caracteres permitidos
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      throw new Error('❌ El nombre solo puede contener letras, números, espacios, guiones y guiones bajos');
    }

    return true;
  }

  // Validar nombre del equipo
  static validateTeamName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('❌ El nombre del equipo es requerido');
    }

    if (name.length < LIMITS.MIN_TEAM_NAME) {
      throw new Error(`❌ El nombre del equipo debe tener al menos ${LIMITS.MIN_TEAM_NAME} caracteres`);
    }

    if (name.length > LIMITS.MAX_TEAM_NAME) {
      throw new Error(`❌ El nombre del equipo no puede tener más de ${LIMITS.MAX_TEAM_NAME} caracteres`);
    }

    return true;
  }

  // Validar tag del equipo
  static validateTeamTag(tag) {
    if (!tag) return true; // Tag es opcional

    if (typeof tag !== 'string') {
      throw new Error('❌ El tag del equipo debe ser texto');
    }

    if (tag.length < LIMITS.MIN_TEAM_TAG) {
      throw new Error(`❌ El tag debe tener al menos ${LIMITS.MIN_TEAM_TAG} caracteres`);
    }

    if (tag.length > LIMITS.MAX_TEAM_TAG) {
      throw new Error(`❌ El tag no puede tener más de ${LIMITS.MAX_TEAM_TAG} caracteres`);
    }

    // Validar caracteres permitidos para tag
    if (!/^[a-zA-Z0-9]+$/.test(tag)) {
      throw new Error('❌ El tag solo puede contener letras y números');
    }

    return true;
  }

  // Validar número de equipos
  static validateMaxTeams(maxTeams) {
    if (!Number.isInteger(maxTeams)) {
      throw new Error('❌ El número de equipos debe ser un número entero');
    }

    if (maxTeams < LIMITS.MIN_TEAMS) {
      throw new Error(`❌ Mínimo ${LIMITS.MIN_TEAMS} equipos requeridos`);
    }

    if (maxTeams > LIMITS.MAX_TEAMS) {
      throw new Error(`❌ Máximo ${LIMITS.MAX_TEAMS} equipos permitidos`);
    }

    return true;
  }

  // Validar tamaño del equipo
  static validateTeamSize(teamSize) {
    if (!Number.isInteger(teamSize)) {
      throw new Error('❌ El tamaño del equipo debe ser un número entero');
    }

    if (teamSize < LIMITS.MIN_TEAM_SIZE) {
      throw new Error(`❌ Mínimo ${LIMITS.MIN_TEAM_SIZE} jugador por equipo`);
    }

    if (teamSize > LIMITS.MAX_TEAM_SIZE) {
      throw new Error(`❌ Máximo ${LIMITS.MAX_TEAM_SIZE} jugadores por equipo`);
    }

    return true;
  }

  // Validar formato del torneo
  static validateTournamentFormat(format) {
    const validFormats = ['single', 'double', 'round-robin', 'swiss'];
    
    if (!validFormats.includes(format)) {
      throw new Error('❌ Formato de torneo no válido');
    }

    return true;
  }

  // Validar juego
  static validateGame(game) {
    const validGames = ['valorant', 'lol', 'cs2', 'rl', 'other'];
    
    if (!validGames.includes(game)) {
      throw new Error('❌ Juego no válido');
    }

    return true;
  }

  // Validar menciones de usuarios
  static validateUserMentions(mentionsText, requiredCount) {
    const memberMentions = mentionsText.match(/<@!?(\d+)>/g) || [];
    const memberIds = memberMentions.map(mention => mention.match(/\d+/)[0]);

    if (memberIds.length !== requiredCount) {
      throw new Error(`❌ Debes mencionar exactamente ${requiredCount} jugadores`);
    }

    // Verificar IDs únicos
    const uniqueIds = new Set(memberIds);
    if (uniqueIds.size !== memberIds.length) {
      throw new Error('❌ No puedes mencionar al mismo usuario más de una vez');
    }

    return memberIds;
  }

  // Validar que un usuario existe en el servidor
  static async validateGuildMember(guild, userId) {
    try {
      const member = await guild.members.fetch(userId);
      return member;
    } catch (error) {
      throw new Error(`❌ Usuario <@${userId}> no encontrado en el servidor`);
    }
  }

  // Validar múltiples usuarios
  static async validateGuildMembers(guild, userIds) {
    const members = [];
    
    for (const userId of userIds) {
      const member = await this.validateGuildMember(guild, userId);
      members.push(member);
    }

    return members;
  }

  // Validar que el bot tenga permisos necesarios
  static validateBotPermissions(guild, requiredPermissions) {
    const botMember = guild.members.cache.get(guild.client.user.id);
    
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
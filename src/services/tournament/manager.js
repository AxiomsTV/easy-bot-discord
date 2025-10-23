// Servicio principal para gestión de torneos

import { Tournament } from '../../models/Tournament.js';
import { Team } from '../../models/Team.js';
import { ERROR_MESSAGES } from '../../utils/constants.js';
import { googleSheetsService } from '../google/sheets.js';
import ScoringService from './scoring.js';

class TournamentManager {
  constructor() {
    this.activeTournament = null;
    this.registeredTeams = [];
  }

  // Gestión de torneos
  createTournament({
    name,
    maxTeams,
    teamSize,
    format,
    game,
    createdBy,
    categoryId,
    channels,
    roles
  }) {
    if (this.hasActiveTournament()) {
      throw new Error(ERROR_MESSAGES.TOURNAMENT_EXISTS);
    }

    this.activeTournament = new Tournament({
      name,
      maxTeams,
      teamSize,
      format,
      game,
      createdBy,
      categoryId,
      channels,
      roles
    });

    this.registeredTeams = [];
    return this.activeTournament;
  }

  deleteTournament() {
    this.activeTournament = null;
    this.registeredTeams = [];
  }

  hasActiveTournament() {
    return this.activeTournament !== null;
  }

  getActiveTournament() {
    return this.activeTournament;
  }

  // Gestión de equipos
  async registerTeam({ name, tag, captain, members }) {
    if (!this.hasActiveTournament()) {
      throw new Error(ERROR_MESSAGES.NO_ACTIVE_TOURNAMENT);
    }

    if (!this.activeTournament.isRegistrationOpen()) {
      throw new Error(ERROR_MESSAGES.REGISTRATION_CLOSED);
    }

    if (!this.activeTournament.canRegisterMoreTeams(this.registeredTeams.length)) {
      throw new Error(ERROR_MESSAGES.TOURNAMENT_FULL);
    }

    // Verificar nombre duplicado
    if (this.isTeamNameTaken(name)) {
      throw new Error(ERROR_MESSAGES.TEAM_NAME_EXISTS);
    }

    // Verificar usuarios ya registrados
    const allUserIds = [captain.id, ...members.map(m => m.id)];
    for (const userId of allUserIds) {
      const existingTeam = this.findTeamByMember(userId);
      if (existingTeam) {
        throw new Error(
          ERROR_MESSAGES.USER_ALREADY_IN_TEAM
            .replace('{}', `<@${userId}>`)
            .replace('{}', existingTeam.name)
        );
      }
    }

    // Verificar tamaño del equipo
    if (members.length !== this.activeTournament.teamSize - 1) {
      throw new Error(
        ERROR_MESSAGES.INVALID_TEAM_SIZE
          .replace('{}', this.activeTournament.teamSize)
      );
    }

    const team = new Team({
      name,
      tag,
      captain,
      members,
      tournamentId: this.activeTournament.id
    });

    this.registeredTeams.push(team);

    // Guardar en Google Sheets
    try {
      const teamData = {
        name: team.name,
        captain: team.captain.username,
        players: [team.captain.username, ...team.members.map(m => m.username)],
        captainDiscord: `${team.captain.username}#${team.captain.discriminator}`,
        userId: team.captain.id
      };
      
      await googleSheetsService.registerTeam(teamData, this.activeTournament.id);
      console.log(`📊 Equipo "${team.name}" guardado en Google Sheets`);
    } catch (error) {
      console.error('⚠️  Error al guardar en Google Sheets:', error.message);
      // No fallar el registro si Google Sheets falla
    }

    return team;
  }

  unregisterTeam(teamId) {
    this.registeredTeams = this.registeredTeams.filter(team => team.id !== teamId);
  }

  getRegisteredTeams() {
    return this.registeredTeams;
  }

  getTeamCount() {
    return this.registeredTeams.length;
  }

  // Búsquedas
  findTeamByName(name) {
    return this.registeredTeams.find(team => 
      team.name.toLowerCase() === name.toLowerCase()
    );
  }

  findTeamByMember(userId) {
    return this.registeredTeams.find(team => team.hasMember(userId));
  }

  findTeamById(teamId) {
    return this.registeredTeams.find(team => team.id === teamId);
  }

  findTeamByChannelName(channelName) {
    // Quitar solo el prefijo del tipo de canal (txt-, 📝-), NO quitar team- o equipo-
    let cleanChannelName = channelName
      .replace(/^txt-/, '')      // Quitar txt-
      .replace(/^📝-/, '');      // Quitar 📝-
    
    // Normalizar: minúsculas, espacios → guiones
    let normalizedChannelName = cleanChannelName
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    console.log(`🔍 Buscando equipo para canal: "${channelName}" → limpio: "${cleanChannelName}" → normalizado: "${normalizedChannelName}"`);
    
    const found = this.registeredTeams.find(team => {
      // Normalizar el nombre del equipo de la misma forma
      const normalizedTeamName = team.name.toLowerCase().replace(/\s+/g, '-');
      console.log(`   Comparando con equipo: "${team.name}" → normalizado: "${normalizedTeamName}"`);
      return normalizedTeamName === normalizedChannelName;
    });
    
    if (found) {
      console.log(`✅ Equipo encontrado: ${found.name}`);
    } else {
      console.log(`❌ No se encontró equipo para: ${normalizedChannelName}`);
      console.log(`   Equipos registrados: ${this.registeredTeams.map(t => t.name).join(', ')}`);
    }
    
    return found;
  }

  isTeamNameTaken(name) {
    return this.findTeamByName(name) !== undefined;
  }

  isUserRegistered(userId) {
    return this.findTeamByMember(userId) !== undefined;
  }

  // Validaciones
  canStartTournament() {
    return this.hasActiveTournament() && 
           this.getTeamCount() >= 2 && 
           this.activeTournament.isRegistrationOpen();
  }

  // Estado del torneo
  getTournamentStatus() {
    if (!this.hasActiveTournament()) {
      return null;
    }

    return {
      tournament: this.activeTournament,
      teams: this.registeredTeams,
      teamCount: this.getTeamCount(),
      canStart: this.canStartTournament(),
      isFull: !this.activeTournament.canRegisterMoreTeams(this.getTeamCount())
    };
  }

  // Gestión de resultados
  async submitResult({ teamName, position, totalKills, submittedBy, userId }) {
    if (!this.hasActiveTournament()) {
      throw new Error(ERROR_MESSAGES.NO_ACTIVE_TOURNAMENT);
    }

    // Verificar que el equipo existe
    const team = this.findTeamByName(teamName);
    if (!team) {
      throw new Error(`No se encontró el equipo "${teamName}"`);
    }

    // Validar datos de entrada
    if (!ScoringService.isValidPosition(position)) {
      throw new Error('❌ La posición debe ser un número entre 1 y 15');
    }

    if (!ScoringService.isValidKills(totalKills)) {
      throw new Error('❌ Los kills deben ser un número entre 0 y 999');
    }

    // Calcular puntuación con multiplicadores
    const scoreData = ScoringService.calculateTeamScore(totalKills, position);

    // Guardar en Google Sheets
    try {
      const resultData = {
        teamName,
        position,
        totalKills,
        multiplier: scoreData.multiplier,
        finalScore: scoreData.finalScore,
        submittedBy,
        userId
      };
      
      await googleSheetsService.submitResult(resultData, this.activeTournament.id);
      console.log(`📊 Resultado para "${teamName}" guardado en Google Sheets`);
      console.log(`🎯 Puntuación: ${totalKills} kills × ${scoreData.multiplier} = ${scoreData.finalScore} puntos`);
      
      return {
        success: true,
        scoreData,
        message: `✅ Resultado guardado para **${teamName}**\n🎯 **${totalKills}** kills × **${scoreData.multiplier}** = **${scoreData.finalScore}** puntos`
      };
    } catch (error) {
      console.error('⚠️  Error al guardar resultado en Google Sheets:', error.message);
      throw new Error('Error al guardar el resultado. Inténtalo de nuevo.');
    }
  }

  // Persistencia (para futuro uso con base de datos)
  exportData() {
    return {
      tournament: this.activeTournament?.toJSON() || null,
      teams: this.registeredTeams.map(team => team.toJSON())
    };
  }

  importData(data) {
    this.activeTournament = data.tournament ? Tournament.fromJSON(data.tournament) : null;
    this.registeredTeams = data.teams.map(teamData => Team.fromJSON(teamData));
  }
}

// Singleton instance
export const tournamentManager = new TournamentManager();
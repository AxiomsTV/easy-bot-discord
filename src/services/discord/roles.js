// Servicio para gestión de roles de Discord

import { TOURNAMENT_COLORS } from '../../utils/constants.js';

export class RoleService {
  // Crear rol de participante del torneo
  static async createParticipantRole(guild, tournamentName) {
    const role = await guild.roles.create({
      name: `${tournamentName} Participant`,
      color: TOURNAMENT_COLORS.primary,
      hoist: true,
      mentionable: true
    });

    return role;
  }

  // Asignar rol de participante a miembros del equipo
  static async assignParticipantRole(guild, memberIds, roleId) {
    const role = guild.roles.cache.get(roleId);
    if (!role) return;

    const results = [];
    for (const memberId of memberIds) {
      try {
        const member = await guild.members.fetch(memberId);
        await member.roles.add(role);
        results.push({ memberId, success: true });
      } catch (error) {
        console.error(`Error asignando rol a ${memberId}:`, error);
        results.push({ memberId, success: false, error });
      }
    }

    return results;
  }

  // Asignar rol específico del equipo
  static async assignTeamRole(guild, memberIds, roleId) {
    const role = guild.roles.cache.get(roleId);
    if (!role) return;

    const results = [];
    for (const memberId of memberIds) {
      try {
        const member = await guild.members.fetch(memberId);
        await member.roles.add(role);
        results.push({ memberId, success: true });
      } catch (error) {
        console.error(`Error asignando rol de equipo a ${memberId}:`, error);
        results.push({ memberId, success: false, error });
      }
    }

    return results;
  }

  // Remover rol de participante
  static async removeParticipantRole(guild, memberIds, roleId) {
    const role = guild.roles.cache.get(roleId);
    if (!role) return;

    const results = [];
    for (const memberId of memberIds) {
      try {
        const member = await guild.members.fetch(memberId);
        await member.roles.remove(role);
        results.push({ memberId, success: true });
      } catch (error) {
        console.error(`Error removiendo rol de ${memberId}:`, error);
        results.push({ memberId, success: false, error });
      }
    }

    return results;
  }

  // Eliminar rol del torneo
  static async deleteTournamentRole(guild, roleId) {
    try {
      let deletedCount = 0;
      
      // Eliminar el rol específico si existe
      if (roleId) {
        const role = guild.roles.cache.get(roleId);
        if (role) {
          await role.delete();
          deletedCount++;
          console.log(`✅ Rol eliminado: ${role.name}`);
        }
      }
      
      // Eliminar TODOS los roles que contengan "Participant", "Team" o nombres de torneos
      const rolesToDelete = guild.roles.cache.filter(role => 
        role.name.includes('Participant') ||
        role.name.includes('CUSTOMS') ||
        role.name.includes('Tournament') ||
        role.name.toLowerCase().startsWith('team ') ||
        role.name.toLowerCase().includes(' team') ||
        role.name.toUpperCase().startsWith('TEAM ') // Roles como "TEAM PEPE"
      );
      
      for (const [, role] of rolesToDelete) {
        try {
          await role.delete();
          deletedCount++;
          console.log(`✅ Rol eliminado: ${role.name}`);
          await new Promise(resolve => setTimeout(resolve, 300)); // Evitar rate limit
        } catch (error) {
          console.error(`Error eliminando rol ${role.name}:`, error.message);
        }
      }
      
      console.log(`✅ Total de roles eliminados: ${deletedCount}`);
      
    } catch (error) {
      console.error('Error eliminando rol del torneo:', error);
    }
  }

  // Crear roles específicos por equipo
  static async createTeamRole(guild, teamName, tournamentName) {
    // Colores variados para diferentes equipos
    const teamColors = [
      0xFF6B6B, // Rojo
      0x4ECDC4, // Cyan
      0xFFE66D, // Amarillo
      0x95E1D3, // Verde agua
      0xF38181, // Rosa
      0xAA96DA, // Morado
      0xFCBF49, // Naranja
      0x06FFA5, // Verde neón
      0x5DADE2, // Azul
      0xF8B500  // Dorado
    ];
    
    // Seleccionar color basado en el hash del nombre del equipo
    const colorIndex = teamName.length % teamColors.length;
    
    const role = await guild.roles.create({
      name: teamName,
      color: teamColors[colorIndex],
      hoist: true, // Mostrar miembros separados en la lista
      mentionable: true
    });

    return role;
  }
}
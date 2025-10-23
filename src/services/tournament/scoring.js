// Servicio para manejar el sistema de puntuación por kills para Warzone
// Sistema de Multiplicadores:
// 🥇 1° lugar = x1.6
// 🥈 2° – 5° = x1.4
// 🥉 6° – 10° = x1.2
// 🔟 11° – 15° = x1.0
// Puntuación Final = Total Kills del Equipo × Multiplicador de Posición

import { SCORING_SYSTEM } from '../../utils/constants.js';

/**
 * Servicio para calcular puntuaciones con multiplicadores de Warzone
 */
export class ScoringService {
  
  /**
   * Calcula la puntuación final de un equipo
   * @param {number} totalKills - Total de kills del equipo
   * @param {number} position - Posición final del equipo (1-15)
   * @returns {Object} Información completa de la puntuación
   */
  static calculateTeamScore(totalKills, position) {
    const positionInfo = SCORING_SYSTEM.getPositionInfo(position);
    const multiplier = positionInfo.multiplier;
    const finalScore = Math.round(totalKills * multiplier);
    
    return {
      totalKills,
      position,
      multiplier,
      finalScore,
      positionInfo
    };
  }
  
  /**
   * Genera embed con información de puntuación
   * @param {Object} scoreData - Datos de puntuación del equipo
   * @param {string} teamName - Nombre del equipo
   * @param {string} language - Idioma ('en' o 'es')
   * @returns {Object} Datos para el embed
   */
  static generateScoreEmbed(scoreData, teamName, language = 'es') {
    const { totalKills, position, multiplier, finalScore, positionInfo } = scoreData;
    const lang = language === 'en' ? 'en' : 'es';
    
    const title = language === 'en' 
      ? `🎯 Score Calculation for ${teamName}`
      : `🎯 Cálculo de Puntuación para ${teamName}`;
    
    const description = language === 'en'
      ? `**Position:** ${positionInfo.label[lang]} ${positionInfo.emoji}\n**Total Kills:** ${totalKills}\n**Multiplier:** x${multiplier}\n**Final Score:** **${finalScore} points**`
      : `**Posición:** ${positionInfo.label[lang]} ${positionInfo.emoji}\n**Total Kills:** ${totalKills}\n**Multiplicador:** x${multiplier}\n**Puntuación Final:** **${finalScore} puntos**`;
    
    return {
      title,
      description,
      color: this.getColorByPosition(position),
      thumbnail: this.getThumbnailByPosition(position)
    };
  }
  
  /**
   * Obtiene color según la posición
   * @param {number} position - Posición del equipo
   * @returns {string} Color hexadecimal
   */
  static getColorByPosition(position) {
    if (position === 1) return '#FFD700'; // Oro
    if (position <= 5) return '#C0C0C0'; // Plata
    if (position <= 10) return '#CD7F32'; // Bronce
    return '#808080'; // Gris
  }
  
  /**
   * Obtiene thumbnail según la posición
   * @param {number} position - Posición del equipo
   * @returns {string} URL del thumbnail o null
   */
  static getThumbnailByPosition(position) {
    // Podrías agregar URLs de imágenes aquí
    return null;
  }
  
  /**
   * Genera la tabla de multiplicadores
   * @param {string} language - Idioma ('en' o 'es')
   * @returns {string} Texto formateado con los multiplicadores
   */
  static getMultipliersTable(language = 'es') {
    const title = language === 'en' 
      ? '📊 **Multipliers / Multiplicadores**'
      : '📊 **Multiplicadores / Multipliers**';
    
    const ranges = SCORING_SYSTEM.POSITION_RANGES.map(range => {
      const enLabel = range.label.en;
      const esLabel = range.label.es;
      return `${range.emoji} EN: ${enLabel} = x${range.multiplier} | ES: ${esLabel} = x${range.multiplier}`;
    }).join('\n\n');
    
    const note = language === 'en'
      ? '\n\n💡 **Note:** Final score = Total team kills × Position multiplier'
      : '\n\n💡 **Nota:** Puntuación final = Total kills del equipo × Multiplicador de posición';
    
    return `${title}\n\n${ranges}${note}`;
  }
  
  /**
   * Valida que una posición sea válida
   * @param {number} position - Posición a validar
   * @returns {boolean} True si es válida
   */
  static isValidPosition(position) {
    return Number.isInteger(position) && position >= 1 && position <= 15;
  }
  
  /**
   * Valida que los kills sean válidos
   * @param {number} kills - Kills a validar
   * @returns {boolean} True si es válido
   */
  static isValidKills(kills) {
    return Number.isInteger(kills) && kills >= 0 && kills <= 999;
  }
  
  /**
   * Genera leaderboard ordenado por puntuación final
   * @param {Array} teams - Array de equipos con sus puntuaciones
   * @param {string} language - Idioma
   * @returns {string} Leaderboard formateado
   */
  static generateLeaderboard(teams, language = 'es') {
    const title = language === 'en' ? '🏆 **Final Leaderboard**' : '🏆 **Clasificación Final**';
    
    const sortedTeams = teams
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((team, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        return `${medal} **${team.name}** - ${team.finalScore} pts (${team.totalKills} kills × ${team.multiplier})`;
      })
      .join('\n');
    
    return `${title}\n\n${sortedTeams}`;
  }
}

export default ScoringService;
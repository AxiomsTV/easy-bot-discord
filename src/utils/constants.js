// Constantes del sistema de torneos

// Colores del tema
export const TOURNAMENT_COLORS = {
  primary: '#ff6b35',
  success: '#4caf50', 
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3'
};

// Emojis por estado
export const STATUS_EMOJIS = {
  'registration': '🟢',
  'in-progress': '🟡',
  'finished': '🔴'
};

// Emojis por formato
export const FORMAT_EMOJIS = {
  'single': '🏁',
  'double': '🔄',
  'round-robin': '🏆',
  'swiss': '🎯'
};

// Emojis por juego
export const GAME_EMOJIS = {
  'warzone': '🎮',
  'valorant': '�',
  'lol': '⚔️',
  'cs2': '🔫',
  'rl': '🏈',
  'other': '🎯'
};

// Límites del sistema
export const LIMITS = {
  MAX_TEAMS: 64,
  MIN_TEAMS: 4,
  MAX_TEAM_SIZE: 10,
  MIN_TEAM_SIZE: 1,
  MAX_TOURNAMENT_NAME: 50,
  MIN_TOURNAMENT_NAME: 3,
  MAX_TEAM_NAME: 32,
  MIN_TEAM_NAME: 2,
  MAX_TEAM_TAG: 5,
  MIN_TEAM_TAG: 2
};

// Formatos de torneo disponibles (Texto libre - Ej: Tríos, Solos, Duos, Cuartetos)
// NOTA: El formato ahora es texto libre para mayor flexibilidad
export const TOURNAMENT_FORMATS = [
  { name: '🏁 Eliminación Simple', value: 'single' },
  { name: '🔄 Eliminación Doble', value: 'double' },
  { name: '🏆 Round Robin', value: 'round-robin' },
  { name: '🎯 Swiss System', value: 'swiss' }
];

// Juegos soportados (Principal: Warzone)
export const SUPPORTED_GAMES = [
  { name: '🎮 Call of Duty: Warzone', value: 'warzone' },
  { name: '🎯 Otro', value: 'other' }
];

// Estados del torneo
export const TOURNAMENT_STATUS = {
  REGISTRATION: 'registration',
  IN_PROGRESS: 'in-progress',
  FINISHED: 'finished'
};

// Tipos de canales del torneo
export const CHANNEL_TYPES = {
  ANNOUNCEMENTS: 'announcements',
  REGISTRATION: 'registration',
  BRACKETS: 'brackets',
  TEAM_PRIVATE: 'team-private'
};

// Sistema de puntuación por kills con multiplicadores
export const SCORING_SYSTEM = {
  // Multiplicadores por posición
  MULTIPLIERS: {
    1: 1.6,      // 1st place
    2: 1.4,      // 2nd-5th place  
    3: 1.4,
    4: 1.4,
    5: 1.4,
    6: 1.2,      // 6th-10th place
    7: 1.2,
    8: 1.2,
    9: 1.2,
    10: 1.2,
    11: 1.0,     // 11th-15th place
    12: 1.0,
    13: 1.0,
    14: 1.0,
    15: 1.0
  },
  
  // Rangos de posiciones para display
  POSITION_RANGES: [
    { min: 1, max: 1, multiplier: 1.6, emoji: '🥇', label: { en: '1st', es: '1°' } },
    { min: 2, max: 5, multiplier: 1.4, emoji: '🥈', label: { en: '2nd – 5th', es: '2° – 5°' } },
    { min: 6, max: 10, multiplier: 1.2, emoji: '🥉', label: { en: '6th – 10th', es: '6° – 10°' } },
    { min: 11, max: 15, multiplier: 1.0, emoji: '🔟', label: { en: '11th – 15th', es: '11° – 15°' } }
  ],
  
  // Función para calcular puntos finales
  calculateFinalScore: (kills, position) => {
    const multiplier = SCORING_SYSTEM.MULTIPLIERS[position] || 1.0;
    return Math.round(kills * multiplier);
  },
  
  // Función para obtener info de posición
  getPositionInfo: (position) => {
    const range = SCORING_SYSTEM.POSITION_RANGES.find(r => position >= r.min && position <= r.max);
    return range || { multiplier: 1.0, emoji: '📊', label: { en: `${position}th`, es: `${position}°` } };
  }
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NO_PERMISSIONS: '❌ **Sin permisos:** Solo los administradores pueden usar esta función.',
  NO_ACTIVE_TOURNAMENT: '❌ No hay torneos activos en este momento.',
  TOURNAMENT_EXISTS: '⚠️ Ya hay un torneo activo. Usa `/tournament-dashboard` para verlo.',
  REGISTRATION_CLOSED: '❌ El registro para este torneo está cerrado.',
  TOURNAMENT_FULL: '❌ El torneo está lleno. No se pueden registrar más equipos.',
  ALREADY_REGISTERED: '❌ Ya estás registrado en un equipo.',
  TEAM_NAME_EXISTS: '❌ Ya existe un equipo con ese nombre.',
  INVALID_TEAM_SIZE: 'Debes mencionar exactamente {} jugadores.',
  INVALID_USERS: '❌ Uno o más usuarios mencionados no son válidos.',
  USER_ALREADY_IN_TEAM: '{} ya está registrado en el equipo **{}**.'
};
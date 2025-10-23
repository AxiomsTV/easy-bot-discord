// Comando /tournament-setup

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { TOURNAMENT_FORMATS, SUPPORTED_GAMES, LIMITS } from '../../utils/constants.js';
import { handleTournamentSetup } from '../../interactions/commands/setup.js';

export const data = new SlashCommandBuilder()
  .setName('tournament-setup')
  .setDescription('🏆 Configurar un nuevo torneo competitivo')
  .addStringOption(o => o
    .setName('name')
    .setDescription('Nombre del torneo')
    .setRequired(true)
    .setMinLength(LIMITS.MIN_TOURNAMENT_NAME)
    .setMaxLength(LIMITS.MAX_TOURNAMENT_NAME)
  )
  .addIntegerOption(o => o
    .setName('max-teams')
    .setDescription(`Número máximo de equipos (${LIMITS.MIN_TEAMS}-${LIMITS.MAX_TEAMS})`)
    .setRequired(true)
    .setMinValue(LIMITS.MIN_TEAMS)
    .setMaxValue(LIMITS.MAX_TEAMS)
  )
  .addIntegerOption(o => o
    .setName('team-size')
    .setDescription(`Jugadores por equipo (${LIMITS.MIN_TEAM_SIZE}-${LIMITS.MAX_TEAM_SIZE})`)
    .setRequired(true)
    .setMinValue(LIMITS.MIN_TEAM_SIZE)
    .setMaxValue(LIMITS.MAX_TEAM_SIZE)
  )
  .addStringOption(o => o
    .setName('format')
    .setDescription('Formato del torneo (Ej: Tríos, Solos, Duos, Cuartetos, etc.)')
    .setRequired(true)
    .setMinLength(2)
    .setMaxLength(30)
  )
  .addStringOption(o => o
    .setName('game')
    .setDescription('Juego del torneo')
    .setRequired(false)
    .addChoices({ name: '🎮 Call of Duty: Warzone', value: 'warzone' }, { name: '🎯 Otro', value: 'other' })
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = handleTournamentSetup;
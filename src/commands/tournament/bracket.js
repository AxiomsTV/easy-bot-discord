// Comando /tournament-bracket

import { SlashCommandBuilder } from 'discord.js';
import { handleTournamentBracket } from '../../interactions/commands/bracket.js';

export const data = new SlashCommandBuilder()
  .setName('tournament-bracket')
  .setDescription('🏆 Ver el bracket actual del torneo');

export const execute = handleTournamentBracket;
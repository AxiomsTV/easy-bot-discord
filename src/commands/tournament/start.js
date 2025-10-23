// Comando /tournament-start

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { handleTournamentStart } from '../../interactions/commands/start.js';

export const data = new SlashCommandBuilder()
  .setName('tournament-start')
  .setDescription('🚀 Iniciar el torneo y generar brackets')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = handleTournamentStart;
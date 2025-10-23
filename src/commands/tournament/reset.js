// Comando /tournament-reset

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { handleTournamentReset } from '../../interactions/commands/reset.js';

export const data = new SlashCommandBuilder()
  .setName('tournament-reset')
  .setDescription('🗑️ Eliminar torneo actual y limpiar todo')
  .addBooleanOption(o => o
    .setName('confirm')
    .setDescription('¿Confirmas que quieres borrar todo?')
    .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = handleTournamentReset;
// Comando /tournament-panel - Panel de control principal con botones

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { handleTournamentPanel } from '../../interactions/commands/panel.js';

export const data = new SlashCommandBuilder()
  .setName('tournament-panel')
  .setDescription('🎮 Abrir el panel de control interactivo del torneo')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = handleTournamentPanel;

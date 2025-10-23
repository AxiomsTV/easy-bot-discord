// Comando /panel - Atajo para el panel de control

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { handleTournamentPanel } from '../../interactions/commands/panel.js';

export const data = new SlashCommandBuilder()
  .setName('panel')
  .setDescription('🎮 Abrir panel de administración del torneo')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = handleTournamentPanel;

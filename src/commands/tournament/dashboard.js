// Comando /tournament-dashboard

import { SlashCommandBuilder } from 'discord.js';
import { handleTournamentDashboard } from '../../interactions/commands/dashboard.js';

export const data = new SlashCommandBuilder()
  .setName('tournament-dashboard')
  .setDescription('📊 Ver estadísticas y estado del torneo');

export const execute = handleTournamentDashboard;
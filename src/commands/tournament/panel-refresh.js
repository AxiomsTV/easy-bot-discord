import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('panel-refresh')
  .setDescription('🔄 Borra y recrea el panel de administración con todos los botones actualizados');

export async function execute(interaction) {
  const { handlePanelRefresh } = await import('../../interactions/commands/panel.js');
  await handlePanelRefresh(interaction);
}

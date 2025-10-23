import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

// Comandos exclusivos del sistema de torneos único
export const commands = [
  new SlashCommandBuilder()
    .setName('tournament-setup')
    .setDescription('🏆 Configurar un nuevo torneo competitivo')
    .addStringOption(o => o.setName('name').setDescription('Nombre del torneo').setRequired(true).setMinLength(3).setMaxLength(50))
    .addIntegerOption(o => o.setName('max-teams').setDescription('Número máximo de equipos (4-64)').setRequired(true).setMinValue(4).setMaxValue(64))
    .addIntegerOption(o => o.setName('team-size').setDescription('Jugadores por equipo (1-10)').setRequired(true).setMinValue(1).setMaxValue(10))
    .addStringOption(o => o.setName('format').setDescription('Formato del torneo').setRequired(true)
      .addChoices(
        { name: '🏁 Eliminación Simple', value: 'single' },
        { name: '🔄 Eliminación Doble', value: 'double' },
        { name: '🏆 Round Robin', value: 'round-robin' },
        { name: '🎯 Swiss System', value: 'swiss' }
      ))
    .addStringOption(o => o.setName('game').setDescription('Juego del torneo').setRequired(false)
      .addChoices(
        { name: '🎮 Valorant', value: 'valorant' },
        { name: '⚔️ League of Legends', value: 'lol' },
        { name: '🔫 CS2', value: 'cs2' },
        { name: '🏈 Rocket League', value: 'rl' },
        { name: '🎯 Otro', value: 'other' }
      ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('tournament-dashboard')
    .setDescription('📊 Ver estadísticas y estado del torneo'),

  new SlashCommandBuilder()
    .setName('tournament-start')
    .setDescription('🚀 Iniciar el torneo y generar brackets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('tournament-bracket')
    .setDescription('🏆 Ver el bracket actual del torneo'),

  new SlashCommandBuilder()
    .setName('tournament-reset')
    .setDescription('🗑️ Eliminar torneo actual y limpiar todo')
    .addBooleanOption(o => o.setName('confirm').setDescription('¿Confirmas que quieres borrar todo?').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('panel')
    .setDescription('🎮 Abrir panel de administración del torneo')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];
// Script para limpiar comandos duplicados
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

config();

const rest = new REST().setToken(process.env.BOT_TOKEN);

async function cleanCommands() {
  try {
    console.log('🧹 Limpiando comandos duplicados...');
    
    // Limpiar comandos del servidor
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: [] }
      );
      console.log('✅ Comandos del servidor limpiados');
    }
    
    // Limpiar comandos globales
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('✅ Comandos globales limpiados');
    
    console.log('✅ Limpieza completada. Reinicia el bot con "npm start"');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error limpiando comandos:', error);
    process.exit(1);
  }
}

cleanCommands();

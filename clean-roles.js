// Script para limpiar roles duplicados
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', async () => {
  console.log('🤖 Bot conectado, limpiando roles...');
  
  try {
    const guildId = process.env.GUILD_ID;
    const guild = await client.guilds.fetch(guildId);
    
    console.log(`\n📋 Servidor: ${guild.name}`);
    
    // Obtener todos los roles
    const roles = await guild.roles.fetch();
    
    // Filtrar roles que contengan "Participant" o "CUSTOMS" o "REBIRTH" o "EWC"
    const rolesToDelete = roles.filter(role => 
      role.name.includes('Participant') || 
      role.name.includes('CUSTOMS') ||
      role.name.includes('REBIRTH') ||
      role.name.includes('EWC') ||
      role.name.includes('MP 150') ||
      role.name.includes('ewc')
    );
    
    console.log(`\n🗑️  Roles a eliminar: ${rolesToDelete.size}`);
    
    for (const [id, role] of rolesToDelete) {
      try {
        console.log(`   Eliminando: ${role.name}`);
        await role.delete('Limpieza de roles duplicados');
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms entre eliminaciones
      } catch (error) {
        console.log(`   ❌ No se pudo eliminar: ${role.name} (${error.message})`);
      }
    }
    
    console.log('\n✅ Limpieza completada');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
});

client.login(process.env.BOT_TOKEN);

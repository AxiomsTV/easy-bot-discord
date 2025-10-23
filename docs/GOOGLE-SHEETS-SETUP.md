# 📊 Configuración de Google Sheets - Guía Completa

Esta guía te ayudará a configurar la integración con Google Sheets para que el bot guarde automáticamente todos los datos del torneo.

## 🎯 ¿Qué se guarda en Google Sheets?

El bot creará automáticamente estas hojas en tu Google Sheets:

### 📋 **Registros** 
- Fecha y hora del registro
- Nombre del equipo
- Capitán del equipo
- Lista de jugadores
- Discord del capitán
- ID del usuario que registró

### 📊 **Resultados**
- Fecha y hora del envío
- Nombre del equipo
- Posición final
- Número de eliminations
- Usuario que envió el resultado
- ID del usuario

### ✅ **Check-ins**
- Fecha y hora del check-in
- Nombre del equipo
- Usuario que hizo check-in
- ID del usuario

### 🏆 **Torneos**
- Fecha de creación
- Nombre del torneo
- Tipo de torneo (Liga/Eliminación/Grupos)
- Número máximo de equipos
- Usuario que creó el torneo
- Estado del torneo

---

## 🚀 Configuración Paso a Paso

### Paso 1: Crear Proyecto en Google Cloud Platform

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

### Paso 2: Habilitar Google Sheets API

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca **"Google Sheets API"**
3. Haz clic en **"Google Sheets API"** y luego **"HABILITAR"**

### Paso 3: Crear Cuenta de Servicio

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"Cuenta de servicio"**
4. Completa los datos:
   - **Nombre:** `bot-torneo-service`
   - **Descripción:** `Cuenta de servicio para el bot de torneo`
5. Haz clic en **"CREAR Y CONTINUAR"**
6. En "Otorgar acceso", puedes dejarlo vacío por ahora
7. Haz clic en **"LISTO"**

### Paso 4: Generar Clave Privada

1. En la lista de cuentas de servicio, haz clic en la que acabas de crear
2. Ve a la pestaña **"CLAVES"**
3. Haz clic en **"AGREGAR CLAVE" > "Crear clave nueva"**
4. Selecciona **"JSON"** y haz clic en **"CREAR"**
5. Se descargará un archivo JSON - **¡GUÁRDALO SEGURO!**

### Paso 5: Crear Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com/)
2. Crea una nueva hoja de cálculo
3. Ponle un nombre como "Torneo Bot - Datos"
4. Copia el ID de la hoja desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```

### Paso 6: Compartir la Hoja con el Bot

1. En tu Google Sheets, haz clic en **"Compartir"**
2. En el email, pega el email de la cuenta de servicio (está en el archivo JSON que descargaste)
3. Selecciona **"Editor"** como permiso
4. Haz clic en **"Enviar"**

### Paso 7: Configurar Variables de Entorno

Abre el archivo JSON descargado y busca estos valores:

```json
{
  "client_email": "bot-torneo-service@tu-proyecto.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\ntu_clave_aqui\n-----END PRIVATE KEY-----"
}
```

Crea o edita tu archivo `.env`:

```env
# Discord (requerido)
TOKEN=tu_token_del_bot
GUILD_ID=tu_guild_id

# Google Sheets (opcional)
GOOGLE_SHEETS_ID=1abc123def456ghi789jkl
GOOGLE_SERVICE_ACCOUNT_EMAIL=bot-torneo-service@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
```

⚠️ **IMPORTANTE:** En la clave privada, asegúrate de que los saltos de línea estén como `\n` dentro de las comillas.

---

## 🔧 Instalación de Dependencias

Asegúrate de tener Node.js instalado, luego ejecuta:

```bash
npm install googleapis
```

O si tienes el package.json actualizado:

```bash
npm install
```

---

## ✅ Verificación

Una vez configurado todo:

1. Ejecuta el bot: `npm start`
2. Verifica en la consola estos mensajes:
   ```
   ✅ Google Sheets inicializado correctamente
   ✅ Bot conectado como TuBot#1234
   ```

3. Prueba un comando como `/setup` y verifica que se cree la hoja "Torneos" automáticamente

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch"
- Verifica que hayas habilitado Google Sheets API
- Confirma que el GOOGLE_SHEETS_ID sea correcto

### Error: "Insufficient permissions"  
- Asegúrate de haber compartido la hoja con el email de la cuenta de servicio
- Verifica que el permiso sea "Editor"

### Error: "Invalid credentials"
- Revisa que GOOGLE_SERVICE_ACCOUNT_EMAIL sea correcto
- Verifica que GOOGLE_PRIVATE_KEY esté copiada completa con los `\n`

### Sin errores pero no se guardan datos
- Verifica que todas las variables de entorno estén configuradas
- Revisa que la hoja de Google esté compartida correctamente

### El bot funciona pero dice "usando almacenamiento local"
- Significa que las variables de Google Sheets no están configuradas
- El bot seguirá funcionando, pero solo guardará en archivos JSON locales

---

## 🔐 Seguridad

- **NUNCA** subas el archivo JSON a repositorios públicos
- **NUNCA** compartas las claves privadas
- Usa variables de entorno para credenciales sensibles
- Considera rotar las claves periódicamente

---

## 🎉 ¡Listo!

Una vez configurado, el bot automáticamente:

- ✅ Creará las hojas necesarias en tu Google Sheets
- ✅ Guardará todos los registros de equipos
- ✅ Almacenará resultados de partidas
- ✅ Registrará check-ins de equipos
- ✅ Llevará un historial completo del torneo

¡Ya puedes gestionar torneos completos con control automático en Google Sheets! 📊🎮
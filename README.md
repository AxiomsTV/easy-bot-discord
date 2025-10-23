# 🏆 Easy Tournament Bot

Bot de Discord profesional para gestión de torneos de **Call of Duty: Warzone** con interfaz visual completa e integración de Google Sheets.

## ✨ **NUEVA INTERFAZ VISUAL CON BOTONES**

El bot ahora incluye un **panel de control completo** que hace todo mucho más fácil:
- 🎮 **Panel interactivo**: Todo mediante botones, sin comandos complicados
- 📝 **Formularios automáticos**: Solo completas los campos
- ✅ **Validación en tiempo real**: El bot te guía paso a paso
- 🎯 **Super fácil de usar**: Perfecto para todos

👉 **Usa `/tournament-panel` para acceder al panel de control**

Mira la [Guía Visual Completa](./docs/VISUAL-INTERFACE.md)

## 🚀 Características

- 🎮 **Panel de Control Visual** con botones interactivos (NUEVO)
- 📝 **Formularios guiados** para crear torneos y enviar resultados (NUEVO)
- 📊 **Sistema de puntuación Warzone** con multiplicadores (kills × posición)
- ⚡ **Registro de equipos** por torneo específico
- 🎯 **Envío de resultados** simplificado con cálculo automático
- 🔗 **Integración Google Sheets** para tracking completo
- 📝 **Canales automáticos** por torneo (anuncios, registro, brackets)
- 🎭 **Gestión de permisos** avanzada
- 🏆 **Formato libre** de torneo (Tríos, Solos, Duos, etc.)

## 📁 Estructura del Proyecto

```
easy-bot/
├── src/
│   ├── config/
│   │   └── commands.js      # Definiciones de comandos slash
│   ├── handlers/
│   │   ├── commands.js      # Manejadores de comandos específicos
│   │   └── interactions.js  # Manejadores de interacciones
│   ├── utils/
│   │   ├── channels.js      # Gestión de canales y permisos
│   │   └── data.js          # Integración Google Sheets
│   └── index.js             # Archivo principal del bot
├── docs/
│   └── GOOGLE-SHEETS-SETUP.md
├── data/
│   └── tournament-data.json
├── package.json
└── README.md
```

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd easy-bot
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
BOT_TOKEN=tu_token_del_bot
CLIENT_ID=id_de_tu_aplicacion
GUILD_ID=id_de_tu_servidor
```

4. **Configurar Google Sheets** (opcional)
- Seguir guía en `docs/GOOGLE-SHEETS-SETUP.md`
- Colocar `credentials.json` en la raíz del proyecto

## 🎮 Comandos Disponibles

### 🌟 Panel de Control (RECOMENDADO)

| Comando | Descripción |
|---------|-------------|
| `/tournament-panel` | 🎮 **Panel de control visual con botones** - ¡La forma más fácil! |

### 📋 Comandos Tradicionales

| Comando | Descripción |
|---------|-------------|
| `/tournament-setup` | Crear nuevo torneo (o usa el panel) |
| `/tournament-dashboard` | Ver información del torneo |
| `/tournament-start` | Iniciar torneo y cerrar registros |
| `/tournament-bracket` | Ver brackets del torneo |
| `/tournament-reset` | Reiniciar torneo actual |

### 📖 Documentación Adicional

- 📱 [Guía de Interfaz Visual](./docs/VISUAL-INTERFACE.md) - Cómo usar el panel
- 📊 [Panel Interactivo](./docs/PANEL-INTERFACE.md) - Detalles del panel
- 🎮 [Guía de Warzone](./README-WARZONE.md) - Sistema de puntuación
- 📊 [Google Sheets Setup](./docs/GOOGLE-SHEETS-SETUP.md) - Configuración

## 🔧 Uso

```bash
# Iniciar el bot
npm start

# Modo desarrollo
npm run dev
```

## 📊 Integración Google Sheets

El bot guarda automáticamente:
- ✅ Registro de equipos por torneo
- 📈 Resultados detallados con puntuación
- 👥 Datos de participantes
- 🎮 Códigos de lobby utilizados
- ⏰ Timestamps de todas las actividades

## 🏗️ Arquitectura

- **Modular**: Código organizado en módulos especializados
- **Escalable**: Fácil añadir nuevas funcionalidades
- **Mantenible**: Separación clara de responsabilidades
- **Profesional**: Estándares de la industria

## 🛠️ Tecnologías

- **Discord.js v14**: Framework principal
- **Google Sheets API**: Almacenamiento de datos
- **Node.js ES6**: Módulos modernos
- **dotenv**: Gestión de configuración

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.
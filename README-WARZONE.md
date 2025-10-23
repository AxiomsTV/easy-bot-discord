# 🎮 Bot de Torneos de Warzone

Bot de Discord especializado para gestionar torneos competitivos de **Call of Duty: Warzone** con sistema de puntuación por kills y multiplicadores por posición.

## 🎯 Sistema de Puntuación

El bot utiliza un sistema de puntuación basado en:
- **Total de Kills del Equipo**
- **Multiplicador según Posición Final**

### 📊 Multiplicadores por Posición

| Posición | Multiplicador | Emoji |
|----------|---------------|-------|
| 🥇 1° lugar | x1.6 | 🥇 |
| 🥈 2° – 5° | x1.4 | 🥈 |
| 🥉 6° – 10° | x1.2 | 🥉 |
| 🔟 11° – 15° | x1.0 | 🔟 |

### 💡 Fórmula

```
Puntuación Final = Total Kills del Equipo × Multiplicador de Posición
```

**Ejemplo:**
- Equipo termina en 2° lugar con 25 kills
- Multiplicador: x1.4
- Puntuación Final: 25 × 1.4 = **35 puntos**

## 🏆 Tipos de Torneo

El bot permite **formato libre** para adaptarse a cualquier modalidad de Warzone:

- **Solos** (1 jugador)
- **Duos** (2 jugadores)
- **Tríos** (3 jugadores)
- **Cuartetos** (4 jugadores)
- O cualquier formato personalizado que desees

## 📋 Comandos Principales

### `/tournament-setup`
Crea un nuevo torneo con la siguiente información:
- **name**: Nombre del torneo
- **max-teams**: Número máximo de equipos (4-64)
- **team-size**: Jugadores por equipo (1-10)
- **format**: Formato libre (Ej: "Tríos", "Duos", "Solos")
- **game**: Warzone (por defecto)

### `/tournament-dashboard`
Muestra el panel de control con información del torneo activo.

### `/tournament-start`
Inicia el torneo y cierra el registro de equipos.

### `/tournament-reset`
Reinicia el torneo (solo administradores).

## 📊 Registro de Resultados

Los resultados se guardan automáticamente en **Google Sheets** con los siguientes datos:

1. Fecha y hora
2. Nombre del equipo
3. Posición (1-15)
4. Total de Kills
5. **Multiplicador aplicado**
6. **Puntuación Final**
7. ID del torneo
8. Usuario que envió el resultado
9. ID del usuario

## 🔧 Configuración

1. Configura las credenciales de Google Sheets en `credentials.json`
2. Añade el `GOOGLE_SHEETS_ID` en tu archivo `.env`
3. Invita al bot a tu servidor con permisos de administrador
4. ¡Listo para crear torneos!

## 📈 Características

✅ Sistema de puntuación automático con multiplicadores  
✅ Registro de equipos con validación  
✅ Canales y roles automáticos por torneo  
✅ Integración con Google Sheets  
✅ Formato de torneo personalizable  
✅ Soporte para múltiples equipos  
✅ Leaderboards en tiempo real  

## 🎮 Optimizado para Warzone

Este bot está específicamente diseñado para torneos de Call of Duty: Warzone, siguiendo el sistema de puntuación estándar de competiciones profesionales.

---

Para más información técnica, consulta el [README principal](./README.md).

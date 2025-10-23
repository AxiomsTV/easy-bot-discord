# 🎮 Interfaz Visual del Bot

## 📱 Panel de Control Principal

```
╔════════════════════════════════════════════════╗
║   🎮 Panel de Control - Torneos Warzone       ║
╠════════════════════════════════════════════════╣
║                                                ║
║  ✅ Torneo Activo                              ║
║  Usa los botones para gestionar el torneo     ║
║                                                ║
║  ┌──────────────┬──────────────┬─────────────┐║
║  │ 🏆 Crear     │ 📊 Dashboard │ 🎯 Resultado││║
║  │   Torneo     │              │             │║
║  └──────────────┴──────────────┴─────────────┘║
║                                                ║
║  ┌──────────────┬──────────────┬─────────────┐║
║  │ ▶️ Iniciar   │ 📋 Ver       │ 🔄 Reiniciar││║
║  │   Torneo     │   Equipos    │             │║
║  └──────────────┴──────────────┴─────────────┘║
║                                                ║
║  ┌──────────────┬──────────────────────────────┐
║  │ 📊 Sistema   │ ❓ Ayuda                    │
║  │ Puntuación   │                             │
║  └──────────────┴──────────────────────────────┘
║                                                ║
║  Sistema de Puntuación: Kills × Multiplicador  ║
║  1°=x1.6, 2°-5°=x1.4, 6°-10°=x1.2, 11°-15°=x1.0║
╚════════════════════════════════════════════════╝
```

## 📝 Formulario de Crear Torneo

```
╔════════════════════════════════════════════════╗
║   🏆 Crear Nuevo Torneo                        ║
╠════════════════════════════════════════════════╣
║                                                ║
║  Nombre del Torneo                             ║
║  ┌───────────────────────────────────────────┐ ║
║  │ Copa Warzone 2025                         │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║  Número Máximo de Equipos                      ║
║  ┌───────────────────────────────────────────┐ ║
║  │ 20 (mínimo 4, máximo 64)                  │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║  Jugadores por Equipo                          ║
║  ┌───────────────────────────────────────────┐ ║
║  │ 3 (para Tríos)                            │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║  Formato del Torneo                            ║
║  ┌───────────────────────────────────────────┐ ║
║  │ Tríos Battle Royale                       │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║  Descripción (Opcional)                        ║
║  ┌───────────────────────────────────────────┐ ║
║  │ Torneo competitivo con premios...        │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║            [Enviar]      [Cancelar]            ║
╚════════════════════════════════════════════════╝
```

## 🎯 Formulario de Enviar Resultado

```
╔════════════════════════════════════════════════╗
║   🎯 Enviar Resultado de Equipo                ║
╠════════════════════════════════════════════════╣
║                                                ║
║  Nombre del Equipo                             ║
║  ┌───────────────────────────────────────────┐ ║
║  │ Los Campeones                             │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║  Posición Final (1-15)                         ║
║  ┌───────────────────────────────────────────┐ ║
║  │ 2                                         │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║  Total de Kills del Equipo                     ║
║  ┌───────────────────────────────────────────┐ ║
║  │ 30                                        │ ║
║  └───────────────────────────────────────────┘ ║
║                                                ║
║            [Enviar]      [Cancelar]            ║
╚════════════════════════════════════════════════╝
```

## ✅ Confirmación de Resultado

```
╔════════════════════════════════════════════════╗
║   ✅ Resultado Guardado                        ║
╠════════════════════════════════════════════════╣
║                                                ║
║  Equipo: Los Campeones                         ║
║                                                ║
║  📍 Posición      💀 Total Kills  ✨ Multiplic.║
║     2° lugar 🥈      30 kills        x1.4      ║
║                                                ║
║  🏆 Puntuación Final                           ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  42 puntos                                     ║
║                                                ║
║  📊 Cálculo: 30 × 1.4 = 42                     ║
║                                                ║
║  Registrado por Usuario#1234                   ║
╚════════════════════════════════════════════════╝
```

## 📊 Vista de Sistema de Puntuación

```
╔════════════════════════════════════════════════╗
║   📊 Sistema de Puntuación de Warzone          ║
╠════════════════════════════════════════════════╣
║                                                ║
║  Fórmula: Puntuación = Kills × Multiplicador   ║
║                                                ║
║  🥇 1° Lugar                                   ║
║     Multiplicador: x1.6                        ║
║     Ejemplo: 25 kills × 1.6 = 40 puntos        ║
║                                                ║
║  🥈 2° - 5° Lugar                              ║
║     Multiplicador: x1.4                        ║
║     Ejemplo: 25 kills × 1.4 = 35 puntos        ║
║                                                ║
║  🥉 6° - 10° Lugar                             ║
║     Multiplicador: x1.2                        ║
║     Ejemplo: 25 kills × 1.2 = 30 puntos        ║
║                                                ║
║  🔟 11° - 15° Lugar                            ║
║     Multiplicador: x1.0                        ║
║     Ejemplo: 25 kills × 1.0 = 25 puntos        ║
║                                                ║
║  💡 Ejemplo Completo                           ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Equipo "Los Campeones"                        ║
║  • Posición: 2° lugar                          ║
║  • Total Kills: 30                             ║
║  • Multiplicador: x1.4                         ║
║  • Puntuación Final: 42 puntos (30 × 1.4)      ║
║                                                ║
║  El sistema premia kills y posición final      ║
╚════════════════════════════════════════════════╝
```

## 🎯 Flujo de Uso

```
1. Admin usa: /tournament-panel
            ↓
2. Click en: 🏆 Crear Torneo
            ↓
3. Completa formulario automático
            ↓
4. Bot crea:
   • Categoría de Discord
   • Canales (Anuncios, Registro, Brackets)
   • Roles (Participante)
   • Panel de registro para jugadores
            ↓
5. Jugadores registran equipos
            ↓
6. Admin: Click en ▶️ Iniciar Torneo
            ↓
7. Después de partidas:
   Click en 🎯 Enviar Resultado
            ↓
8. Bot calcula y guarda en Google Sheets
            ↓
9. Ver Dashboard para estadísticas
```

## 🎨 Características Visuales

✅ **Botones de colores**:
- 🟢 Verde = Crear/Iniciar
- 🔵 Azul = Ver información
- 🔴 Rojo = Reiniciar/Peligro
- ⚪ Gris = Ayuda/Información

✅ **Emojis claros**:
- 🏆 Torneos
- 📊 Estadísticas
- 🎯 Resultados
- 👥 Equipos
- ⚙️ Configuración

✅ **Formularios guiados**:
- Placeholders con ejemplos
- Validación automática
- Mensajes de error claros

✅ **Confirmaciones visuales**:
- Embeds con colores
- Información detallada
- Timestamps

## 📱 Responsive

El panel se adapta automáticamente:
- Deshabilita botones no disponibles
- Muestra estado actual
- Actualiza información en tiempo real

---

**Todo es visual, fácil y con un solo click** 🎮✨

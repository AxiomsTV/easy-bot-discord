# 🎬 Tutorial Paso a Paso

## Cómo usar el Bot de Torneos Warzone con la Interfaz Visual

### 📱 Paso 1: Abrir el Panel de Control

Como **Administrador** del servidor, escribe en cualquier canal:

```
/tournament-panel
```

Verás aparecer un panel como este:

```
🎮 Panel de Control - Torneos Warzone

⚪ Sin Torneo Activo
Usa el botón "Crear Torneo" para comenzar.

[🏆 Crear Torneo]  [📊 Dashboard]  [🎯 Resultado]
      ✅              ❌              ❌

[▶️ Iniciar]  [📋 Ver Equipos]  [🔄 Reiniciar]
      ❌            ❌              ❌

[📊 Sistema Puntuación]  [❓ Ayuda]

Sistema de Puntuación: Kills × Multiplicador
```

---

### 📝 Paso 2: Crear un Torneo

**Click en** `🏆 Crear Torneo`

Se abrirá un formulario automático:

```
═════════════════════════════════════
    🏆 Crear Nuevo Torneo
═════════════════════════════════════

Nombre del Torneo
┌─────────────────────────────────┐
│ Copa Warzone Diciembre 2025     │
└─────────────────────────────────┘

Número Máximo de Equipos
┌─────────────────────────────────┐
│ 20                              │
└─────────────────────────────────┘
(mínimo 4, máximo 64)

Jugadores por Equipo
┌─────────────────────────────────┐
│ 3                               │
└─────────────────────────────────┘
(Ej: 3 para Tríos)

Formato del Torneo
┌─────────────────────────────────┐
│ Tríos Battle Royale             │
└─────────────────────────────────┘
(Ej: Tríos, Solos, Duos, etc.)

Descripción (Opcional)
┌─────────────────────────────────┐
│ Torneo competitivo con premios │
│ para los 3 primeros lugares    │
└─────────────────────────────────┘

    [Enviar]      [Cancelar]
```

**Completa** los campos y presiona **Enviar**.

---

### ✅ Paso 3: Confirmación

El bot te mostrará:

```
✅ Torneo Creado Exitosamente

🏆 Copa Warzone Diciembre 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Información:
• Formato: Tríos Battle Royale
• Equipos: 0/20
• Tamaño: 3 jugadores
• Estado: 🟢 Registro Abierto

📝 Canales creados:
• 📢 #anuncios
• 📝 #registro
• 📊 #brackets

👥 Roles creados:
• @Participante

Los jugadores ya pueden registrarse!
```

**Automáticamente** el bot crea:
- ✅ Categoría "Copa Warzone Diciembre 2025"
- ✅ 3 Canales (anuncios, registro, brackets)
- ✅ Rol "Participante"
- ✅ Panel de registro para jugadores

---

### 👥 Paso 4: Jugadores se Registran

En el canal **#registro**, los jugadores verán:

```
📝 REGISTRO DE EQUIPOS

Copa Warzone Diciembre 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Formato: Tríos Battle Royale
👥 Jugadores por equipo: 3
📊 Equipos: 0/20

🎮 Estado: REGISTRO ABIERTO

Haz click en el botón para registrar
tu equipo:

[📝 Registrar Equipo]
```

Al hacer **click**, se abre un formulario:

```
═════════════════════════════════════
    📝 Registrar Equipo
═════════════════════════════════════

Nombre del Equipo
┌─────────────────────────────────┐
│ Los Campeones                   │
└─────────────────────────────────┘

Nombre del Capitán
┌─────────────────────────────────┐
│ Juan Pérez                      │
└─────────────────────────────────┘

Jugadores del Equipo
┌─────────────────────────────────┐
│ Juan Pérez, María López, Carlos │
└─────────────────────────────────┘
(Separados por comas)

    [Enviar]      [Cancelar]
```

---

### ▶️ Paso 5: Iniciar el Torneo

Cuando tengas suficientes equipos, vuelve al panel:

```
/tournament-panel
```

**Click en** `▶️ Iniciar Torneo`

El bot confirmará:

```
🎮 Torneo Iniciado

Copa Warzone Diciembre 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ El registro de equipos está CERRADO
✅ Equipos registrados: 15

🏆 El torneo ha comenzado!

Los administradores pueden enviar
resultados usando el panel de control.
```

---

### 🎯 Paso 6: Enviar Resultados de Partida

Después de cada partida de Warzone:

**Abre el panel** → **Click en** `🎯 Enviar Resultado`

```
═════════════════════════════════════
    🎯 Enviar Resultado de Equipo
═════════════════════════════════════

Nombre del Equipo
┌─────────────────────────────────┐
│ Los Campeones                   │
└─────────────────────────────────┘

Posición Final (1-15)
┌─────────────────────────────────┐
│ 2                               │
└─────────────────────────────────┘

Total de Kills del Equipo
┌─────────────────────────────────┐
│ 30                              │
└─────────────────────────────────┘

    [Enviar]      [Cancelar]
```

---

### ✅ Paso 7: Resultado Guardado

El bot calcula automáticamente:

```
✅ Resultado Guardado

Equipo: Los Campeones
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Posición    💀 Total Kills    ✨ Multiplicador
   2° lugar        30 kills           x1.4
      🥈

🏆 Puntuación Final
━━━━━━━━━━━━━━━━━━━━━━━━━━━
42 puntos

📊 Cálculo: 30 × 1.4 = 42

✅ Guardado en Google Sheets
Registrado por Admin#1234
```

**Y en el canal de anuncios:**

```
🎯 Nuevo Resultado Registrado

Los Campeones ha completado su partida

📍 Posición: 2°
💀 Kills: 30
🏆 Puntos: 42
```

---

### 📊 Paso 8: Ver Dashboard

En cualquier momento puedes ver el estado:

**Panel** → **Click en** `📊 Dashboard`

```
📊 Dashboard: Copa Warzone Diciembre 2025

📋 Información General:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Formato: Tríos Battle Royale
• Equipos: 15/20
• Jugadores por equipo: 3
• Estado: 🟡 En Progreso
• Creado: 22/10/2025

👥 Equipos Registrados:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Los Campeones - 42 pts
2. Team Alpha - 38 pts
3. Warriors Pro - 35 pts
...
```

---

### 📋 Paso 9: Ver Equipos

**Panel** → **Click en** `📋 Ver Equipos`

```
📋 Equipos Registrados

Copa Warzone Diciembre 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━
15/20 equipos registrados

👥 Equipos:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Los Campeones
   👤 Capitán: Juan Pérez
   👥 Jugadores: Juan Pérez, María López, Carlos

2. Team Alpha
   👤 Capitán: Ana García
   👥 Jugadores: Ana García, Luis Díaz, Pedro

...
```

---

### 📊 Paso 10: Sistema de Puntuación

Si alguien pregunta cómo funciona:

**Panel** → **Click en** `📊 Sistema de Puntuación`

```
📊 Sistema de Puntuación de Warzone

Fórmula: Puntuación = Kills × Multiplicador
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥇 1° Lugar
Multiplicador: x1.6
Ejemplo: 25 kills × 1.6 = 40 puntos

🥈 2° - 5° Lugar
Multiplicador: x1.4
Ejemplo: 25 kills × 1.4 = 35 puntos

🥉 6° - 10° Lugar
Multiplicador: x1.2
Ejemplo: 25 kills × 1.2 = 30 puntos

🔟 11° - 15° Lugar
Multiplicador: x1.0
Ejemplo: 25 kills × 1.0 = 25 puntos

💡 Ejemplo Completo:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Equipo "Los Campeones"
• Posición: 2° lugar
• Total Kills: 30
• Multiplicador: x1.4
• Puntuación Final: 42 puntos (30 × 1.4)

El sistema premia kills y posición final
```

---

## 🎉 ¡Eso es Todo!

### Ventajas de la Interfaz Visual:

✅ **Sin comandos complicados** - Todo con botones  
✅ **Formularios automáticos** - Solo completas los campos  
✅ **Cálculos automáticos** - El bot hace las matemáticas  
✅ **Validación en tiempo real** - Te avisa si hay errores  
✅ **Super intuitivo** - Cualquiera puede usarlo  
✅ **Confirmaciones visuales** - Siempre sabes qué pasó  

### Comparación:

**Antes (Comandos):**
```
/tournament-setup name:"Copa" max-teams:20 team-size:3 format:"Trios"
```
❌ Difícil de recordar  
❌ Fácil cometer errores  

**Ahora (Visual):**
```
/tournament-panel → Click → Formulario
```
✅ Súper fácil  
✅ Imposible equivocarse  

---

**¡Ahora gestionar torneos de Warzone es tan fácil como jugar!** 🎮🏆

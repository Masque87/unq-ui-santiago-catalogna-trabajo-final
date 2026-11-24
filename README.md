# Word Chain

Juego de palabras encadenadas hecho con React, TypeScript y Vite (TFI de UIs, UNQ, 2°C 2026).

El objetivo es formar la cadena más larga posible de palabras válidas antes de que se agote el tiempo. Cada palabra tiene que existir en el diccionario español, no puede repetirse y debe empezar con la última letra de la palabra anterior. Cada letra suma 1 punto y cada turno dura 15 segundos.

## Requisitos

- Node.js 20.19 o superior
- Conexión a internet, porque las palabras se validan con la API de la cátedra (`https://word-api-hmlg.vercel.app`).

## Descargar e instalar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Masque87/unq-ui-santiago-catalogna-trabajo-final.git
   ```
2. Situarse en la carpeta del proyecto:
   ```bash
   cd unq-ui-santiago-catalogna-trabajo-final
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```

## Ejecutar localmente

1. Ejecutar `npm run dev`.
2. Abrir la URL que aparece en la terminal (por defecto `http://localhost:5173`).


## Funcionalidades

- Jugar una partida: el tiempo arranca al ingresar la primera palabra y se reinicia con cada palabra válida.
- Validación de palabras con la API y mensajes de error (no existe, ya fue usada, no respeta la cadena).
- Puntaje, cadena de palabras y tiempo restante visibles durante la partida.
- Pantalla de fin de partida con cantidad de palabras y puntaje final.
- Jugar más de una partida.
- Leaderboard local con los 10 mejores puntajes (se guarda en el `localStorage` del navegador).

## Estructura

```
src/
  assets/       Íconos SVG
  components/   Componentes de UI (Icon)
  hooks/        Lógica del juego (useWordChainGame) y del ranking (useLeaderboard)
  services/     Acceso a la API (wordApi) y al localStorage (leaderboardStorage)
  utils/        Reglas de palabras (wordRules)
```
import { FRAME_TIME } from "../game/game.js";

// Define la constante TIME_DELAY (ACTUALIZAR TIMER)
export const TIME_DELAY = 60 * FRAME_TIME;

// Define la constante TIME_LOW_DELAY (ACTUALIZAR TIMER -15 SEG)
export const TIME_LOW_DELAY = 3 * FRAME_TIME;

// Define la constante TIME_FRAME_KEYS (TIME Y TIME-LOW PARA SABER QUE SPRITES APLICAR AL TIMER)
export const TIME_FRAME_KEYS = ['time', 'time-low'];

// Define la constante KO_LOW_DELAY (FLASH KO AL ESTAR UN PERSONAJE BAJO DE VIDA)
export const KO_LOW_DELAY = [4 * FRAME_TIME, 7 * FRAME_TIME];

// Define la constante KO_ANIMATION (KO-WHITE Y KO-RED PARA SABER QUE SPRITES APLICAR AL TIMER)
export const KO_ANIMATION = ['ko-white', 'ko-red'];

// Define la constante HP_MAX_PTS (VIDA INICIAL DEL PERSONAJE)
export const HP_MAX_PTS = 144;

// Define la constante HP_LOW_PTS (DETECCION DE POCA VIDA)
export const HP_LOW_PTS = 45;

// Define la constante HP_COLOR (VIDA AMARILLA)
export const HP_COLOR = '#F3F300';

// Define la constante HP_RED (VIDA ROJA)
export const HP_RED = '#F30000';

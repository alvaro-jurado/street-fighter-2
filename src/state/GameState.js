import { FighterId } from "../constants/fighters/fighter.js";
import { createDefaultFighterState } from "./FighterState.js";

// Definimos el objeto gameState, que representa el estado del juego
export const gameState = {
    // La propiedad fighters es un array que contiene los estados iniciales de dos luchadores: Ryu y Ken
    fighters: [
        // Creamos el estado inicial del luchador Ryu utilizando la función createDefaultFighterState
        createDefaultFighterState(FighterId.RYU),
        // Creamos el estado inicial del luchador Ken utilizando la función createDefaultFighterState
        createDefaultFighterState(FighterId.KEN),
    ]
};

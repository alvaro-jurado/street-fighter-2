import { HP_MAX_PTS } from "../constants/battleControl/battle.js";

// Función que crea y devuelve el estado predeterminado de un luchador
export const createDefaultFighterState = (id) => ({
    // Asigna el identificador proporcionado al estado del luchador
    id,

    // Inicializa los puntos de vida del luchador con el valor máximo definido en las constantes de batalla
    hitPoints: HP_MAX_PTS,
});

import { Control } from "../battleControl/control.js";

// Definición de estados para el Hadouken
export const HadoukenState = {
    ACTIVE: 'active',      // Estado activo del Hadouken
    COLLISION: 'collision' // Estado de colisión del Hadouken
};

// Definición de estados de colisión para el Hadouken
export const hadoukenCollisionState = {
    NONE: 'none',          // Sin colisión
    ENEMY: 'enemy',        // Colisión con un enemigo
    HADOUKEN: 'hadouken',  // Colisión con otro Hadouken
};

// Definición de velocidades para el Hadouken según el tipo de puñetazo
export const hadoukenSpeed = {
    [Control.LP]: 150,     // Velocidad para el control de golpe ligero (LP)
    [Control.MP]: 200,     // Velocidad para el control de golpe medio (MP)
    [Control.HP]: 300      // Velocidad para el control de golpe fuerte (HP)
};

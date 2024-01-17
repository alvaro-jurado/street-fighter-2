import { FRAME_TIME } from "../game/game.js";

// Velocidad de empuje entre personajes, brecha de inicio de personajes, y retraso después de recibir daño
export const PUSH_SPEED = 60;
export const FIGHTER_START_GAP = 88;
export const FIGHTER_HURT_DELAY = 7 + 8;

// Direcciones en las que puede mirar el personaje
export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

// Identificadores únicos para los personajes
export const FighterId = {
    RYU: 'ryu',
    KEN: 'ken',
};

// Tipos de ataque de los personajees
export const FighterAttackType = {
    PUNCH: 'punch',
    KICK: 'kick',
};

// Niveles de daño de los ataques de los personajees
export const FighterAttackDmg = {
    L: 'light',
    M: 'medium',
    H: 'heavy',
};

// Zonas de daño específicas del personaje
export const FighterHurtBox = {
    HEAD: 'head',
    BODY: 'body',
    FEET: 'feet',
};

// Quién o qué puede dañar al personaje en diferentes situaciones
export const FighterHurtBy = {
    FIGHTER: 'fighter',
    HADOUKEN: 'hadouken',
};

// Datos base para diferentes niveles de daño de los ataques del personaje
export const FighterAttackBaseData = {
    [FighterAttackDmg.L]: {
        damage: 15, // Daño del ataque
        slide: { // Propiedades de deslizamiento al recibir un golpe
            speed: -12 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackDmg.M]: {
        damage: 20, // Daño del ataque
        slide: { // Propiedades de deslizamiento al recibir un golpe
            speed: -16 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackDmg.H]: {
        damage: 25, // Daño del ataque
        slide: { // Propiedades de deslizamiento al recibir un golpe
            speed: -20 * FRAME_TIME,
            friction: 600,
        },
    },
};

// Estados posibles del personaje
export const FighterState = {
    IDLE: 'idle',
    WALK_FORWARD: 'walkForwards',
    WALK_BACKWARDS: 'walkBackwards', 
    JUMP_START: 'jumpStart', 
    JUMP_UP: 'jumpUp',
    JUMP_FORWARD: 'jumpForwards',
    JUMP_BACKWARDS: 'jumpBackwards',
    JUMP_LAND: 'jumpLand',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouchDown',
    CROUCH_UP: 'crouchUp',
    IDLE_TURN: 'idleTurn',
    CROUCH_TURN: 'crouchTurn',
    LP: 'lp',
    MP: 'mp',
    HP: 'hp',
    LK: 'lk',
    MK: 'mk',
    HK: 'hk',
    CLP: 'clp',
    HURT_HEAD_L: 'hurt-head-l',
    HURT_HEAD_M: 'hurt-head-m',
    HURT_HEAD_H: 'hurt-head-h',
    HURT_BODY_L: 'hurt-body-l',
    HURT_BODY_M: 'hurt-body-m',
    HURT_BODY_H: 'hurt-body-h',
    HADOUKEN: 'hadouken',
};

// Retrasos específicos para animaciones
export const FrameDelay = {
    FREEZE: 0,
    TRANSITION: -1,
};

// Cajas de empuje en diferentes estados del personaje
export const PushBox = {
    IDLE: [-16, -80, 32, 78],
    JUMP: [-16, -91, 32, 66],
    BEND: [-16, -58, 32, 58],
    CROUCH: [-16, -50, 32, 50],
};

// Cajas de daño en diferentes estados del personaje
export const HurtBox = {
    IDLE: [[-8, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]],
    FORWARD: [[-3, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]],
    BACKWARDS: [[-19, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]],
    JUMP: [[-13, -106, 28, 18], [-26, -90, 40, 42], [-22, -66, 38, 18]],
    BEND: [[-2, -68, 24, 18], [-16, -53, 44, 24], [-16, -24, 44, 24]],
    CROUCH: [[6, -61, 24, 18], [-16, -46, 44, 24], [-16, -24, 44, 24]],
    PUNCH: [[11, -94, 24, 18], [-7, -77, 40, 43], [-7, -33, 40, 33]],
};

// Estados desde los cuales el personaje puede recibir daño
export const hurtStateValidFrom = [
    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS, FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARDS,
    FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.IDLE_TURN, FighterState.LP, FighterState.MP, FighterState.HP, FighterState.LK, FighterState.MK, FighterState.HK,
    FighterState.CLP, FighterState.HADOUKEN,
    FighterState.HURT_HEAD_L, FighterState.HURT_HEAD_M, FighterState.HURT_HEAD_H, FighterState.HURT_BODY_L, FighterState.HURT_BODY_M, FighterState.HURT_BODY_H,
];

// Direcciones de movimiento para el Hadouken (Input hadouken = DOWN + FORWARD_DOWN + FORWARD + PUNCH)
export const HadoukenMoveDirection = {
    BACKWARD: 'backward',
    BACKWARD_UP: 'backward-up',
    UP: 'up',
    FORWARD_UP: 'forward-up',
    FORWARD: 'forward',
    FORWARD_DOWN: 'forward-down',
    DOWN: 'down',
    BACKWARD_DOWN: 'backward-down',
    NONE: 'none',
};

// Botones asociados con el movimiento del Hadouken
export const HadoukenMoveButton = {
    PUNCH: 'punch',
    KICK: 'kick',
};

import { FIGHTER_HURT_DELAY, FighterState, FrameDelay, HadoukenMoveButton, HadoukenMoveDirection, HurtBox, PushBox } from "../../../constants/fighters/fighter.js";
import { Fighter } from "../Fighter.js";
import { Hadouken } from "../Hadouken.js";

export class Ken extends Fighter {
    constructor(playerId, onAttackHit, entityList) {
        // Llamar al constructor de la clase padre Fighter
        super(playerId, onAttackHit);

        // Almacenar la lista de entidades, la imagen y los frames de las animaciones
        this.entityList = entityList;
        this.image = document.querySelector('img[alt="ken"]');
        this.frames = new Map([
            //Idle
            ['idle-1', [[[346, 688, 60, 89], [34, 86]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-2', [[[2, 687, 59, 90], [33, 87]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-3', [[[72, 685, 58, 92], [32, 89]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-4', [[[142, 684, 55, 93], [31, 90]], PushBox.IDLE, HurtBox.IDLE]],

            //Move forwards
            ['forwards-1', [[[8, 872, 53, 83], [27, 81]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-2', [[[70, 867, 60, 88], [35, 86]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-3', [[[140, 866, 64, 90], [35, 87]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-4', [[[215, 865, 63, 89], [29, 88]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-5', [[[288, 866, 54, 89], [25, 87]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-6', [[[357, 867, 50, 89], [25, 86]], PushBox.IDLE, HurtBox.FORWARD]],

            //Move backwards
            ['backwards-1', [[[417, 868, 61, 87], [35, 85]], PushBox.IDLE, HurtBox.BACKWARDS]],
            ['backwards-2', [[[487, 866, 59, 90], [36, 87]], PushBox.IDLE, HurtBox.BACKWARDS]],
            ['backwards-3', [[[558, 865, 57, 90], [36, 88]], PushBox.IDLE, HurtBox.BACKWARDS]],
            ['backwards-4', [[[629, 864, 58, 90], [38, 89]], PushBox.IDLE, HurtBox.BACKWARDS]],
            ['backwards-5', [[[702, 865, 58, 91], [36, 88]], PushBox.IDLE, HurtBox.BACKWARDS]],
            ['backwards-6', [[[773, 866, 57, 89], [36, 87]], PushBox.IDLE, HurtBox.BACKWARDS]],

            //Jump Start and land
            ['jump-landing-1', [[[660, 1060, 55, 85], [29, 83]], PushBox.JUMP, HurtBox.IDLE]],

            //Jump Up
            ['jump-up-1', [[[724, 1036, 56, 104], [32, 107]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-2', [[[792, 995, 50, 89], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-3', [[[853, 967, 54, 77], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-4', [[[911, 966, 48, 70], [28, 101]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-5', [[[975, 977, 48, 86], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-6', [[[1031, 1008, 55, 103], [32, 107]], PushBox.JUMP, HurtBox.JUMP]],

            //Jump Forwards and Backwards
            ['jump-direction-1', [[[1237, 1037, 55, 103], [25, 106]], PushBox.JUMP, [[-11, -106, 24, 16], [-26, -90, 40, 42], [-26, -31, 40, 32]]]],
            ['jump-direction-2', [[[1301, 990, 61, 78], [22, 90]], PushBox.JUMP, [[17, -90, 24, 16], [-14, -91, 40, 42], [-22, -66, 38, 18]]]],
            ['jump-direction-3', [[[1363, 994, 104, 42], [61, 76]], PushBox.JUMP, [[22, -51, 24, 16], [-14, -81, 40, 42], [-22, -66, 38, 18]]]],
            ['jump-direction-4', [[[1468, 957, 53, 82], [42, 111]], PushBox.JUMP, [[-39, -46, 24, 16], [-30, -88, 40, 42], [-34, -118, 44, 48]]]],
            ['jump-direction-5', [[[1541, 988, 122, 44], [71, 81]], PushBox.JUMP, [[-72, -56, 24, 16], [-54, -77, 52, 40], [-14, -82, 48, 34]]]],
            ['jump-direction-6', [[[1664, 976, 71, 87], [53, 98]], PushBox.JUMP, [[-55, -100, 24, 16], [-48, -87, 44, 38], [-22, -66, 38, 18]]]],

            //Crouch
            ['crouch-1', [[[8, 779, 53, 83], [27, 81]], PushBox.IDLE, HurtBox.IDLE]],
            ['crouch-2', [[[79, 794, 57, 69], [25, 66]], PushBox.BEND, HurtBox.BEND]],
            ['crouch-3', [[[148, 802, 61, 61], [25, 58]], PushBox.CROUCH, HurtBox.CROUCH]],

            //Idle Turn
            ['idle-turn-1', [[[420, 682, 54, 95], [29, 92]], PushBox.IDLE, [[-10, -89, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],
            ['idle-turn-2', [[[488, 678, 58, 98], [30, 95]], PushBox.IDLE, [[-16, -96, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],
            ['idle-turn-3', [[[560, 683, 54, 94], [27, 90]], PushBox.IDLE, [[-16, -96, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],

            //Crouch Turn
            ['crouch-turn-1', [[[356, 802, 53, 61], [26, 58]], PushBox.CROUCH, [[-7, -60, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],
            ['crouch-turn-2', [[[424, 802, 52, 61], [27, 58]], PushBox.CROUCH, [[-7, -60, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],
            ['crouch-turn-3', [[[486, 802, 53, 61], [29, 58]], PushBox.CROUCH, [[-26, -61, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],

            //LP
            ['lp-1', [[[3, 1152, 64, 91], [32, 88]], PushBox.IDLE, HurtBox.IDLE]],
            ['lp-2', [[[72, 1152, 92, 91], [32, 88]], PushBox.IDLE, HurtBox.IDLE, [11, -85, 50, 18]]],

            //MP
            ['mp-1', [[[517, 1149, 60, 94], [28, 91]], PushBox.IDLE, HurtBox.IDLE]],
            ['mp-2', [[[650, 1148, 74, 95], [29, 92]], PushBox.IDLE, HurtBox.PUNCH]],
            ['mp-3', [[[736, 1148, 108, 94], [24, 92]], PushBox.IDLE, HurtBox.PUNCH, [17, -85, 68, 14]]],

            //HP
            ['hp-1', [[[736, 1148, 108, 94], [24, 92]], PushBox.IDLE, HurtBox.PUNCH, [17, -85, 76, 14]]],

            //LK
            ['lk-1', [[[62, 1565, 66, 92], [46, 93]], PushBox.IDLE, [[-33, -96, 30, 18], [-41, -79, 42, 38], [-32, -52, 44, 50]]]],
            ['lk-2', [[[143, 1565, 114, 92], [68, 93]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]], [-17, -98, 66, 28]]],

            //MK
            ['mk-1', [[[143, 1565, 114, 92], [68, 93]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]], [-18, -98, 70, 28]]],

            //HK
            ['hk-1', [[[683, 1571, 61, 90], [37, 87]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['hk-2', [[[763, 1567, 95, 94], [45, 91]], PushBox.IDLE, [[12, -90, 34, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [15, -99, 40, 32]]],
            ['hk-3', [[[870, 1567, 120, 94], [42, 91]], PushBox.IDLE, [[13, -91, 62, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [21, -97, 57, 20]]],
            ['hk-4', [[[1005, 1584, 101, 77], [39, 74]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['hk-5', [[[1147, 1580, 64, 81], [38, 78]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],

            //CLP
            ['clp-1', [[[10, 1425, 69, 61], [25, 58]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['clp-2', [[[89, 1425, 95, 61], [25, 58]], PushBox.CROUCH, HurtBox.CROUCH, [22, -55, 50, 18]]],

            //HADOUKEN
            ['hadouken-1', [[[3, 2741, 74, 90], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
            ['hadouken-2', [[[91, 2747, 85, 83], [25, 83]], PushBox.IDLE, HurtBox.IDLE]],
            ['hadouken-3', [[[188, 2750, 90, 81], [25, 80]], PushBox.IDLE, HurtBox.PUNCH]],
            ['hadouken-4', [[[293, 2754, 106, 77], [23, 76]], PushBox.IDLE, [[38, -79, 26, 18], [21, -65, 40, 38], [-12, -30, 78, 30]]]],

            //Hit face
            ['hit-face-1', [[[325, 3275, 62, 91], [41, 88]], PushBox.IDLE, [[-25, -89, 20, 20], [-33, -74, 40, 46], [-30, -37, 40, 38]]]],
            ['hit-face-2', [[[400, 3279, 68, 88], [47, 85]], PushBox.IDLE, [[-42, -88, 20, 20], [-46, -74, 40, 46], [-33, -37, 40, 38]]]],
            ['hit-face-3', [[[484, 3279, 73, 88], [54, 85]], PushBox.IDLE, [[-52, -87, 20, 20], [-53, -74, 40, 46], [-33, -37, 40, 38]]]],
            ['hit-face-4', [[[575, 3274, 83, 93], [58, 90]], PushBox.IDLE, [[-57, -88, 20, 20], [-53, -74, 40, 46], [-33, -37, 40, 38]]]],

            //Hit body
            ['hit-body-1', [[[1, 3279, 58, 85], [37, 83]], PushBox.IDLE, [[-15, -85, 28, 18], [-31, -69, 42, 42], [-30, -34, 42, 34]]]],
            ['hit-body-2', [[[74, 3282, 66, 82], [39, 80]], PushBox.IDLE, [[-17, 82, 28, 18], [-33, -65, 38, 36], [-34, -34, 42, 34]]]],
            ['hit-body-3', [[[149, 3287, 71, 78], [47, 75]], PushBox.IDLE, [[-17, 82, 28, 18], [-41, -59, 38, 30], [-34, -34, 42, 34]]]],
            ['hit-body-4', [[[231, 3293, 75, 72], [50, 69]], PushBox.IDLE, [[-28, -67, 28, 18], [-41, -59, 38, 30], [-40, -34, 42, 34]]]],

            //Stun
            ['stun-1', [[[149, 3370, 77, 87], [28, 85]], PushBox.IDLE, [[8, -87, 28, 18], [-16, -75, 40, 46], [-26, -31, 40, 32]]]],
            ['stun-2', [[[77, 3368, 65, 89], [28, 87]], PushBox.IDLE, [[-9, -89, 28, 18], [-23, -75, 40, 46], [-26, -31, 40, 32]]]],
            ['stun-3', [[[1, 3367, 67, 90], [35, 88]], PushBox.IDLE, [[-22, -91, 28, 18], [-30, -72, 42, 40], [-26, -31, 40, 32]]]],
        ]);

        // Definir las animaciones para los diferentes estados del luchador
        this.animations = {
            [FighterState.IDLE]: [['idle-1', 4], ['idle-2', 4], ['idle-3', 4], ['idle-4', 4], ['idle-3', 4], ['idle-2', 4]],
            [FighterState.WALK_FORWARD]: [['forwards-1', 3], ['forwards-2', 6], ['forwards-3', 4], ['forwards-4', 4], ['forwards-5', 4], ['forwards-6', 6]],
            [FighterState.WALK_BACKWARDS]: [['backwards-1', 3], ['backwards-2', 6], ['backwards-3', 4], ['backwards-4', 4], ['backwards-5', 4], ['backwards-6', 6]],
            [FighterState.JUMP_START]: [['jump-landing-1', 3], ['jump-landing-1', FrameDelay.TRANSITION]],
            [FighterState.JUMP_UP]: [['jump-up-1', 8], ['jump-up-2', 8], ['jump-up-3', 8], ['jump-up-4', 8], ['jump-up-5', 8], ['jump-up-6', FrameDelay.FREEZE]],
            [FighterState.JUMP_FORWARD]: [['jump-direction-1', 13], ['jump-direction-2', 5], ['jump-direction-3', 3], ['jump-direction-4', 3], ['jump-direction-5', 3],
            ['jump-direction-6', 5], ['jump-up-6', FrameDelay.FREEZE]],
            [FighterState.JUMP_BACKWARDS]: [['jump-direction-6', 15], ['jump-direction-5', 3], ['jump-direction-4', 3], ['jump-direction-3', 3],
            ['jump-direction-2', 3], ['jump-direction-1', FrameDelay.FREEZE]],
            [FighterState.JUMP_LAND]: [['jump-landing-1', 2], ['jump-landing-1', 5], ['jump-landing-1', FrameDelay.TRANSITION]],
            [FighterState.CROUCH]: [['crouch-3', FrameDelay.FREEZE]],
            [FighterState.CROUCH_DOWN]: [['crouch-1', 2], ['crouch-2', 2], ['crouch-3', 2], ['crouch-3', FrameDelay.TRANSITION]],
            [FighterState.CROUCH_UP]: [['crouch-3', 2], ['crouch-2', 2], ['crouch-1', 2], ['crouch-1', FrameDelay.TRANSITION]],
            [FighterState.IDLE_TURN]: [['idle-turn-3', 2], ['idle-turn-2', 2], ['idle-turn-1', 2], ['idle-turn-1', FrameDelay.TRANSITION]],
            [FighterState.CROUCH_TURN]: [['crouch-turn-3', 2], ['crouch-turn-2', 2], ['crouch-turn-1', 2], ['crouch-turn-1', FrameDelay.TRANSITION]],
            [FighterState.LP]: [['lp-1', 2], ['lp-2', 4], ['lp-1', 4], ['lp-1', FrameDelay.TRANSITION]],
            [FighterState.MP]: [['mp-1', 1], ['mp-2', 2], ['mp-3', 4], ['mp-2', 3], ['mp-1', 3], ['mp-1', FrameDelay.TRANSITION]],
            [FighterState.HP]: [['mp-1', 3], ['mp-2', 2], ['hp-1', 6], ['mp-2', 10], ['mp-1', 12], ['mp-1', FrameDelay.TRANSITION]],
            [FighterState.LK]: [['mp-1', 3], ['lk-1', 3], ['lk-2', 8], ['lk-1', 4], ['mp-1', 1], ['mp-1', FrameDelay.TRANSITION]],
            [FighterState.MK]: [['mp-1', 5], ['lk-1', 6], ['mk-1', 12], ['lk-1', 7], ['lk-1', FrameDelay.TRANSITION]],
            [FighterState.HK]: [['hk-1', 2], ['hk-2', 4], ['hk-3', 8], ['hk-4', 10], ['hk-5', 7], ['hk-5', FrameDelay.TRANSITION]],
            [FighterState.CLP]: [['clp-1', 2], ['clp-2', 4], ['clp-1', 4], ['clp-1', FrameDelay.TRANSITION]],
            [FighterState.HADOUKEN]: [['hadouken-1', 2], ['hadouken-2', 8], ['hadouken-3', 2], ['hadouken-4', 40], ['hadouken-4', FrameDelay.TRANSITION]],
            [FighterState.HURT_HEAD_L]: [['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 3], ['hit-face-2', 8], ['hit-face-4', FrameDelay.TRANSITION]],
            [FighterState.HURT_HEAD_M]: [['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 3], ['hit-face-2', 4], ['hit-face-3', 9], ['hit-face-3', FrameDelay.TRANSITION]],
            [FighterState.HURT_HEAD_H]: [['hit-face-3', FIGHTER_HURT_DELAY], ['hit-face-3', 7], ['hit-face-4', 4], ['stun-3', 9], ['stun-3', FrameDelay.TRANSITION]],
            [FighterState.HURT_BODY_L]: [['hit-body-1', FIGHTER_HURT_DELAY], ['hit-body-1', 11], ['hit-body-1', FrameDelay.TRANSITION]],
            [FighterState.HURT_BODY_M]: [['hit-body-1', FIGHTER_HURT_DELAY], ['hit-body-1', 7], ['hit-body-2', 9], ['hit-body-2', FrameDelay.TRANSITION]],
            [FighterState.HURT_BODY_H]: [['hit-body-2', FIGHTER_HURT_DELAY], ['hit-body-2', 3], ['hit-body-3', 4], ['hit-body-4', 4], ['stun-3', 9], ['stun-3', FrameDelay.TRANSITION]],
        };

        // Configuración de la velocidad inicial para diferentes estados
        this.initSpeed = {
            x: {
                [FighterState.WALK_FORWARD]: 3 * 60,
                [FighterState.WALK_BACKWARDS]: -(2 * 60),
                [FighterState.JUMP_FORWARD]: ((48 * 3) + (12 * 2)),
                [FighterState.JUMP_BACKWARDS]: -((45 * 4) + (15 * 3)),
            },
            jump: -420,
        }

        // Configuración de movimientos especiales
        this.specialMoves = [
            {
                state: FighterState.HADOUKEN,
                sequence: [HadoukenMoveDirection.DOWN, HadoukenMoveDirection.FORWARD_DOWN, HadoukenMoveDirection.FORWARD, HadoukenMoveButton.PUNCH],
                cursor: 0,
            },
        ];

        // Configuración de la gravedad y el proyectil Hadouken
        this.gravity = 1000;
        this.hadouken = { fired: false, damage: undefined };

        // Configuración de los estados y transiciones específicas para Hadouken
        this.states[FighterState.HADOUKEN] = {
            init: this.handleHadoukenInit.bind(this),
            update: this.handleHadoukenState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.IDLE_TURN,
                FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP, FighterState.CROUCH_TURN,
            ],
        }

        // Agregar el estado HADOUKEN como un estado válido desde IDLE
        this.states[FighterState.IDLE].validFrom = [...this.states[FighterState.IDLE].validFrom, FighterState.HADOUKEN];
    }

    // Inicializar el estado HADOUKEN
    handleHadoukenInit(_, damage) {
        this.resetSpeed();
        this.hadouken = { fired: false, damage: damage };
    }

    // Actualizar el estado HADOUKEN
    handleHadoukenState(time) {
        // Verificar si el Hadouken no ha sido disparado y es el cuadro de animación adecuado
        if (!this.hadouken.fired && this.animationFrame === 3) {
            this.hadouken.fired = true;
            // Agregar un nuevo Hadouken a la lista de entidades
            this.entityList.add.call(this.entityList, Hadouken, time, this, this.hadouken.damage);
        }

        // Verificar si la animación ha sido completada
        if (!this.isAnimationCompleted()) {
            return;
        }

        // Cambiar al estado IDLE una vez completada la animación
        this.changeState(FighterState.IDLE);
    }
}
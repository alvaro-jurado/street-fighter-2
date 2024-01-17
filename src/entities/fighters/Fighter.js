import { TIME_DELAY } from "../../constants/battleControl/battle.js";
import { FighterDirection, FighterState, FighterAttackType, FrameDelay, PUSH_SPEED, FIGHTER_START_GAP, FighterAttackDmg, FighterAttackBaseData, FighterHurtBox, hurtStateValidFrom, FIGHTER_HURT_DELAY, FighterHurtBy } from "../../constants/fighters/fighter.js";
import { FRAME_TIME } from "../../constants/game/game.js"
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/game/stage.js";
import * as control from "../../utils/InputHandler.js";
import { hasHadoukenExecuted } from "../../utils/MoveHistory.js";
import { boxOverlap, getBoxDimensions, rectsOverlap } from "../../utils/Collisions.js"

export class Fighter {
    constructor(playerId, onAttackHit) {
        // Inicialización de propiedades
        this.playerId = playerId;
        this.image = new Image();
        this.frames = new Map();

        this.startTimer = 107;
        this.startTimer2 = 0;
        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? - FIGHTER_START_GAP : FIGHTER_START_GAP),
            y: STAGE_FLOOR
        };
        this.speed = { x: 0, y: 0 };
        this.initSpeed = {};
        this.gravity = 0;
        this.attackLanded = false;
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};

        this.slideSpeed = 0;
        this.slideFriction = 0;
        this.hurtBy = undefined;

        this.hurtShake = 0;
        this.hurtShakeTimer = 0;

        this.isAttacking = false;

        this.enemy;
        this.onAttackHit = onAttackHit;

        this.boxes = { // Inicialización de cajas
            push: { x: 0, y: 0, width: 0, height: 0 }, // Caja de empuje (PushBox)
            hurt: { // Cajas de daño (HurtBox) (Cabeza, Cuerpo, Pies)
                [FighterHurtBox.HEAD]: [0, 0, 0, 0],
                [FighterHurtBox.BODY]: [0, 0, 0, 0],
                [FighterHurtBox.FEET]: [0, 0, 0, 0],
            },
            hit: { x: 0, y: 0, width: 0, height: 0 }, // Caja de ataque (HitBox)
        };

        // Estados posibles del personaje
        /*
        init = Función de inicialización del estado
        update = Función de manejo del estado
        validFrom = Estados desde los cuales se puede cambiar al estado determinado

        attackType = Tipo de ataque (PUNCH/KICK)
        attackDmg = Daño de ataque (L/M/H)
        */
        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [undefined, FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS, FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARDS,
                    FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.IDLE_TURN, FighterState.LP, FighterState.MP, FighterState.HP, FighterState.LK, FighterState.MK, FighterState.HK,
                    FighterState.HURT_HEAD_L, FighterState.HURT_HEAD_M, FighterState.HURT_HEAD_H, FighterState.HURT_BODY_L, FighterState.HURT_BODY_M, FighterState.HURT_BODY_H,],
            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardsState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_BACKWARDS],
            },
            [FighterState.WALK_BACKWARDS]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardsState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD],
            },
            [FighterState.JUMP_START]: {
                init: this.handleJumpStartInit.bind(this),
                update: this.handleJumpStartState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS, FighterState.JUMP_LAND],
            },
            [FighterState.JUMP_UP]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.JUMP_START],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.JUMP_START],
            },
            [FighterState.JUMP_BACKWARDS]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.JUMP_START],
            },
            [FighterState.JUMP_LAND]: {
                init: this.handleJumpLandInit.bind(this),
                update: this.handleJumpLandState.bind(this),
                validFrom: [FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARDS],
            },
            [FighterState.CROUCH]: {
                init: this.handleCrouchInit.bind(this),
                update: this.handleCrouchState.bind(this),
                validFrom: [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN, FighterState.CLP],
            },
            [FighterState.CROUCH_DOWN]: {
                init: this.handleCrouchDownInit.bind(this),
                update: this.handleCrouchDownState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.CROUCH_UP]: {
                init: () => { },
                update: this.handleCrouchUpState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.IDLE_TURN]: {
                init: () => { },
                update: this.handleIdleTurnState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.JUMP_LAND, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.CROUCH_TURN]: {
                init: () => { },
                update: this.handleCrouchTurnState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.LP]: {
                attackType: FighterAttackType.PUNCH,
                attackDmg: FighterAttackDmg.L,
                init: this.handleLightInit.bind(this),
                update: this.handleLPState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.MP]: {
                attackType: FighterAttackType.PUNCH,
                attackDmg: FighterAttackDmg.M,
                init: this.handleMediumInit.bind(this),
                update: this.handleMPState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.HP]: {
                attackType: FighterAttackType.PUNCH,
                attackDmg: FighterAttackDmg.H,
                init: this.handleHeavyInit.bind(this),
                update: this.handleMPState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.LK]: {
                attackType: FighterAttackType.KICK,
                attackDmg: FighterAttackDmg.L,
                init: this.handleLightInit.bind(this),
                update: this.handleLKState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.MK]: {
                attackType: FighterAttackType.KICK,
                attackDmg: FighterAttackDmg.M,
                init: this.handleMediumInit.bind(this),
                update: this.handleMKState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.HK]: {
                attackType: FighterAttackType.KICK,
                attackDmg: FighterAttackDmg.H,
                init: this.handleHeavyInit.bind(this),
                update: this.handleMKState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARDS],
            },
            [FighterState.CLP]: {
                attackType: FighterAttackType.PUNCH,
                attackDmg: FighterAttackDmg.L,
                init: this.handleLightInit.bind(this),
                update: this.handleCLPState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.HURT_HEAD_L]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: hurtStateValidFrom,
            },
            [FighterState.HURT_HEAD_M]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: hurtStateValidFrom,
            },
            [FighterState.HURT_HEAD_H]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: hurtStateValidFrom,
            },
            [FighterState.HURT_BODY_L]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: hurtStateValidFrom,
            },
            [FighterState.HURT_BODY_M]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: hurtStateValidFrom,
            },
            [FighterState.HURT_BODY_H]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: hurtStateValidFrom,
            },
        }
        // Establecer el estado inicial como IDLE
        this.changeState(FighterState.IDLE);
    }

    // Método para verificar si la animación actual ha terminado
    isAnimationCompleted = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    // Método para controlar el momento donde se pueden mover los personajes
    updateTime(time) {
        if (time.prev > this.startTimer2 + TIME_DELAY) {
            this.startTimer--;
            this.startTimer2 = time.prev;
        }
    }

    // Método para verificar si se ha colisionado con el oponente
    hasCollidedWithOpponent = () => rectsOverlap(
        this.position.x + this.boxes.push.x, this.position.y + this.boxes.push.y,
        this.boxes.push.width, this.boxes.push.height,
        this.enemy.position.x + this.enemy.boxes.push.x,
        this.enemy.position.y + this.enemy.boxes.push.y,
        this.enemy.boxes.push.width, this.enemy.boxes.push.height,
    );

    // Método para reiniciar la velocidad del personaje
    resetSpeed() {
        this.speed = { x: 0, y: 0 };
    }

    // Método para reiniciar la velocidad de deslizamiento
    resetSlide(momentum = false) {
        if (momentum && this.hurtBy === FighterHurtBy.FIGHTER) {
            this.enemy.slideSpeed = this.slideSpeed;
            this.enemy.slideFriction = this.slideFriction;
        }
        this.slideSpeed = 0;
        this.slideFriction = 0;
    }

    // Método para obtener la dirección del personaje
    getDirection = () => {
        if (this.position.x + this.boxes.push.x + this.boxes.push.width <= this.enemy.position.x + this.enemy.boxes.push.x) {
            return FighterDirection.RIGHT;
        } else if (this.position.x + this.boxes.push.x >= this.enemy.position.x + this.enemy.boxes.push.x + this.enemy.boxes.push.width) {
            return FighterDirection.LEFT;
        }

        return this.direction;
    }

    // Método para obtener las dimensiones de las cajas en un determinado frame
    getBoxes(frameKey) {
        const [,
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0, 0, 0, 0], body = [0, 0, 0, 0], feet = [0, 0, 0, 0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],
        ] = this.frames.get(frameKey);
        return {
            push: { x: pushX, y: pushY, width: pushWidth, height: pushHeight },
            hurt: {
                [FighterHurtBox.HEAD]: head,
                [FighterHurtBox.BODY]: body,
                [FighterHurtBox.FEET]: feet,
            },
            hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },
        }
    }

    // Método para cambiar el estado del personaje
    changeState(newState, time, args) {
        if (newState === this.currentState || !this.states[newState].validFrom.includes(this.currentState)) {
            return;
        }

        this.currentState = newState;
        this.animationFrame = 0;
        this.states[this.currentState].init(time, args);
    };

    // Método para manejar la inicialización del estado IDLE
    handleIdleInit() {
        this.resetSpeed();
        this.attackLanded = false;
    }

    // Método para manejar el estado IDLE
    handleIdleState() {
        if (this.startTimer < 100) {
            if (control.isForwards(this.playerId, this.direction)) {
                this.changeState(FighterState.WALK_FORWARD);
            } else if (control.isBackwards(this.playerId, this.direction)) {
                this.changeState(FighterState.WALK_BACKWARDS);
            } else if (control.isUp(this.playerId)) {
                this.changeState(FighterState.JUMP_START);
            } else if (control.isDown(this.playerId)) {
                this.changeState(FighterState.CROUCH_DOWN);
            } else if (control.isLP(this.playerId)) {
                this.changeState(FighterState.LP);
            } else if (control.isMP(this.playerId)) {
                this.changeState(FighterState.MP);
            } else if (control.isHP(this.playerId)) {
                this.changeState(FighterState.HP);
            } else if (control.isLK(this.playerId)) {
                this.changeState(FighterState.LK);
            } else if (control.isMK(this.playerId)) {
                this.changeState(FighterState.MK);
            } else if (control.isHK(this.playerId)) {
                this.changeState(FighterState.HK);
            }

            const newDirection = this.getDirection();

            if (newDirection !== this.direction) {
                this.direction = newDirection;
                this.changeState(FighterState.IDLE_TURN);
            }
        }

    }

    // Método para manejar el estado WALK_FORWARD
    handleWalkForwardsState() {
        if (!control.isForwards(this.playerId, this.direction)) {
            this.changeState(FighterState.IDLE);
        } else if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        } else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }

        if (control.isLP(this.playerId)) {
            this.changeState(FighterState.LP);
        } else if (control.isMP(this.playerId)) {
            this.changeState(FighterState.MP);
        } else if (control.isHP(this.playerId)) {
            this.changeState(FighterState.HP);
        } else if (control.isLK(this.playerId)) {
            this.changeState(FighterState.LK);
        } else if (control.isMK(this.playerId)) {
            this.changeState(FighterState.MK);
        } else if (control.isHK(this.playerId)) {
            this.changeState(FighterState.HK);
        }

        this.direction = this.getDirection();
    }

    // Método para manejar el estado WALK_BACKWARDS
    handleWalkBackwardsState() {
        if (!control.isBackwards(this.playerId, this.direction)) {
            this.changeState(FighterState.IDLE);
        } else if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        } else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }

        if (control.isLP(this.playerId)) {
            this.changeState(FighterState.LP);
        } else if (control.isMP(this.playerId)) {
            this.changeState(FighterState.MP);
        } else if (control.isHP(this.playerId)) {
            this.changeState(FighterState.HP);
        } else if (control.isLK(this.playerId)) {
            this.changeState(FighterState.LK);
        } else if (control.isMK(this.playerId)) {
            this.changeState(FighterState.MK);
        } else if (control.isHK(this.playerId)) {
            this.changeState(FighterState.HK);
        }

        this.direction = this.getDirection();
    }

    // Método para manejar la inicialización de los estados WALK
    handleMoveInit() {
        this.speed.x = this.initSpeed.x[this.currentState] ?? 0;
    }

    // Método para manejar la inicialización del estado JUMP_UP, JUMP_FORWARD Y JUMP_BACKWARDS
    handleJumpInit() {
        this.speed.y = this.initSpeed.jump;
        this.handleMoveInit();
    }

    // Método para manejar los estados JUMP_UP, JUMP_FORWARD Y JUMP_BACKWARDS
    handleJumpState(time) {
        this.speed.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND);
        }
    }

    // Método para manejar la inicialización del estado CROUCH
    handleCrouchInit() {
        this.attackLanded = false;
    }

    // Método para manejar el estado CROUCH
    handleCrouchState() {
        if (!control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_UP);
        }

        if (control.isCLP(this.playerId)) {
            this.changeState(FighterState.CLP);
        }

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN);
        }
    }

    // Método para manejar la inicialización del estado CROUCH_DOWN
    handleCrouchDownInit() {
        this.resetSpeed();
    }

    // Método para manejar el estado CROUCH
    handleCrouchDownState() {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.CROUCH);
        }

        if (!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_UP;
            this.animationFrame = this.animations[FighterState.CROUCH_UP][this.animationFrame].length - this.animationFrame;
        }
    }

    // Método para manejar el estado CROUCH_UP
    handleCrouchUpState() {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.IDLE);
        }
    }

    // Método para manejar la inicialización del estado JUMP_START
    handleJumpStartInit() {
        this.resetSpeed();
    }

    // Método para manejar el estado JUMP_START
    handleJumpStartState() {
        if (this.isAnimationCompleted()) {
            if (control.isBackwards(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARDS);
            } else if (control.isForwards(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD);
            } else {
                this.changeState(FighterState.JUMP_UP);
            }
        }
    }

    // Método para manejar la inicialización del estado JUMP_LAND
    handleJumpLandInit() {
        this.resetSpeed();
    }

    // Método para manejar el estado JUMP_LAND
    handleJumpLandState() {
        if (this.animationFrame < 1) {
            return;
        }

        let newState = FighterState.IDLE;

        if (!control.isIdle(this.playerId)) {
            this.direction = this.getDirection();
            this.handleIdleState();
        } else {
            const newDirection = this.getDirection();
            if (newDirection !== this.direction) {
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            } else {
                if (!this.isAnimationCompleted()) {
                    return;
                }
            }
        }
        this.changeState(newState);
    }

    // Método para manejar el estado IDLE_TURN
    handleIdleTurnState() {
        this.handleIdleState();

        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.IDLE);
    }

    // Método para manejar el estado CROUCH_TURN
    handleCrouchTurnState() {
        this.handleCrouchState();

        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.CROUCH);
    }

    // Método para manejar la inicialización de los estados LIGHT (LP, LK, CLP)
    handleLightInit() {
        this.resetSpeed();
        this.isAttacking = true;
    }

    // Método para manejar el estado LP
    handleLPState() {
        if (this.animationFrame < 2) {
            return;
        }

        if (control.isLP(this.playerId)) {
            this.animationFrame = 0;
        }

        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.IDLE);
    }

    // Método para manejar la inicialización de los estados MEDIUM (MP, MK)
    handleMediumInit() {
        this.resetSpeed();
        this.isAttacking = true;
    }

    // Método para manejar la inicialización de los estados HEAVY (HP, HK)
    handleHeavyInit() {
        this.resetSpeed();
        this.isAttacking = true;
    }

    // Método para manejar los estados MP y HP
    handleMPState() {
        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.IDLE);
    }

    // Método para manejar el estado LK
    handleLKState() {
        if (this.animationFrame < 2) {
            return;
        }

        if (control.isLK(this.playerId)) {
            this.animationFrame = 0;
        }

        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.IDLE);
    }

    // Método para manejar los estados MK y HK
    handleMKState() {
        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.IDLE);
    }

    // Método para manejar el estado CLP
    handleCLPState() {
        if (this.animationFrame < 2) {
            return;
        }

        if (control.isCLP(this.playerId)) {
            this.animationFrame = 0;
        }

        if (!this.isAnimationCompleted()) {
            return;
        }
        this.changeState(FighterState.CROUCH);
    }

    // Método para manejar la inicialización de los estados HURT (HEAD_L/M/H, BODY_L/M/H)
    handleHurtInit() {
        this.resetSpeed();
        this.hurtShake = 2;
        this.hurtShakeTimer = performance.now();
    }

    // Método para manejar los estados HURT (HEAD_L/M/H, BODY_L/M/H) 
    handleHurtState() {
        if (!this.isAnimationCompleted()) return;
        this.hurtShake = 0;
        this.hirtShakeTimer = 0;
        this.hurtBy = undefined;
        this.changeState(FighterState.IDLE);
    }

    // Método para asignar que estado recibe el personaje según la zona golpeada
    getHitState(attackDmg, hitLocation) {
        switch (attackDmg) {
            case FighterAttackDmg.L:
                if (hitLocation === FighterHurtBox.HEAD) {
                    return FighterState.HURT_HEAD_L;
                }
                return FighterState.HURT_BODY_L;
            case FighterAttackDmg.M:
                if (hitLocation === FighterHurtBox.HEAD) {
                    return FighterState.HURT_HEAD_M;
                }
                return FighterState.HURT_BODY_M;
            case FighterAttackDmg.H:
                if (hitLocation === FighterHurtBox.HEAD) {
                    return FighterState.HURT_HEAD_H;
                }
                return FighterState.HURT_BODY_H;
        }
    }

    // Método para manejar la colisión de un ataque
    handleAttackHit(time, attackDmg, attackType, hitLocation, hurtBy) {
        const newState = this.getHitState(attackDmg, hitLocation);
        const attackData = FighterAttackBaseData[attackDmg];

        this.hurtBy = hurtBy;
        if (attackData && attackData.slide) {
            const { speed, friction } = attackData.slide;
            this.slideSpeed = speed;
            this.slideFriction = friction;
        }

        this.onAttackHit(time, this.enemy.playerId, this.playerId, attackDmg);
        this.attackLanded = true;
        this.changeState(newState);
    }

    // Método para actualizar las restricciones del escenario
    updateStageConstraints(time, ctx, camera) {
        if (this.position.x > camera.position.x + ctx.canvas.width - this.boxes.push.width) {
            this.position.x = camera.position.x + ctx.canvas.width - this.boxes.push.width;
            this.resetSlide(true);
        }

        if (this.position.x < camera.position.x + this.boxes.push.width) {
            this.position.x = camera.position.x + this.boxes.push.width;
            this.resetSlide(true);
        }

        if (this.hasCollidedWithOpponent()) {
            if (this.position.x <= this.enemy.position.x) {
                this.position.x = Math.max(
                    (this.enemy.position.x + this.enemy.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + this.boxes.push.width,
                );

                if ([FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARDS,].includes(this.enemy.currentState)) {
                    this.enemy.position.x += PUSH_SPEED * time.secondsPassed;
                }
            }

            if (this.position.x >= this.enemy.position.x) {
                this.position.x = Math.min(
                    (this.enemy.position.x + this.enemy.boxes.push.x + this.enemy.boxes.push.width) + (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + ctx.canvas.width - this.boxes.push.width,
                );

                if ([FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARDS,].includes(this.enemy.currentState)) {
                    this.enemy.position.x -= PUSH_SPEED * time.secondsPassed;
                }
            }
        }
    }

    // Método para actualizar la animación del personaje
    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.prev <= this.animationTimer + frameDelay * FRAME_TIME) {
            return;
        }

        this.animationTimer = time.prev;

        if (frameDelay <= FrameDelay.FREEZE) {
            return;
        }

        this.animationFrame++;

        if (this.animationFrame >= animation.length) {
            this.animationFrame = 0;
        }

        this.boxes = this.getBoxes(animation[this.animationFrame][0]);
    }

    // Método para actualizar la colisión con la hitbox
    updateAttackBoxCollided(time) {
        const { type } = this.states[this.currentState];

        if (type || this.attackLanded) {
            return;
        }

        const actualHitBox = getBoxDimensions(this.position, this.direction, this.boxes.hit);

        for (const [hurtLocation, hurtBox] of Object.entries(this.enemy.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const enemyHurtBox = getBoxDimensions(this.enemy.position, this.enemy.direction, { x, y, width, height });

            if (boxOverlap(actualHitBox, enemyHurtBox)) {
                if (this.isAttacking) {
                    this.enemy.handleAttackHit(time, this.states[this.currentState].attackDmg, type, hurtLocation, FighterHurtBy.FIGHTER);
                    if (this.enemy.position.y < STAGE_FLOOR && FighterState.IDLE) {
                        this.enemy.position.y = STAGE_FLOOR;
                    }
                    this.isAttacking = false;
                    return;
                }
                return;
            }
        }
    }

    // Método para actualizar el deslizamiento del personaje
    updateSlide(time) {
        if (this.slideSpeed > 0) {
            return;
        }

        this.slideSpeed += this.slideFriction * time.secondsPassed;

        if (this.slideSpeed < 0) {
            return;
        }

        this.resetSlide();
    }

    // Método para actualizar la posición del personaje
    updatePosition(time) {
        this.position.x += ((this.speed.x + this.slideSpeed) * this.direction) * time.secondsPassed;
        this.position.y += this.speed.y * time.secondsPassed;
    }

    // Método para actualizar la vibración por daño
    updateHurtShake(time, delay) {
        if (this.hurtShakeTimer === 0 || time.prev <= this.hurtShakeTimer) {
            return;
        }
        const shakeAmount = (delay - time.prev < (FIGHTER_HURT_DELAY * FRAME_TIME) / 2 ? 1 : 2);
        this.hurtShake = shakeAmount - this.hurtShake;
        this.hurtShakeTimer = time.prev + FRAME_TIME;
    }

    // Método para actualizar la ejecución de un Hadouken
    updateHadouken(time) {
        for (const hadouken of this.specialMoves) {
            const result = hasHadoukenExecuted(hadouken, this.playerId, time);

            if (result) {
                this.changeState(hadouken.state, time, result);
            }
        }
    }

    // Método principal de actualización del personaje
    update(time, ctx, camera) {
        this.states[this.currentState].update(time, ctx);
        this.updateTime(time);
        this.updateHadouken(time);
        this.updateSlide(time);
        this.updatePosition(time);
        this.updateAnimation(time);
        this.updateStageConstraints(time, ctx, camera);
        this.updateAttackBoxCollided(time);
    }

    // Método para dibujar el personaje en el canvas
    draw(ctx, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [[
            [x, y, width, height],
            [originX, originY]

        ]] = this.frames.get(frameKey);

        ctx.scale(this.direction, 1);
        ctx.drawImage(
            this.image, x, y, width, height,
            Math.floor((this.position.x - this.hurtShake - camera.position.x) * this.direction) - originX,
            Math.floor(this.position.y - camera.position.y) - originY,
            width, height
        );

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
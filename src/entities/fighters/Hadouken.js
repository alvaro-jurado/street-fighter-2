import { FighterAttackDmg, FighterAttackType, FighterHurtBox, FighterHurtBy, FighterState } from "../../constants/fighters/fighter.js";
import { FRAME_TIME } from "../../constants/game/game.js";
import { HadoukenState, hadoukenCollisionState, hadoukenSpeed } from "../../constants/fighters/hadouken.js";
import { STAGE_FLOOR } from "../../constants/game/stage.js";
import { boxOverlap, getBoxDimensions } from "../../utils/Collisions.js";

// Definiendo las coordenadas de los frames de la animación y las colisiones de Hadouken
const frames = new Map([
    ['hadouken-1', [[[400, 2756, 43, 32], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadouken-2', [[[460, 2761, 56, 28], [37, 14]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadouken-3', [[[0, 0, 0, 0], [0, 0]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['collision-1', [[[543, 2767, 26, 20], [13, 10]], [0, 0, 0, 0]]],
    ['collision-2', [[[590, 2766, 15, 25], [9, 13]], [0, 0, 0, 0]]],
    ['collision-3', [[[625, 2764, 28, 28], [26, 14]], [0, 0, 0, 0]]],
]);

// Definiendo las animaciones de Hadouken en diferentes estados
const animations = {
    [HadoukenState.ACTIVE]: [['hadouken-1', 2], ['hadouken-3', 2], ['hadouken-2', 2], ['hadouken-3', 2]],
    [HadoukenState.COLLISION]: [['collision-1', 9], ['collision-2', 5], ['collision-3', 9]],
};

export class Hadouken {
    // Imagen del Hadouken y variables de estado y animación
    image = document.querySelector('img[alt="ken"]');
    animationFrame = 0;
    state = HadoukenState.ACTIVE;

    // Constructor que inicializa el Hadouken con las posiciones y características adecuadas
    constructor(args, time, entityList) {
        const [fighter, damage] = args;
        this.fighter = fighter;
        this.entityList = entityList;
        this.speed = hadoukenSpeed[damage];
        this.direction = this.fighter.direction;
        this.position = {
            x: this.fighter.position.x + (76 * this.direction),
            y: this.fighter.position.y - 57,
        }
        this.animationTimer = time.prev;
    }

    // Verifica si el Hadouken ha colisionado con el enemigo
    hasCollidedEnemy(hitbox) {
        for (const [, hurtBox] of Object.entries(this.fighter.enemy.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const enemyHurtBox = getBoxDimensions(this.fighter.enemy.position, this.fighter.enemy.direction, { x, y, width, height });

            if (boxOverlap(hitbox, enemyHurtBox)) {
                if (this.fighter.enemy.position.y < STAGE_FLOOR && FighterState.IDLE) {
                    this.fighter.enemy.position.y = STAGE_FLOOR;
                }
                return hadoukenCollisionState.ENEMY;
            }
        }
    }

    // Verifica si el Hadouken ha colisionado con otro Hadouken enemigo
    hasCollidedWithHadouken(hitbox) {
        const enemyHadouken = this.entityList.entities.filter((hadouken) => hadouken instanceof Hadouken && hadouken !== this);
        if (enemyHadouken.length === 0) {
            return;
        }

        for (const hadouken of enemyHadouken) {
            const [x, y, width, height] = frames.get(animations[hadouken.state][hadouken.animationFrame][0])[1];
            const enemyHadoukenActualHitBox = getBoxDimensions(hadouken.position, hadouken.direction, { x, y, width, height });

            if (boxOverlap(hitbox, enemyHadoukenActualHitBox)) {
                return hadoukenCollisionState.HADOUKEN;
            }
        }
    }

    // Verifica si el Hadouken ha colisionado con algo (enemigo u otro Hadouken)
    hasCollided() {
        const [x, y, width, height] = frames.get(animations[this.state][this.animationFrame][0])[1];
        const actualHitBox = getBoxDimensions(this.position, this.direction, { x, y, width, height });

        return this.hasCollidedEnemy(actualHitBox) ?? this.hasCollidedWithHadouken(actualHitBox);
    }

    // Actualiza el movimiento del Hadouken en el tiempo y maneja las colisiones
    updateMovement(time, camera) {
        if (this.state != HadoukenState.ACTIVE) {
            return;
        }

        this.position.x += (this.speed * this.direction) * time.secondsPassed;

        if (this.position.x - camera.position.x > 384 + 56 || this.position.x - camera.position.x < -56) {
            this.entityList.remove(this);
        }

        const hasCollided = this.hasCollided();
        if (!hasCollided) {
            return;
        }

        this.state = HadoukenState.COLLISION;
        this.animationFrame = 0;
        this.animationTimer = time.prev + animations[this.state][this.animationFrame][1] * FRAME_TIME;

        if (hasCollided !== hadoukenCollisionState.ENEMY) {
            return;
        }

        this.fighter.enemy.handleAttackHit(time, FighterAttackDmg.H, FighterAttackType.PUNCH, FighterHurtBox.HEAD, FighterHurtBy.HADOUKEN);
    }

    // Actualiza la animación del Hadouken en el tiempo
    updateAnimation(time) {
        if (time.prev < this.animationTimer) {
            return;
        }

        this.animationFrame += 1;

        if (this.animationFrame >= animations[this.state].length) {
            this.animationFrame = 0;
            if (this.state === HadoukenState.COLLISION) {
                this.entityList.remove(this);
            }
        }

        this.animationTimer = time.prev + animations[this.state][this.animationFrame][1] * FRAME_TIME;
    }

    // Actualiza tanto el movimiento como la animación del Hadouken en el tiempo
    update(time, _, camera) {
        this.updateMovement(time, camera);
        this.updateAnimation(time);
    }

    // Dibuja el frame actual del Hadouken en el contexto del canvas
    draw(ctx, camera) {
        const [frameKey] = animations[this.state][this.animationFrame];
        const [[
            [x, y, width, height],
            [originX, originY]
        ]] = frames.get(frameKey);

        ctx.scale(this.direction, 1);
        ctx.drawImage(
            this.image, x, y, width, height,
            Math.floor((this.position.x - camera.position.x) * this.direction - originX),
            Math.floor(this.position.y - camera.position.y - originY),
            width, height
        );

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

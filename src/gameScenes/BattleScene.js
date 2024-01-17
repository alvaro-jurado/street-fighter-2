import { Ryu } from "../entities/fighters/profiles/Ryu.js";
import { Ken } from "../entities/fighters/profiles/Ken.js";
import { Stage } from "../entities/overlays/Stage.js";
import { Overlay } from "../entities/overlays/Overlay.js";
import { Camera } from "../utils/Camera.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../constants/game/stage.js";
import { gameState } from "../state/GameState.js";
import { FIGHTER_HURT_DELAY, FighterAttackBaseData, FighterId } from "../constants/fighters/fighter.js";
import { FRAME_TIME } from "../constants/game/game.js";
import { EntityList } from "../entities/EntityList.js";
import { controlMove } from "../utils/MoveHistory.js";

export class BattleScene {
    fighters = [];        // Lista de luchadores
    camera = undefined;    // Objeto de la cámara
    hurtTimer = undefined; // Temporizador para el efecto del golpe
    fighterOrder = [0, 1]; // Orden de los luchadores

    constructor() {
        this.stage = new Stage();
        this.entities = new EntityList();
        this.overlays = [
            new Overlay(this.state),
        ];

        this.startRound();
    }

    // Método para obtener la clase de entidad del luchador
    getFighterEntityClass(id) {
        switch (id) {
            case FighterId.RYU:
                return Ryu;
            case FighterId.KEN:
                return Ken;
            default:
                throw new Error('Undefined Fighter Entity');
        }
    }

    // Método para obtener la entidad del luchador
    getFighterEntity(fighterState, index) {
        const FighterEntityClass = this.getFighterEntityClass(fighterState.id);
        return new FighterEntityClass(index, this.handleAttackHit.bind(this), this.entities);
    }

    // Método para obtener las entidades de los luchadores
    getFighterEntities() {
        const fighterEntities = gameState.fighters.map(this.getFighterEntity.bind(this));

        fighterEntities[0].enemy = fighterEntities[1];
        fighterEntities[1].enemy = fighterEntities[0];

        return fighterEntities;
    }

    // Método para controlar el impacto de un ataque
    handleAttackHit(time, playerId, enemyId, damage) {
        gameState.fighters[enemyId].hitPoints -= FighterAttackBaseData[damage].damage;

        this.hurtTimer = time.prev + (FIGHTER_HURT_DELAY * FRAME_TIME);
        this.fighterOrder = [enemyId, playerId];
    }

    // Método para iniciar una nueva ronda de combate
    startRound() {
        this.fighters = this.getFighterEntities();
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - 192, 16, this.fighters);
    }

    // Método para actualizar los luchadores
    updateFighters(time, ctx) {
        for (const fighter of this.fighters) {
            controlMove(time, fighter.playerId, fighter.direction);
            if (time.prev < this.hurtTimer) {
                fighter.updateHurtShake(time, this.hurtTimer);
            } else {
                fighter.update(time, ctx, this.camera);
            }
        }
    }

    // Método para actualizar las superposiciones en la pantalla
    updateOverlays(time, ctx) {
        for (const overlay of this.overlays) {
            overlay.update(time, ctx, this.camera);
        }
    }

    // Método para verificar si la pelea ha terminado
    isFightOver() {
        return this.overlays.some(overlay => overlay.isFightOver());
    }

    // Método para actualizar la escena de batalla
    update(time, ctx) {
        if (!this.isFightOver()) {
            this.updateFighters(time, ctx);
            this.stage.update(time);
            this.entities.update(time, ctx, this.camera);
            this.camera.update(time, ctx);
            this.updateOverlays(time, ctx);
        }
    }

    // Método para dibujar los luchadores en la pantalla
    drawFighters(ctx) {
        for (const fighterId of this.fighterOrder) {
            this.fighters[fighterId].draw(ctx, this.camera);
        }
    }

    // Método para dibujar las superposiciones en la pantalla
    drawOverlays(ctx) {
        for (const overlay of this.overlays) {
            overlay.draw(ctx, this.camera);
        }
    }

    // Método para dibujar la escena de batalla completa
    draw(ctx) {
        this.stage.draw(ctx, this.camera);
        this.drawFighters(ctx);
        this.entities.draw(ctx, this.camera)
        this.drawOverlays(ctx);
    }
}

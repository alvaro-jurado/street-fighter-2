import { SCROLL_BOUNDS, STAGE_HEIGHT, STAGE_PADDING, STAGE_WIDTH } from "../constants/game/stage.js";

export class Camera {
    // Constructor que inicializa la posición de la cámara, la velocidad y los luchadores
    constructor(x, y, fighters) {
        this.position = { x, y };
        this.fighters = fighters;

        // Velocidad de desplazamiento de la cámara
        this.speed = 60;
    }

    // Método que actualiza la posición de la cámara en función de la posición de los luchadores y los límites del escenario
    update(_, ctx) {
        // Ajusta la posición vertical de la cámara para seguir a los luchadores
        this.position.y = -6 + Math.floor(Math.min(this.fighters[1].position.y, this.fighters[0].position.y) / 10);

        // Calcula los límites horizontal del área visible en la pantalla
        const lowerX = Math.min(this.fighters[1].position.x, this.fighters[0].position.x);
        const higherX = Math.max(this.fighters[1].position.x, this.fighters[0].position.x);

        // Ajusta la posición horizontal de la cámara para seguir a los luchadores
        if (higherX - lowerX > ctx.canvas.width - SCROLL_BOUNDS * 2) {
            const midPoint = (higherX - lowerX) / 2;
            this.position.x = lowerX + midPoint - (ctx.canvas.width / 2);
        } else {
            // Ajusta la posición horizontal de la cámara para mantener a los luchadores dentro de los límites de desplazamiento
            for (const fighter of this.fighters) {
                if (fighter.position.x < this.position.x + SCROLL_BOUNDS) {
                    this.position.x = fighter.position.x - SCROLL_BOUNDS;
                } else if (fighter.position.x > this.position.x + ctx.canvas.width - SCROLL_BOUNDS) {
                    this.position.x = fighter.position.x - ctx.canvas.width + SCROLL_BOUNDS;
                }
            }
        }

        // Limita la posición de la cámara para evitar que se salga de los límites del escenario
        if (this.position.x < STAGE_PADDING) {
            this.position.x = STAGE_PADDING;
        }

        if (this.position.x > STAGE_WIDTH + STAGE_PADDING - ctx.canvas.width) {
            this.position.x = STAGE_WIDTH + STAGE_PADDING - ctx.canvas.width;
        }

        if (this.position.y < 0) {
            this.position.y = 0;
        }

        if (this.position.y > STAGE_HEIGHT - ctx.canvas.height) {
            this.position.y = STAGE_HEIGHT - ctx.canvas.height;
        }
    }
}

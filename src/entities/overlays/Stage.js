import { drawFrame } from "../../utils/ctx.js";

export class Stage {
    constructor() {
        this.image = document.querySelector('img[alt="stage"]');

        // Definición de los frames de los elementos del stage
        this.frames = new Map([
            ['stage-background', [72, 208, 768, 176]],
            ['stage-boat', [8, 16, 521, 180]],
            ['stage-ground', [8, 392, 896, 72]],
        ]);
    }

    // Método de actualización del escenario (aún no implementado)
    update() {
        // Implementación pendiente
    }

    // Método para dibujar un frame específico en el canvas
    drawFrame(ctx, frameKey, x, y) {
        // Utiliza la función drawFrame importada para dibujar el frame correspondiente
        drawFrame(ctx, this.image, this.frames.get(frameKey), x, y);
    }

    // Método para dibujar el escenario completo en el canvas utilizando diferentes frames
    draw(ctx, camera) {
        // Dibuja el fondo del escenario ajustando la posición según la posición de la cámara
        this.drawFrame(ctx, 'stage-background', Math.floor(16 - (camera.position.x / 2.157303)), - camera.position.y);
        
        // Dibuja el barco en el escenario ajustando la posición según la posición de la cámara
        this.drawFrame(ctx, 'stage-boat', Math.floor(150 - (camera.position.x / 1.613445)), -1 - camera.position.y);
        
        // Dibuja el suelo del escenario ajustando la posición según la posición de la cámara
        this.drawFrame(ctx, 'stage-ground', Math.floor(192 - camera.position.x), 176 - camera.position.y);
    }
}

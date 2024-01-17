import { receiveControllers, registerControllerEvents, registerKeyboardEvents } from "../utils/InputHandler.js";
import { getContext } from "../utils/ctx.js";
import { BattleScene } from "../gameScenes/BattleScene.js";

export class StreetFighterGame {
    // Obtención del contexto de renderizado
    ctx = getContext();

    // Objeto para el seguimiento del tiempo de fotograma
    frameTime = {
        prev: 0,
        secondsPassed: 0,
    };

    constructor() {
        // Creación de una nueva escena de batalla al iniciar el juego
        this.scene = new BattleScene();
    }

    // Función para manejar cada fotograma del juego
    frame(time) {
        // Solicitar la ejecución de esta función en el próximo fotograma
        window.requestAnimationFrame(this.frame.bind(this));

        // Cálculos relacionados con el tiempo transcurrido desde el último fotograma
        this.frameTime = {
            secondsPassed: (time - this.frameTime.prev) / 1000,
            prev: time,
        }

        // Recepción de datos de los controladores de juego (teclado, joystick, etc.)
        receiveControllers();

        // Actualización y dibujo de la escena actual del juego
        this.scene.update(this.frameTime, this.ctx);
        this.scene.draw(this.ctx);
    }

    // Función para iniciar el juego
    start() {
        // Registro de eventos de teclado para la interacción del jugador
        registerKeyboardEvents();

        // Registro de eventos de controladores para la interacción del jugador (No Funcional)
        registerControllerEvents();

        // Solicitar la ejecución de la función 'frame' para iniciar la animación del juego
        window.requestAnimationFrame(this.frame.bind(this));
    }
}

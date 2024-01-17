import { Control, ControllerThumbstick } from "../constants/battleControl/control.js";
import { controls } from "../config/controls.js";
import { FighterDirection } from "../constants/fighters/fighter.js";

// Conjuntos para mantener un seguimiento de las teclas mantenidas y las teclas presionadas por única vez
const heldKeys = new Set();
const pressedKeys = new Set();

// Mapa para almacenar información sobre los controladores conectados (No Funcional)
const controllers = new Map();
const pressedButtons = new Set();

// Obteniendo todas las teclas mapeadas desde la configuración
const mappedKeys = controls.map(({ keyboard }) => Object.values(keyboard)).flat();

// Función para manejar el evento de presionar una tecla
function handleKeyDown(event) {
    if (!mappedKeys.includes(event.code)) {
        return;
    }

    event.preventDefault();
    heldKeys.add(event.code);
}

// Función para manejar el evento de soltar una tecla
function handleKeyUp(event) {
    if (!mappedKeys.includes(event.code)) {
        return;
    }

    event.preventDefault();

    heldKeys.delete(event.code);
    pressedKeys.delete(event.code);
}

// Función para manejar el evento de conexión de un controlador (No Funcional)
function handleControllerConnected(event) {
    const { gamepad: { index, axis, buttons } } = event;
    controllers.set(index, { axis, buttons });
}

// Función para manejar el evento de desconexión de un controlador (No Funcional)
function handleControllerDisconnected(event) {
    const { gamepad: { index } } = event;
    controllers.delete(index);
}

// Funciones de registro de eventos para teclado y controladores
export function registerKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

export function registerControllerEvents() {
    window.addEventListener('gamepadconnected', handleControllerConnected);
    window.addEventListener('gamepaddisconnected', handleControllerDisconnected);
}

// Función para recibir información sobre los controladores conectados (No Funcional)
export function receiveControllers() {
    for (const controller of navigator.getGamepads()) {
        if (!controller) continue;

        if (controllers.has(controller.index)) {
            const { index, axis, buttons } = controller;

            controllers.set(index, { axis, buttons });

            for (const button in buttons) {
                const key = `${controller.index}-${button}`;

                if (pressedButtons.has(key) && isButtonUp(controller.index, button)) {
                    pressedButtons.delete(key);
                }
            }
        }
    }
}

// Funciones para verificar el estado de las teclas y botones
export const isKeyDown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);

export function isKeyPressed(code) {
    if (heldKeys.has(code) && !pressedKeys.has(code)) {
        pressedKeys.add(code);
        return true;
    }
    return false;
}

// Funciones para verificar el estado de los botones del controlador
export const isButtonDown = (padId, button) => controllers.get(padId)?.buttons[button].pressed ?? false;
export const isButtonUp = (padId, button) => !controllers.get(padId)?.buttons[button].pressed ?? false;

export function isButtonPressed(padId, button) {
    const key = `${padId}-${button}`;

    if (isButtonDown(padId, button) && !pressedButtons.has(key)) {
        pressedButtons.add(key);
        return true;
    }
    return false;
}

// Funciones para verificar el estado de los ejes del controlador (No Funcional)
export const isAxisGreater = (padId, axisId, value) => controllers.get(padId)?.axis[axisId] >= value;
export const isAxisLower = (padId, axisId, value) => controllers.get(padId)?.axis[axisId] <= value;

// Funciones para verificar el estado de controles específicos
export const isControlDown = (id, control) => isKeyDown(controls[id].keyboard[control]) || isButtonDown(id, controls[id].controller[control]);

export const isControlPressed = (id, control) => isKeyPressed(controls[id].keyboard[control]) || isButtonPressed(id, controls[id].controller[control]);

// Funciones para verificar el estado de movimiento
export const isLeft = (id) => isKeyDown(controls[id].keyboard[Control.LEFT])
    || isButtonDown(id, controls[id].controller[Control.LEFT])
    || isAxisLower(id, controls[id].controller[ControllerThumbstick.HORIZONTAL_AXIS],
        -controls[id].controller[ControllerThumbstick.DEADZONE],
    );
export const isRight = (id) => isKeyDown(controls[id].keyboard[Control.RIGHT])
    || isButtonDown(id, controls[id].controller[Control.RIGHT])
    || isAxisGreater(id, controls[id].controller[ControllerThumbstick.HORIZONTAL_AXIS],
        -controls[id].controller[ControllerThumbstick.DEADZONE],
    );
export const isUp = (id) => isKeyDown(controls[id].keyboard[Control.UP])
    || isButtonDown(id, controls[id].controller[Control.UP])
    || isAxisLower(id, controls[id].controller[ControllerThumbstick.VERTICAL_AXIS],
        -controls[id].controller[ControllerThumbstick.DEADZONE],
    );
export const isDown = (id) => isKeyDown(controls[id].keyboard[Control.DOWN])
    || isButtonDown(id, controls[id].controller[Control.DOWN])
    || isAxisGreater(id, controls[id].controller[ControllerThumbstick.VERTICAL_AXIS],
        -controls[id].controller[ControllerThumbstick.DEADZONE],
    );

// Funciones para verificar el estado de movimiento en una dirección específica
export const isForwards = (id, direction) => {
    if (direction === FighterDirection.RIGHT) {
        return isRight(id);
    } else {
        return isLeft(id);
    }
};

export const isBackwards = (id, direction) => {
    if (direction === FighterDirection.LEFT) {
        return isRight(id);
    } else {
        return isLeft(id);
    }
};

// Función para verificar si no hay entrada de movimiento
export const isIdle = (id) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id));

// Funciones para verificar el estado de presión de botones específicos
export const isLP = (id) => isControlPressed(id, Control.LP);
export const isMP = (id) => isControlPressed(id, Control.MP);
export const isHP = (id) => isControlPressed(id, Control.HP);

export const isLK = (id) => isControlPressed(id, Control.LK);
export const isMK = (id) => isControlPressed(id, Control.MK);
export const isHK = (id) => isControlPressed(id, Control.HK);

export const isCLP = (id) => isControlPressed(id, Control.CLP);

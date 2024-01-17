import * as control from "./InputHandler.js";
import { Control } from "../constants/battleControl/control.js";
import { HadoukenMoveButton, HadoukenMoveDirection } from "../constants/fighters/fighter.js";

// Constantes para el historial de movimientos y la demora entre movimientos
const MOVE_HISTORY_CAP = 10;
const MOVE_DELAY = 150;

// Historial de movimientos por cada jugador
export const moveHistory = [
    [
        {
            time: 0,
            move: undefined,
            buttons: [false, false, false, false, false, false],
        }
    ],
    [
        {
            time: 0,
            move: undefined,
            buttons: [false, false, false, false, false, false],
        }
    ]
];

// Orden de entrada de botones
export const inputOrder = [Control.LK, Control.MK, Control.HK, Control.LP, Control.MP, Control.HP];

// Función para determinar la dirección del movimiento
function getMoveDirection(controls) {
    if (controls.forward) {
        if (controls.down) {
            return HadoukenMoveDirection.FORWARD_DOWN;
        }
        if (controls.up) {
            return HadoukenMoveDirection.FORWARD_UP;
        }
        return HadoukenMoveDirection.FORWARD;
    } else if (controls.backward) {
        if (controls.down) {
            return HadoukenMoveDirection.BACKWARD_DOWN;
        }
        if (controls.up) {
            return HadoukenMoveDirection.BACKWARD_UP;
        }
        return HadoukenMoveDirection.BACKWARD;
    } else if (controls.down) {
        return HadoukenMoveDirection.DOWN;
    } else if (controls.up) {
        return HadoukenMoveDirection.UP;
    }

    return HadoukenMoveDirection.NONE;
}

// Función para obtener el control actual
function getCurrentControl(time, id, direction) {
    const controls = {
        forward: control.isForwards(id, direction),
        backward: control.isBackwards(id, direction),
        down: control.isDown(id, direction),
        up: control.isUp(id, direction),
    };

    return {
        time: time.prev,
        move: getMoveDirection(controls),
        buttons: inputOrder.map((button) => control.isControlDown(id, button)),
    }
}

// Función para verificar si la entrada actual es diferente de la última
function isDifferentInput(lastInput, id) {
    if (moveHistory[id][0].move !== lastInput.move || moveHistory[id][0].buttons.some((button, index) => lastInput.buttons[index] !== button)) {
        return true;
    }
    return false;
}

// Función para manejar el movimiento
export function controlMove(time, id, direction) {
    const currentControl = getCurrentControl(time, id, direction);

    if (!isDifferentInput(currentControl, id)) {
        return;
    }

    moveHistory[id].unshift(currentControl);
    if (moveHistory[id].length >= MOVE_HISTORY_CAP) {
        moveHistory[id].pop();
    }
}

// Función para verificar si los inputs son correctos
function matchedInputs(control, id) {
    switch (control) {
        case HadoukenMoveButton.PUNCH:
            for (let buttonIndex = 3; buttonIndex < 6; buttonIndex++) {
                if (moveHistory[id][0].buttons[buttonIndex]) {
                    return inputOrder[buttonIndex];
                }
            }
            break;
        case HadoukenMoveButton.KICK:
            for (let buttonIndex = 0; buttonIndex < 3; buttonIndex++) {
                if (moveHistory[id][0].buttons[buttonIndex]) {
                    return inputOrder[buttonIndex];
                }
            }
            break;
        default:
            if (control === moveHistory[id][0].move) {
                return true;
            }
    }
    return false;
}

// Función para verificar si se ha ejecutado el Hadouken
export function hasHadoukenExecuted(hadouken, id, time) {
    const controlMatchedInput = matchedInputs(hadouken.sequence[hadouken.cursor], id);

    if (!controlMatchedInput) {
        if (moveHistory[id][0].time + MOVE_DELAY < time.prev && hadouken.cursor > 1) {
            hadouken.cursor = 0;
        }
        return false;
    }

    if (hadouken.cursor === hadouken.sequence.length - 1) {
        hadouken.cursor = 0;
        return controlMatchedInput;
    }

    hadouken.cursor += 1;
    return false;
}

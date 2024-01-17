import { Control, ControllerThumbstick } from "../constants/battleControl/control.js";

// Definición de la constante 'controls', array de objetos representando configuraciones de controles
export const controls = [
    {
        // Configuración para mando (No Funcional)
        controller: {
            [ControllerThumbstick.DEADZONE]: 0.5,  // Zona muerta para el joystick (analógico)
            [ControllerThumbstick.HORIZONTAL_AXIS]: 0,  // Valor por defecto para el eje horizontal del joystick
            [ControllerThumbstick.VERTICAL_AXIS]: 1,  // Valor por defecto para el eje vertical del joystick

            // Mapeo de controles a botones específicos en el mando
            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.UP]: 12,
            [Control.DOWN]: 13,
            [Control.LP]: 2,
            [Control.MP]: 3,
            [Control.HP]: 5,
            [Control.LK]: 0,
            [Control.MK]: 1,
            [Control.HK]: 4,
            [Control.CLP]: 6,
        },
        // Configuración para teclado
        keyboard: {
            // Mapeo de controles a teclas específicas en el teclado
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LP]: 'KeyH',
            [Control.MP]: 'KeyJ',
            [Control.HP]: 'KeyK',
            [Control.LK]: 'KeyY',
            [Control.MK]: 'KeyU',
            [Control.HK]: 'KeyI',
            [Control.CLP]: 'KeyH',
        },
    },
    {
        // Configuración para un segundo mando (No Funcional) 
        controller: {
            [ControllerThumbstick.DEADZONE]: 0.5,
            [ControllerThumbstick.HORIZONTAL_AXIS]: 0,
            [ControllerThumbstick.VERTICAL_AXIS]: 1,

            // Mapeo de controles a botones específicos en el mando
            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.UP]: 12,
            [Control.DOWN]: 13,
            [Control.LP]: 2,
            [Control.MP]: 3,
            [Control.HP]: 5,
            [Control.LK]: 0,
            [Control.MK]: 1,
            [Control.HK]: 4,
            [Control.CLP]: 6,
        },
        // Configuración para teclado
        keyboard: {
            // Mapeo de controles a teclas específicas en el teclado
            [Control.LEFT]: 'ArrowLeft',
            [Control.RIGHT]: 'ArrowRight',
            [Control.UP]: 'ArrowUp',
            [Control.DOWN]: 'ArrowDown',
            [Control.LP]: 'Numpad4',
            [Control.MP]: 'Numpad5',
            [Control.HP]: 'Numpad6',
            [Control.LK]: 'Numpad7',
            [Control.MK]: 'Numpad8',
            [Control.HK]: 'Numpad9',
            [Control.CLP]: 'Numpad4',
        },
    },
];

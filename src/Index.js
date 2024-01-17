import { StreetFighterGame } from "./game/StreetFighterGame.js";

window.addEventListener('load', function () {
    // Crea una nueva instancia de la clase StreetFighterGame
    // y llama al método start() para iniciar el juego
    new StreetFighterGame().start();
});

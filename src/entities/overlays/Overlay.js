import { TIME_DELAY, TIME_LOW_DELAY, TIME_FRAME_KEYS, HP_MAX_PTS, HP_RED, KO_ANIMATION, KO_LOW_DELAY, HP_LOW_PTS } from "../../constants/battleControl/battle.js";
import { FPS } from "../../constants/game/game.js";
import { gameState } from "../../state/GameState.js";
import { drawFrame } from "../../utils/ctx.js";

export class Overlay {
    constructor() {
        // Inicialización de propiedades y obtención de elementos del DOM
        this.image = document.querySelector('img[alt=miscelaneous]');
        this.kenFace = document.querySelector('img[alt="ken"]');
        this.ryuFace = document.querySelector('img[alt="ryu"]');
        this.time = 107; // Tiempo inicial
        this.timer = 0;
        this.timeLowTimer = 0;
        this.useLowTimeFrames = false;

        this.canvas = document.querySelector('canvas');

        this.endgame = document.getElementById('end-game');
        this.wins = document.getElementById('wins');

        // Configuración de eventos de mouse en el canvas
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));

        // Inicialización de barras de salud y animación de KO
        this.healthBars = [{
            timer: 0,
            hitPoints: HP_MAX_PTS,
        },
        {
            timer: 0,
            hitPoints: HP_MAX_PTS,
        }];

        this.koFrame = 0;
        this.koAnimationTimer = 0;

        this.isRyuNameDrawn = false;
        this.isKenNameDrawn = false;

        // Definición de frames para diferentes elementos del juego (Barras vida, KO, Timer, etc.)
        this.frames = new Map([
            ['health-bar', [16, 18, 145, 11]],
            ['ko-white', [161, 16, 32, 14]],
            ['ko-red', [161, 1, 32, 14]],

            [`${TIME_FRAME_KEYS[0]}-0`, [16, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-1`, [32, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-2`, [48, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-3`, [64, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-4`, [80, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-5`, [96, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-6`, [112, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-7`, [128, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-8`, [144, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-9`, [160, 32, 14, 16]],

            [`${TIME_FRAME_KEYS[1]}-0`, [16, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-1`, [32, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-2`, [48, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-3`, [64, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-4`, [80, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-5`, [96, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-6`, [112, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-7`, [128, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-8`, [144, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-9`, [160, 192, 14, 16]],

            ['name-ryu', [16, 56, 28, 9]],
            ['name-ken', [128, 56, 30, 9]],

            ['fight', [16, 168, 63, 18]],

            ['ryu-win-face', [1264, 84, 128, 111]],
            ['ryu-lose-face', [1126, 334, 128, 108]],
            ['ken-win-face', [132, 114, 128, 112]],
            ['ken-lose-face', [261, 114, 128, 112]],

            ['time-over', [352, 112, 64, 30]],
            ['draw-game', [427, 114, 59, 26]],

            ['w', [101, 125, 11, 10]],
            ['i', [127, 113, 5, 10]],
            ['n', [185, 113, 11, 10]],
            ['s', [53, 125, 10, 10]],

            ['p', [17, 125, 10, 10]],
            ['l', [161, 113, 10, 10]],
            ['a', [29, 113, 11, 10]],
            ['y', [125, 125, 11, 10]],
            ['g', [101, 113, 10, 10]],

            ['t', [65, 125, 10, 10]],
            ['e', [77, 113, 10, 10]],
            ['c', [53, 113, 10, 10]],
            ['r', [41, 125, 11, 10]],
            ['v', [89, 125, 10, 10]],

        ]);

        // Generación de nombres de personajes a partir del estado del juego
        this.names = gameState.fighters.map(({ id }) => `name-${id.toLowerCase()}`)
    }

    // Maneja eventos de clic en el canvas
    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        const playAgainBounds = {
            x: 95,
            y: 160,
            width: 79,
            height: 10,
        };

        const titleScreenBounds = {
            x: 205,
            y: 160,
            width: 90,
            height: 10,
        };

        if (this.time <= 0 || this.healthBars[1].hitPoints <= 0 || this.healthBars[0].hitPoints <= 0) {
            if (clickX >= playAgainBounds.x && clickX <= playAgainBounds.x + playAgainBounds.width &&
                clickY >= playAgainBounds.y && clickY <= playAgainBounds.y + playAgainBounds.height) {
                this.handlePlayAgainClick();
            }

            if (clickX >= titleScreenBounds.x && clickX <= titleScreenBounds.x + titleScreenBounds.width &&
                clickY >= titleScreenBounds.y && clickY <= titleScreenBounds.y + titleScreenBounds.height) {
                this.handleTitleScreenClick();
            }
        }
    }

    // Maneja eventos de movimiento del mouse en el canvas
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const playAgainBounds = {
            x: 95,
            y: 160,
            width: 79,
            height: 10,
        };

        const titleScreenBounds = {
            x: 205,
            y: 160,
            width: 90,
            height: 10,
        };

        if (this.time <= 0 || this.healthBars[1].hitPoints <= 0 || this.healthBars[0].hitPoints <= 0) {
            if ((mouseX >= playAgainBounds.x && mouseX <= playAgainBounds.x + playAgainBounds.width &&
                mouseY >= playAgainBounds.y && mouseY <= playAgainBounds.y + playAgainBounds.height) ||
                (mouseX >= titleScreenBounds.x && mouseX <= titleScreenBounds.x + titleScreenBounds.width &&
                    mouseY >= titleScreenBounds.y && mouseY <= titleScreenBounds.y + titleScreenBounds.height)) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    // Maneja clic en el botón "Play Again"
    handlePlayAgainClick() {
        location.reload();
    }

    // Maneja clic en el botón "Title Screen"
    handleTitleScreenClick() {
        window.location.href = '../title-screen.html';
    }

    // Dibuja un fondo negro en el canvas
    drawBlackBackground(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 384, 244,);
        ctx.rect(0, 0, 384, 244,);
        ctx.stroke();
    }

    // Dibuja los elementos para reiniciar o ir al título en el canvas
    drawPlayAgainAndTitleScreen(ctx) {
        this.drawFrame(ctx, 'p', 75, 160);
        this.drawFrame(ctx, 'l', 85, 160);
        this.drawFrame(ctx, 'a', 95, 160);
        this.drawFrame(ctx, 'y', 105, 160);
        this.drawFrame(ctx, 'a', 125, 160);
        this.drawFrame(ctx, 'g', 135, 160);
        this.drawFrame(ctx, 'a', 145, 160);
        this.drawFrame(ctx, 'i', 155, 160);
        this.drawFrame(ctx, 'n', 160, 160);

        this.drawFrame(ctx, 't', 205, 160);
        this.drawFrame(ctx, 'i', 215, 160);
        this.drawFrame(ctx, 't', 220, 160);
        this.drawFrame(ctx, 'l', 230, 160);
        this.drawFrame(ctx, 'e', 240, 160);
        this.drawFrame(ctx, 's', 260, 160);
        this.drawFrame(ctx, 'c', 270, 160);
        this.drawFrame(ctx, 'r', 280, 160);
        this.drawFrame(ctx, 'e', 290, 160);
        this.drawFrame(ctx, 'e', 300, 160);
        this.drawFrame(ctx, 'n', 310, 160);
    }

    // Dibuja un frame específico en el canvas
    drawFrame(ctx, frameKey, x, y, direction = 1) {
        drawFrame(ctx, this.image, this.frames.get(frameKey), x, y, direction);
    }

    // Dibuja un frame específico en el canvas durante la escena de victoria
    drawFrameWinScene(ctx, image, frameKey, x, y, direction = 1) {
        if (image == this.kenFace) {
            direction = -1;
        }
        drawFrame(ctx, image, this.frames.get(frameKey), x, y, direction);
    }

    // Actualiza el tiempo en el juego
    updateTime(time) {
        if (time.prev > this.timer + TIME_DELAY) {
            this.time--;
            this.timer = time.prev;
        }

        if (this.time < 15 && this.time > -1 && time.prev > this.timeLowTimer + TIME_LOW_DELAY) {
            this.useLowTimeFrames = !this.useLowTimeFrames;
            this.timeLowTimer = time.prev;
        }
    }

    // Actualiza las barras de salud en el juego
    updateHealthBars(time) {
        for (const index in this.healthBars) {
            if (this.healthBars[index].hitPoints <= gameState.fighters[index].hitPoints) {
                continue;
            }
            this.healthBars[index].hitPoints = Math.max(0, this.healthBars[index].hitPoints - (time.secondsPassed * FPS));
        }
    }

    // Actualiza la animación de KO en el juego
    updateKoIcon(time) {
        if (this.healthBars.every((healthBar) => healthBar.hitPoints > HP_LOW_PTS)) {
            return;
        }

        if (time.prev < this.koAnimationTimer + KO_LOW_DELAY[this.koFrame]) {
            return;
        }

        this.koFrame = 1 - this.koFrame;
        this.koAnimationTimer = time.prev;
    }

    // Verifica si la pelea ha terminado
    isFightOver() {
        if (this.time >= 0) {
            return this.healthBars.some(bar => bar.hitPoints <= 0);
        } else if (this.time <= 0) {
            return this.time;
        }
    }

    // Método principal de actualización del estado del juego
    update(time) {
        if (this.isFightOver()) {
            return;
        }
        this.updateTime(time);
        this.updateHealthBars(time);
        this.updateKoIcon(time);
    }

    // Dibuja las barras de salud en el canvas
    drawHealthBars(ctx) {
        this.drawFrame(ctx, 'health-bar', 31, 20);
        this.drawFrame(ctx, KO_ANIMATION[this.koFrame], 176, 18 - this.koFrame);
        this.drawFrame(ctx, 'health-bar', 353, 20, -1);

        ctx.fillStyle = HP_RED;
        ctx.beginPath();
        ctx.fillRect(32, 21, HP_MAX_PTS - Math.floor(this.healthBars[0].hitPoints), 9);

        ctx.fillRect(208 + Math.floor(this.healthBars[1].hitPoints), 21, HP_MAX_PTS - Math.floor(this.healthBars[1].hitPoints), 9);
    }

    // Dibuja los nombres de los personajes en el canvas
    drawNames(ctx) {
        const [name1, name2] = this.names;

        this.drawFrame(ctx, name1, 32, 33);
        this.drawFrame(ctx, name2, 322, 33);
    }

    // Dibuja el nombre de Ryu y otros elementos en caso de victoria de Ryu
    drawRyuName(ctx) {
        const name1 = this.names[0];

        this.drawFrame(ctx, name1, 178, 75);
        this.drawFrame(ctx, 'w', 172, 90);
        this.drawFrame(ctx, 'i', 184, 90);
        this.drawFrame(ctx, 'n', 191, 90);
        this.drawFrame(ctx, 's', 203, 90);

        this.drawPlayAgainAndTitleScreen(ctx);

        this.drawFrameWinScene(ctx, this.ryuFace, 'ryu-win-face', 20, 30);
        this.drawFrameWinScene(ctx, this.kenFace, 'ken-lose-face', 368, 30);
    }

    // Dibuja el nombre de Ken y otros elementos en caso de victoria de Ken
    drawKenName(ctx) {
        const name1 = this.names[1];

        this.drawFrame(ctx, name1, 178, 75);
        this.drawFrame(ctx, 'w', 172, 90);
        this.drawFrame(ctx, 'i', 184, 90);
        this.drawFrame(ctx, 'n', 191, 90);
        this.drawFrame(ctx, 's', 203, 90);

        this.drawPlayAgainAndTitleScreen(ctx);

        this.drawFrameWinScene(ctx, this.ryuFace, 'ryu-lose-face', 20, 30);
        this.drawFrameWinScene(ctx, this.kenFace, 'ken-win-face', 368, 30);
    }

    // Dibuja la escena de "Time Over" en el canvas
    drawTimeOver(ctx) {
        this.drawFrame(ctx, 'draw-game', 165, 75);

        this.drawPlayAgainAndTitleScreen(ctx);

        this.drawFrameWinScene(ctx, this.ryuFace, 'ryu-win-face', 20, 30);
        this.drawFrameWinScene(ctx, this.kenFace, 'ken-win-face', 368, 30);
    }

    // Dibuja la escena previa a la batalla en el canvas
    drawPreBattle(ctx) {
        this.drawFrameWinScene(ctx, this.ryuFace, 'ryu-win-face', 20, 30);
        this.drawFrameWinScene(ctx, this.kenFace, 'ken-win-face', 368, 30);

        this.drawFrame(ctx, this.names[0], 73, 155);
        this.drawFrame(ctx, this.names[1], 290, 155);

        this.drawFrame(ctx, 'v', 185, 80);
        this.drawFrame(ctx, 's', 195, 80);
    }

    // Dibuja el tiempo restante en el canvas
    drawTime(ctx) {
        const timeString = String(Math.max(this.time, 0)).padStart(2, '00');
        const lowFrame = TIME_FRAME_KEYS[Number(this.useLowTimeFrames)];

        this.drawFrame(ctx, `${lowFrame}-${timeString.charAt(0)}`, 178, 33);
        this.drawFrame(ctx, `${lowFrame}-${timeString.charAt(1)}`, 194, 33);
    }

    // Método principal de dibujo en el canvas
    draw(ctx) {
        if (this.time > 101) {
            this.drawBlackBackground(ctx);
            this.drawPreBattle(ctx);
        } else {
            if (this.time > 99 && this.time <= 101) {
                this.drawFrame(ctx, 'fight', 162, 75);
            }
            if (this.time <= 99) {
                this.drawTime(ctx);
            }
            this.drawHealthBars(ctx);
            this.drawNames(ctx);
            if (this.healthBars[1].hitPoints <= 0 && !this.isRyuNameDrawn) {
                this.drawBlackBackground(ctx);
                this.drawRyuName(ctx);
            } else if (this.healthBars[0].hitPoints <= 0 && !this.isKenNameDrawn) {
                this.drawBlackBackground(ctx);
                this.drawKenName(ctx);
            } else if (this.time <= 0 && this.healthBars[1].hitPoints > this.healthBars[0].hitPoints) {
                this.drawBlackBackground(ctx);
                this.drawKenName(ctx);
            } else if (this.time <= 0 && this.healthBars[0].hitPoints > this.healthBars[1].hitPoints) {
                this.drawBlackBackground(ctx);
                this.drawRyuName(ctx);
            } else if (this.time <= 0 && this.healthBars[1].hitPoints > 0 && this.healthBars[0].hitPoints > 0) {
                this.drawBlackBackground(ctx);
                this.drawTimeOver(ctx);
            }
        }
    }
}
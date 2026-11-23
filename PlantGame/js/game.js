/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
import Input from "./input.js";
import Player from "./player.js";
import World from "./world.js";
import PlantManager from "./plantManager.js";
import UI from "./ui.js";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Input och spelare
        this.input = new Input();
        this.player = new Player(
            800,
            600,
            3,
            new URL("../bilder/characterPlant.png", import.meta.url).href
        );

        // Meddelande-popup (t.ex. rätt/fel)
        this.message = "";
        this.messageTimer = 0;
        this.messageColor = "white";

        // Värld och träd
        this.world = new World(800, 600, 2);
        const centerSpawnPadding = 40;
        const centerSpawnRect = this.getCenterSpawnRect(centerSpawnPadding);
        this.world.spawnTrees(35, 20, centerSpawnRect); // 10 träd
        this.player.x = centerSpawnRect.x + (centerSpawnRect.w - this.player.width) / 2;
        this.player.y = centerSpawnRect.y + (centerSpawnRect.h - this.player.height) / 2;

        this.cameraX = 0;
        this.cameraY = 0;

        // Loop-timer
        this.lastTime = 0;

        // Växt-interaktion
        this.activePlant = null;
        this.nearPlant = null;

        // Hindrar upprepade E-tryck
        this.eWasDown = false;
        this.pWasDown = false;

        // Skapa växter med fast antal icke-giftiga
        this.plantManager = new PlantManager();
        this.plantManager.spawnRandomPlantsWithPoisonRange(
            29,
            this.world.mapWidth,
            this.world.mapHeight,
            this.world.trees,
            12,
            14,
            12,
            12,
            centerSpawnRect
        );
        this.totalNonPoison = this.plantManager.plants.filter(
            (plant) => !plant.type.poisonous
        ).length;
        this.collectedNonPoison = 0;

        // UI-instans
        this.ui = new UI(this.canvas.width, this.canvas.height);

        // Klick för UI och popup-knappar
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            // Klick på start/katalog-knappar
            this.ui.handleClick(mouseX, mouseY);

            // Interaktion i växt-popup
            if (this.activePlant) {

                const pickupBtn = this.ui.pickupBtn;

                // Plocka upp-knappen
                if (pickupBtn &&
                    mouseX > pickupBtn.x && mouseX < pickupBtn.x + pickupBtn.w &&
                    mouseY > pickupBtn.y && mouseY < pickupBtn.y + pickupBtn.h) {

                    // Om den är giftig förlorar man ett hjärta
                    if (this.activePlant.type.poisonous) {
                        this.lives = Math.max(0, this.lives - 1);
                        if (this.lives > 0) {
                            this.message = "Oj! Den här var giftig. Du förlorade ett hjärta!";
                            this.messageTimer = 180;
                            this.messageColor = "red";
                        } else {
                            this.messageTimer = 0;
                        }
                    } else {
                        this.message = "Bra! Den här var säker att plocka upp.";
                        this.messageTimer = 180;
                        this.messageColor = "lime";
                    }

                    // Popup-fönstret stängs när man plockar upp
                    this.handlePlantCollected(this.activePlant);
                    this.activePlant = null;
                }
            }
        });

        this.canvas.addEventListener(
            "wheel",
            (e) => {
                if (this.ui.showStart) {
                    e.preventDefault();
                    if (this.ui.showCatalog) {
                        this.ui.scrollCatalog(e.deltaY);
                    } else {
                        this.ui.scrollStart(e.deltaY);
                    }
                }
            },
            { passive: false }
        );

        this.lives = 3;
        this.maxLives = 3;
    }

    start() {
        // Startar huvudloopen
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    restartGame() {
        // Återställ spelaren till mitten
        const centerSpawnRect = this.getCenterSpawnRect(40);
        this.player.x = centerSpawnRect.x + (centerSpawnRect.w - this.player.width) / 2;
        this.player.y = centerSpawnRect.y + (centerSpawnRect.h - this.player.height) / 2;
        this.lives = this.maxLives;

        // Återställ träd
        this.world.trees = [];
        this.world.spawnTrees(35, 20, centerSpawnRect);

        // Återställ växter
        this.plantManager.plants = [];
        this.plantManager.spawnRandomPlantsWithPoisonRange(
            29,
            this.world.mapWidth,
            this.world.mapHeight,
            this.world.trees,
            12,
            14,
            12,
            12,
            centerSpawnRect
        );
        this.totalNonPoison = this.plantManager.plants.filter(
            (plant) => !plant.type.poisonous
        ).length;
        this.collectedNonPoison = 0;

        // Stäng win/game over
        this.ui.showGameOver = false;
        this.ui.showWin = false;

        // Centrera kameran
        this.updateCamera();
    }

    update(deltaTime) {
        if (this.ui.showStart && this.ui.showCatalog && this.input.isDown("Escape")) {
            this.ui.showCatalog = false;
        }

        // Vinst när alla icke-giftiga är plockade
        if (this.collectedNonPoison >= this.totalNonPoison && this.totalNonPoison > 0) {
            this.ui.showWin = true;
        }

        // Lås spelet på vinstskärm
        if (this.ui.showWin) {
            if (this.input.isDown("r")) {
                this.restartGame();
            }
            return;
        }

        // Förlust när liv tar slut
        if (this.lives <= 0 && !this.ui.showGameOver) {
            this.ui.showGameOver = true;
        }

        if (this.ui.showGameOver) {
            if (this.input.isDown("r")) {
                this.restartGame();
            }
            return;
        }

        // Speluppdatering endast efter start
        if (!this.ui.showStart) {

            // Man kan ej röra på sig när popup-fönstret är öppet
            if (!this.activePlant) {
                this.player.update(this.input, this.world);
                this.updateCamera();
            }

            this.checkPlantProximity();

            const eDown = this.input.isDown("e");
            const pDown = this.input.isDown("p");

            // Engångstryck för E
            if (eDown && !this.eWasDown) {

                if (this.activePlant) {
                    // Stäng fönster
                    this.activePlant = null;
                }
                else if (this.nearPlant) {
                    // Öppna fönster
                    this.activePlant = this.nearPlant;
                }
            }

                if (this.activePlant && pDown && !this.pWasDown) {
                    if (this.activePlant.type.poisonous) {
                        this.lives = Math.max(0, this.lives - 1);
                        if (this.lives > 0) {
                            this.message = "Oj! Den här var giftig. Du förlorade ett hjärta!";
                            this.messageTimer = 180;
                            this.messageColor = "red";
                        } else {
                            this.messageTimer = 0;
                        }
                    } else {
                        this.message = "Bra! Den här var säker att plocka upp.";
                        this.messageTimer = 180;
                        this.messageColor = "lime";
                    }
                this.handlePlantCollected(this.activePlant);
                this.activePlant = null;
            }

            this.eWasDown = eDown;
            this.pWasDown = pDown;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Rita världen
        this.world.draw(
            this.ctx,
            this.cameraX,
            this.cameraY,
            this.player,
            this.plantManager
        );

        // Mjuk skugga runt kanterna
        this.ui.drawEdgeShadow(this.ctx, this.canvas.width, this.canvas.height);

        // Rita liv (hanteras via UI.draw)

        // Plant-popup
        if (this.activePlant) {
            this.ui.drawPlantWindow(
                this.ctx,
                this.activePlant,
                this.canvas.width,
                this.canvas.height
            );
        }

        // UI: start/vinst/game over
        this.ui.draw(this.ctx, this.lives);
        if (!this.ui.showStart && !this.ui.showGameOver) {
            this.ui.drawCollectionCounter(
                this.ctx,
                this.collectedNonPoison,
                this.totalNonPoison,
                this.canvas.width
            );
        }

        // E-knapp prompt när man är nära en växt
        if (this.nearPlant && !this.activePlant && !this.ui.showStart && !this.ui.showGameOver && !this.ui.showWin) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "18px 'Press start 2P'";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "Tryck E för att inspektera växten",
                this.canvas.width / 2,
                this.canvas.height - 40
            );
        }
        // Meddelande-popup med automatisk radbrytning
        if (this.messageTimer > 0 && !this.ui.showGameOver && !this.ui.showWin) {

            const boxWidth = 400;
            const boxHeight = 100;
            const boxX = (this.canvas.width - boxWidth) / 2;
            const boxY = 200;

            this.ctx.fillStyle = "rgba(0,0,0,0.7)";
            this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

            this.ctx.fillStyle = this.messageColor;
            this.ctx.font = "16px 'Press Start 2P'";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "top";
            const lineHeight = 18;
            const lines = this.ui.getWrappedLines(this.ctx, this.message, boxWidth - 40);
            const totalTextHeight = lines.length * lineHeight;
            let textY = boxY + (boxHeight - totalTextHeight) / 2;

            for (const line of lines) {
                this.ctx.fillText(line, boxX + boxWidth / 2, textY);
                textY += lineHeight;
            }

            this.messageTimer--;
        }
    }

    updateCamera() {
        // Kamera följer spelaren och hålls inom kartan
        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;

        this.cameraX = this.player.x + this.player.width / 2 - canvasCenterX;
        this.cameraY = this.player.y + this.player.height / 2 - canvasCenterY;

        if (this.cameraX < 0) this.cameraX = 0;
        if (this.cameraY < 0) this.cameraY = 0;
        if (this.cameraX + this.canvas.width > this.world.mapWidth)
            this.cameraX = this.world.mapWidth - this.canvas.width;
        if (this.cameraY + this.canvas.height > this.world.mapHeight)
            this.cameraY = this.world.mapHeight - this.canvas.height;
    }

    getCenterSpawnRect(padding) {
        // Skyddad zon i mitten där inget får spawna
        return {
            x: this.world.mapWidth / 2 - this.player.width / 2 - padding,
            y: this.world.mapHeight / 2 - this.player.height / 2 - padding,
            w: this.player.width + padding * 2,
            h: this.player.height + padding * 2
        };
    }

    handlePlantCollected(plant) {
        // Räknar bara icke-giftiga växter
        if (!plant.collected && !plant.type.poisonous) {
            this.collectedNonPoison += 1;
        }
        plant.collect();
    }

    // Närheten till växten för att man ska kunna öppna popup-fönster
    checkPlantProximity() {

        this.nearPlant = null;

        for (const plant of this.plantManager.plants) {

            if (plant.collected) continue;

            const dx = this.player.x + this.player.width / 2 - plant.x;
            const dy = this.player.y + this.player.height / 2 - plant.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 60) {
                this.nearPlant = plant;
                return;
            }
        }
    }
}

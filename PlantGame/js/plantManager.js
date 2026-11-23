/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
import Plant, { plantTypes } from "./plants.js";
export default class PlantManager {
    constructor() {
        this.plants = [];
    }

    addPlant(plant) {
        // Lägger till en växtinstans i listan
        this.plants.push(plant);
    }

    draw(ctx, cameraX, cameraY) {
        // Ritar alla växter i världen
        for (const plant of this.plants) {
            plant.draw(ctx, cameraX, cameraY);
        }
    }

    spawnRandomPlants(amount, worldWidth, worldHeight, trees = [], avoidPadding = 12) {
        // Enkel slumpgenerator för växter (används inte i huvudflödet just nu)
        const types = Object.keys(plantTypes);
        const maxAttemptsPerPlant = 25;

        for (let i = 0; i < amount; i++) {
            let placed = false;

            for (let attempt = 0; attempt < maxAttemptsPerPlant; attempt++) {
                const x = Math.random() * (worldWidth - 40);
                const y = Math.random() * (worldHeight - 40);

                if (this.isTooCloseToTree(x, y, 48, 48, trees, avoidPadding)) {
                    continue;
                }

                const randomType = types[Math.floor(Math.random() * types.length)];
                const plant = new Plant(x, y, randomType);
                this.addPlant(plant);
                placed = true;
                break;
            }

            if (!placed) {
                // Skip this plant if no safe spot found in time.
                continue;
            }
        }
    }

    isTooCloseToTree(x, y, w, h, trees, padding) {
        // Undviker att placera växter för nära träd
        for (const tree of trees) {
            const treeX = tree.x - padding;
            const treeY = tree.y - padding;
            const treeW = tree.w + padding * 2;
            const treeH = tree.h + padding * 2;

            if (
                x < treeX + treeW &&
                x + w > treeX &&
                y < treeY + treeH &&
                y + h > treeY
            ) {
                return true;
            }
        }

        return false;
    }

    isTooCloseToPlant(x, y, w, h, plants, padding) {
        // Undviker att placera växter för nära varandra
        for (const plant of plants) {
            const plantX = plant.x - padding;
            const plantY = plant.y - padding;
            const plantW = plant.width + padding * 2;
            const plantH = plant.height + padding * 2;

            if (
                x < plantX + plantW &&
                x + w > plantX &&
                y < plantY + plantH &&
                y + h > plantY
            ) {
                return true;
            }
        }

        return false;
    }

    spawnRandomPlantsWithPoisonRange(
        amount,
        worldWidth,
        worldHeight,
        trees = [],
        avoidPadding = 12,
        plantSpacing = 14,
        nonPoisonMin = 10,
        nonPoisonMax = 15,
        avoidRect = null
    ) {
        // Slumpar växter med styrd andel giftiga/icke-giftiga
        const poisonousTypes = [];
        const nonPoisonTypes = [];

        for (const [key, type] of Object.entries(plantTypes)) {
            if (type.poisonous) {
                poisonousTypes.push(key);
            } else {
                nonPoisonTypes.push(key);
            }
        }

        const maxNonPoison = Math.min(nonPoisonMax, amount);
        const minNonPoison = Math.min(nonPoisonMin, maxNonPoison);
        const targetNonPoison =
            minNonPoison +
            Math.floor(Math.random() * (maxNonPoison - minNonPoison + 1));
        const targetPoison = amount - targetNonPoison;

        const maxAttemptsPerPlant = 25;

        const placePlant = (typeKey) => {
            // Försöker placera en växt utan krockar
            for (let attempt = 0; attempt < maxAttemptsPerPlant; attempt++) {
                const x = Math.random() * (worldWidth - 40);
                const y = Math.random() * (worldHeight - 40);

                if (avoidRect) {
                    const overlap =
                        x < avoidRect.x + avoidRect.w &&
                        x + 48 > avoidRect.x &&
                        y < avoidRect.y + avoidRect.h &&
                        y + 48 > avoidRect.y;
                    if (overlap) {
                        continue;
                    }
                }

                if (this.isTooCloseToTree(x, y, 48, 48, trees, avoidPadding)) {
                    continue;
                }
                if (this.isTooCloseToPlant(x, y, 48, 48, this.plants, plantSpacing)) {
                    continue;
                }

                const plant = new Plant(x, y, typeKey);
                this.addPlant(plant);
                return true;
            }

            return false;
        };

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        for (let i = 0; i < targetNonPoison; i++) {
            const typeKey = pickRandom(nonPoisonTypes);
            if (!typeKey) break;
            placePlant(typeKey);
        }

        for (let i = 0; i < targetPoison; i++) {
            const typeKey = pickRandom(poisonousTypes);
            if (!typeKey) break;
            placePlant(typeKey);
        }
    }
}

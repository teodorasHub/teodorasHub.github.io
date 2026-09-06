/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
export default class World {
    constructor(mapWidth, mapHeight, scale = 2) {
        // Skala upp kartan så spelaren får större yta
        this.mapWidth = mapWidth * scale;
        this.mapHeight = mapHeight * scale;
        this.scale = scale;

        // Bakgrundskarta
        this.mapImage = new Image();
        this.mapImage.src = new URL("../bilder/map.png", import.meta.url).href;

        // Träd-sprite laddas en gång
        this.treeImg = new Image();
        this.treeImg.src = new URL(
            "../bilder/sprite/tree/tree_sprite.png",
            import.meta.url
        ).href;

        this.trees = [];
    }

    spawnTrees(amount, edgePadding = 20, avoidRect = null) {
        // Slumpar träd och undviker en zon (t.ex. mitten för spawn)
        for (let i = 0; i < amount; i++) {
            let placed = false;
            const maxAttempts = 40;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const x = edgePadding + Math.random() * (this.mapWidth - 126 - edgePadding * 2);
                const y = edgePadding + Math.random() * (this.mapHeight - 126 - edgePadding * 2);

                if (avoidRect) {
                    const overlap =
                        x < avoidRect.x + avoidRect.w &&
                        x + 126 > avoidRect.x &&
                        y < avoidRect.y + avoidRect.h &&
                        y + 126 > avoidRect.y;
                    if (overlap) {
                        continue;
                    }
                }

                this.trees.push({
                    x: x,
                    y: y,
                    w: 126,       // full image width
                    h: 126,       // full image height

                    // Definiera collider endast för stammen
                    colliderX: x + 48,    // start collider a bit right
                    colliderY: y + 96,    // start collider at trunk base
                    colliderW: 30,        // trunk width
                    colliderH: 27         // trunk height
                });
                placed = true;
                break;
            }

            if (!placed) {
                continue;
            }
        }
    }

    draw(ctx, cameraX, cameraY, player, plantManager) {
        if (!this.mapImage.complete || this.mapImage.naturalWidth === 0) return;

        // Rita karta med kamera-offset
        ctx.drawImage(this.mapImage, -cameraX, -cameraY, this.mapWidth, this.mapHeight);

        const drawables = [];

        let order = 0;

        for (const tree of this.trees) {
            const treeOrder = order++;
            drawables.push({
                y: tree.colliderY,
                order: treeOrder,
                draw: () => {
                    if (this.treeImg.complete && this.treeImg.naturalWidth > 0) {
                        ctx.drawImage(
                            this.treeImg,
                            tree.x - cameraX,
                            tree.y - cameraY,
                            tree.w,
                            tree.h
                        );
                    }
                }
            });
        }

        for (const plant of plantManager.plants) {
            const plantOrder = order++;
            drawables.push({
                y: plant.y + plant.height,
                order: plantOrder,
                draw: () => plant.draw(ctx, cameraX, cameraY)
            });
        }

        const playerOrder = order++;
        drawables.push({
            y: player.y + player.height,
            order: playerOrder,
            draw: () => player.draw(ctx, cameraX, cameraY)
        });

        // Sortera så att det som är längst ner ritas ovanpå
        drawables.sort((a, b) => (a.y - b.y) || (a.order - b.order));

        for (const item of drawables) {
            item.draw();
        }
    }

    isCollidingWithTree(x, y, w, h) {
        // Kollision mot trädstammar

        for (const tree of this.trees) {

            if (
                x < tree.colliderX + tree.colliderW &&
                x + w > tree.colliderX &&
                y < tree.colliderY + tree.colliderH &&
                y + h > tree.colliderY
            ) {
                return true;
            }
        }

        return false;
    }
}

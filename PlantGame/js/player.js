/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
export default class Player {
    constructor(x, y, speed, spriteSrc) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 80;
        this.height = 80;
        this.facingRight = true;

        // Spelarsprite laddas en gång
        this.sprite = new Image();
        this.sprite.src = spriteSrc;
    }

    update(input, world) {

        let dx = 0;
        let dy = 0;

        if (input.isDown("ArrowLeft")) dx -= 1;
        if (input.isDown("ArrowRight")) dx += 1;
        if (input.isDown("ArrowUp")) dy -= 1;
        if (input.isDown("ArrowDown")) dy += 1;

        // Normalisera diagonal rörelse så hastigheten blir jämn
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;

        // Kollision mot trädstammar (X-axel)
        if (!world.isCollidingWithTree(newX, this.y, this.width, this.height)) {
            this.x = newX;
        }

        // Kollision mot trädstammar (Y-axel)
        if (!world.isCollidingWithTree(this.x, newY, this.width, this.height)) {
            this.y = newY;
        }

        // Håller spelaren inom världens kanter
        const paddingX = 6;
        const paddingY = 8;

        if (this.x < paddingX) this.x = paddingX;
        if (this.y < paddingY) this.y = paddingY;

        if (this.x + this.width > world.mapWidth - paddingX)
            this.x = world.mapWidth - paddingX - this.width;

        if (this.y + this.height > world.mapHeight - paddingY)
            this.y = world.mapHeight - paddingY - this.height;

        // Uppdatera riktning för spegelvänd sprite
        if (dx > 0) this.facingRight = true;
        if (dx < 0) this.facingRight = false;
    }

    draw(ctx, cameraX, cameraY) {
        ctx.save();

        // Spegelvänd sprite när spelaren går åt vänster
        if (!this.facingRight) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.sprite,
                -(this.x - cameraX + this.width),
                this.y - cameraY,
                this.width,
                this.height
            );
        } else {
            ctx.drawImage(
                this.sprite,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        }

        ctx.restore();
    }
}

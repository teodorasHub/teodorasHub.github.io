/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
import { plantTypes } from "./plants.js";

export default class UI {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // UI-tillstånd
        this.showStart = true;
        this.showGameOver = false;
        this.showWin = false;
        this.lives = 3;
        this.showCatalog = false;

        this.popupMessage = null;

        this.boxWidth = 500;
        this.boxHeight = 500;
        this.boxX = (canvasWidth - this.boxWidth) / 2;
        this.boxY = (canvasHeight - this.boxHeight) / 2;

        this.buttonWidth = 260;
        this.buttonHeight = 70;
        this.buttonX = this.boxX + (this.boxWidth - this.buttonWidth) / 2;
        this.buttonY = this.boxY + this.boxHeight - this.buttonHeight - 40;
        this.buttonText = "Starta spelet";

        // UI-bilder
        this.heartImage = new Image();
        this.heartImage.src = new URL("../bilder/heartPixel.png", import.meta.url).href;

        this.startBackground = new Image();
        this.startBackground.src = new URL("../bilder/map.png", import.meta.url).href;

        this.arrowsImage = new Image();
        this.arrowsImage.src = new URL("../bilder/arrows.png", import.meta.url).href;

        this.katalogImage = new Image();
        this.katalogImage.src = new URL("../bilder/katalog.png", import.meta.url).href;

        // Scroll i startfönstret
        this.startScrollY = 0;
        this.startScrollMax = 0;

        // Scroll i katalog
        this.catalogScrollY = 0;
        this.catalogScrollMax = 0;

        // Katalogdata
        this.catalogEntries = Object.values(plantTypes)
            .map((type) => {
                const img = new Image();
                img.src = type.photo;
                return {
                    name: type.name,
                    poisonous: type.poisonous,
                    image: img,
                    info: type.info
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name, "sv"));
    }

    showPopup(message) {
        this.popupMessage = message;
    }

    startScreen(ctx) {
        if (this.showCatalog) {
            this.catalogScreen(ctx);
            return;
        }
        // Rita bakgrunden på startsidan
        if (this.startBackground.complete && this.startBackground.naturalWidth > 0) {
            ctx.drawImage(this.startBackground, 0, 0, this.canvasWidth, this.canvasHeight);
        }

        // Popup-ruta med skugga
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 6;
        this.drawRoundedRect(ctx, this.boxX, this.boxY, this.boxWidth, this.boxHeight, 10);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = "black";
        ctx.font = "24px 'Press start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Vårt Plant Game!", this.canvasWidth / 2, this.boxY + 70);

        // Scrollbart instruktionstext-område
        const contentPaddingX = 30;
        const contentTop = this.boxY + 110;
        const contentBottom = this.buttonY - 20;
        const contentHeight = Math.max(40, contentBottom - contentTop);
        const contentX = this.boxX + contentPaddingX;
        const contentWidth = this.boxWidth - contentPaddingX * 2;

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const instructionText =
            "Spelets mål är att lära dig om giftiga växter. Du får utforska en liten karta med växter och svampar som kan plockas upp. Av totalt 12 ogiftiga måste alla plockas upp för att vinna.";
        const instructionText2 =
            "När du är nära en växt trycker du på E och plockar upp antingen att trycka på P eller trycka på knappen med pekare. Men om den är giftig förlorar du ett hjärta, och du har max 3. Om du misstänker att växten är giftig kan du trycka på E igen och fortsätta leta efter resten av de ogiftiga växterna. Vill du redan nu lära dig vilka växter eller svampar som kan förekomma, tryck på katalogboken nedanför!";
        const lineHeight = 22;
        const lines = this.getWrappedLines(ctx, instructionText, contentWidth);
        const lines2 = this.getWrappedLines(ctx, instructionText2, contentWidth);
        const textHeight = lines.length * lineHeight;
        const text2Height = lines2.length * lineHeight;

        let imgW = 0;
        let imgH = 0;
        let katalogW = 0;
        let katalogH = 0;
        if (this.arrowsImage.complete && this.arrowsImage.naturalWidth > 0) {
            const scale = Math.min(1, contentWidth / this.arrowsImage.naturalWidth);
            imgW = Math.floor(this.arrowsImage.naturalWidth * scale);
            imgH = Math.floor(this.arrowsImage.naturalHeight * scale);
        }
        if (this.katalogImage.complete && this.katalogImage.naturalWidth > 0) {
            const scale = Math.min(2, contentWidth / this.katalogImage.naturalWidth);
            katalogW = Math.floor(this.katalogImage.naturalWidth * scale);
            katalogH = Math.floor(this.katalogImage.naturalHeight * scale);
        }

        const imgGap = 12;
        const afterImgGap = 12;
        const katalogGap = 12;
        const contentTotalHeight =
            textHeight + imgGap + imgH + afterImgGap + text2Height + katalogGap + katalogH;
        this.startScrollMax = Math.max(0, contentTotalHeight - contentHeight);
        this.startScrollY = Math.min(this.startScrollY, this.startScrollMax);

        ctx.save();
        ctx.beginPath();
        ctx.rect(contentX, contentTop, contentWidth, contentHeight);
        ctx.clip();

        let drawY = contentTop - this.startScrollY;
        for (const line of lines) {
            ctx.fillText(line, this.canvasWidth / 2, drawY);
            drawY += lineHeight;
        }

        drawY += imgGap;
        if (imgW > 0 && imgH > 0) {
            const imgX = this.canvasWidth / 2 - imgW / 2;
            ctx.drawImage(this.arrowsImage, imgX, drawY, imgW, imgH);
        }

        drawY += imgH + afterImgGap;
        for (const line of lines2) {
            ctx.fillText(line, this.canvasWidth / 2, drawY);
            drawY += lineHeight;
        }

        drawY += katalogGap;
        if (katalogW > 0 && katalogH > 0) {
            const katalogX = this.canvasWidth / 2 - katalogW / 2;
            ctx.drawImage(this.katalogImage, katalogX, drawY, katalogW, katalogH);
            this.katalogBtnRect = {
                x: katalogX,
                y: drawY,
                w: katalogW,
                h: katalogH
            };
        } else {
            this.katalogBtnRect = null;
        }

        ctx.restore();

        ctx.fillStyle = "green";
        ctx.fillRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);

        ctx.fillStyle = "white";
        ctx.font = "18px 'Press start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.buttonText, this.canvasWidth / 2, this.buttonY + this.buttonHeight / 2);

        this.startButtonRect = {
            x: this.buttonX,
            y: this.buttonY,
            w: this.buttonWidth,
            h: this.buttonHeight
        };
    }

    catalogScreen(ctx) {
        // Bakgrund
        if (this.startBackground.complete && this.startBackground.naturalWidth > 0) {
            ctx.drawImage(this.startBackground, 0, 0, this.canvasWidth, this.canvasHeight);
        }

        // Popup-ruta
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 6;
        this.drawRoundedRect(ctx, this.boxX, this.boxY, this.boxWidth, this.boxHeight, 10);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = "black";
        ctx.font = "24px 'Press start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Katalog", this.canvasWidth / 2, this.boxY + 70);

        const contentPaddingX = 24;
        const contentTop = this.boxY + 110;
        const contentBottom = this.buttonY - 20;
        const contentHeight = Math.max(40, contentBottom - contentTop);
        const contentX = this.boxX + contentPaddingX;
        const contentWidth = this.boxWidth - contentPaddingX * 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(contentX, contentTop, contentWidth, contentHeight);
        ctx.clip();

        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        const nameLineHeight = 20;
        const imgGap = 8;
        const infoGap = 8;
        const infoLineHeight = 18;
        const itemGap = 18;
        let drawY = contentTop - this.catalogScrollY;
        let totalHeight = 0;

        for (const entry of this.catalogEntries) {
            const status = entry.poisonous ? "Giftig" : "Ogiftig";
            ctx.font = "16px Arial";
            ctx.fillText(`${entry.name} — ${status}`, contentX, drawY);
            drawY += nameLineHeight;
            totalHeight += nameLineHeight;

            let imgW = 0;
            let imgH = 0;
            if (entry.image.complete && entry.image.naturalWidth > 0) {
                const scale = Math.min(1, contentWidth / entry.image.naturalWidth);
                imgW = Math.floor(entry.image.naturalWidth * scale);
                imgH = Math.floor(entry.image.naturalHeight * scale);
            }

            drawY += imgGap;
            totalHeight += imgGap;

            if (imgW > 0 && imgH > 0) {
                ctx.drawImage(entry.image, contentX, drawY, imgW, imgH);
                drawY += imgH;
                totalHeight += imgH;
            } else {
                const placeholderH = 80;
                drawY += placeholderH;
                totalHeight += placeholderH;
            }

            drawY += infoGap;
            totalHeight += infoGap;

            if (entry.info) {
                ctx.font = "14px Arial";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                const infoLines = this.getWrappedLines(ctx, entry.info, contentWidth);
                for (const line of infoLines) {
                    ctx.fillText(line, contentX, drawY);
                    drawY += infoLineHeight;
                    totalHeight += infoLineHeight;
                }
            }

            drawY += itemGap;
            totalHeight += itemGap;
        }

        this.catalogScrollMax = Math.max(0, totalHeight - contentHeight);
        this.catalogScrollY = Math.min(this.catalogScrollY, this.catalogScrollMax);

        ctx.restore();

        ctx.fillStyle = "green";
        ctx.fillRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
        ctx.fillStyle = "white";
        ctx.font = "18px 'Press start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Tillbaka", this.canvasWidth / 2, this.buttonY + this.buttonHeight / 2);

        this.backButtonRect = {
            x: this.buttonX,
            y: this.buttonY,
            w: this.buttonWidth,
            h: this.buttonHeight
        };
    }

    drawRoundedRect(ctx, x, y, w, h, r) {
        // Hjälpfunktion för rundade hörn
        const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    drawLives(ctx, gameLives) {
        // Hjärtan uppe till vänster
        const heartSize = 40;
        const padding = 10;

        for (let i = 0; i < gameLives; i++) {
            const x = padding + i * (heartSize + padding);
            const y = padding;
            if (this.heartImage.complete && this.heartImage.naturalWidth > 0) {
                ctx.drawImage(this.heartImage, x, y, heartSize, heartSize);
            }
        }
    }
    draw(ctx, gameLives) {
        // Väljer vilken UI-vy som ska visas
        if (this.showStart) {
            this.startScreen(ctx);
        } else if (this.showWin) {
            this.drawWin(ctx, gameLives);
        } else if (this.showGameOver) {
            this.drawGameOver(ctx, gameLives);
        } else if (typeof gameLives === "number") {
            this.drawLives(ctx, gameLives);
        }

    }

    drawEdgeShadow(ctx, canvasWidth, canvasHeight) {
        // Mjuk vinjett runt kanterna
        const shadowSize = 28;
        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        // top
        let grad = ctx.createLinearGradient(0, 0, 0, shadowSize);
        grad.addColorStop(0, "rgba(0,0,0,0.35)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasWidth, shadowSize);

        // bottom
        grad = ctx.createLinearGradient(0, canvasHeight - shadowSize, 0, canvasHeight);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, canvasHeight - shadowSize, canvasWidth, shadowSize);

        // left
        grad = ctx.createLinearGradient(0, 0, shadowSize, 0);
        grad.addColorStop(0, "rgba(0,0,0,0.35)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, shadowSize, canvasHeight);

        // right
        grad = ctx.createLinearGradient(canvasWidth - shadowSize, 0, canvasWidth, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx.fillStyle = grad;
        ctx.fillRect(canvasWidth - shadowSize, 0, shadowSize, canvasHeight);

        ctx.restore();
    }

    drawCollectionCounter(ctx, collected, total, canvasWidth) {
        // Räknare uppe till höger för icke-giftiga växter
        const text = `${collected}/${total}`;
        ctx.save();
        ctx.font = "14px 'Press start 2P'";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";

        const padding = 10;
        const textWidth = ctx.measureText(text).width;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 26;
        const x = canvasWidth - padding;
        const y = padding;

        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(x - boxWidth, y, boxWidth, boxHeight);

        ctx.fillStyle = "white";
        ctx.fillText(text, x - padding, y + 6);
        ctx.restore();
    }

    handleClick(mouseX, mouseY) {
        if (!this.showStart) return null;

        if (this.showCatalog) {
            if (this.backButtonRect &&
                mouseX >= this.backButtonRect.x &&
                mouseX <= this.backButtonRect.x + this.backButtonRect.w &&
                mouseY >= this.backButtonRect.y &&
                mouseY <= this.backButtonRect.y + this.backButtonRect.h) {
                this.showCatalog = false;
                return "back";
            }
            return null;
        }

        if (this.startButtonRect &&
            mouseX >= this.startButtonRect.x &&
            mouseX <= this.startButtonRect.x + this.startButtonRect.w &&
            mouseY >= this.startButtonRect.y &&
            mouseY <= this.startButtonRect.y + this.startButtonRect.h) {
            this.showStart = false;
            return "start";
        }

        if (this.katalogBtnRect &&
            mouseX >= this.katalogBtnRect.x &&
            mouseX <= this.katalogBtnRect.x + this.katalogBtnRect.w &&
            mouseY >= this.katalogBtnRect.y &&
            mouseY <= this.katalogBtnRect.y + this.katalogBtnRect.h) {
            this.showCatalog = true;
            return "catalog";
        }

        return null;
    }

    scrollStart(deltaY) {
        if (!this.showStart) return;
        const speed = 0.6;
        this.startScrollY = Math.min(
            this.startScrollMax,
            Math.max(0, this.startScrollY + deltaY * speed)
        );
    }

    scrollCatalog(deltaY) {
        if (!this.showStart || !this.showCatalog) return;
        const speed = 0.6;
        this.catalogScrollY = Math.min(
            this.catalogScrollMax,
            Math.max(0, this.catalogScrollY + deltaY * speed)
        );
    }

    drawPlantWindow(ctx, plant, canvasWidth, canvasHeight) {
        // Popup-fönster när spelaren inspekterar en växt

        const panelWidth = 420;
        const panelHeight = 420;

        //const x = canvasWidth - panelWidth - 20;
        //const y = 20;
        const x = (canvasWidth - panelWidth) / 2;
        const y = (canvasHeight - panelHeight) / 2;

        //pop up fönster
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, panelWidth, panelHeight);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, panelWidth, panelHeight);

        // Bilden på växten (skala ner vid behov, aldrig upp)
        const edgePadding = 16;
        const maxImgWidth = panelWidth - edgePadding * 2;
        const btnY = y + panelHeight - 50;
        const maxImgHeight = Math.min(200, btnY - (y + 20) - 24);
        let imgW = 0;
        let imgH = 0;
        if (plant.photo.complete) {
            imgW = plant.photo.naturalWidth || plant.photo.width;
            imgH = plant.photo.naturalHeight || plant.photo.height;

            const scale = Math.min(
                1,
                maxImgWidth / imgW,
                maxImgHeight / imgH
            );
            imgW = Math.floor(imgW * scale);
            imgH = Math.floor(imgH * scale);
        }

        const imgX = x + panelWidth / 2 - imgW / 2;
        const imgY = y + 20;

        if (plant.photo.complete) {
            ctx.drawImage(plant.photo, imgX, imgY, imgW, imgH);
        }

        // Namn på växten
        ctx.fillStyle = "black";
        ctx.font = "14px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText(
            plant.type.name,
            x + panelWidth / 2,
            imgY + imgH + 18
        );

        if (plant.type.latin) {
            ctx.font = "12px Arial";
            ctx.fillText(
                plant.type.latin,
                x + panelWidth / 2,
                imgY + imgH + 36
            );
        }

        // Ingen lång info i inspektionsfönstret

        // Knappstorlek och placering
        const btnHeight = 35;
        const btnPaddingX = 12;
        const minBtnWidth = 160;

        ctx.font = "14px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const plockaWidth = Math.max(
            minBtnWidth,
            ctx.measureText("Plocka upp").width + btnPaddingX * 2
        );

        const btnX = x + panelWidth / 2 - plockaWidth / 2;

        // Info-text ovanför knappen
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("Tryck E för att fortsätta vidare", x + panelWidth / 2, btnY - 6);

        // Plocka upp knapp
        ctx.fillStyle = "#66cc66";
        this.drawRoundedRect(ctx, btnX, btnY, plockaWidth, btnHeight, 6);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "14px 'Press Start 2P'";
        ctx.textBaseline = "middle";
        ctx.fillText("Plocka upp", btnX + plockaWidth / 2, btnY + btnHeight / 2);

        // Klickyta för knappen
        this.pickupBtn = { x: btnX, y: btnY, w: plockaWidth, h: btnHeight };
        this.poisonBtn = null;
    }
    drawGameOver(ctx, gameLives) {
        const canvasWidth = this.canvasWidth;
        const canvasHeight = this.canvasHeight;

        // Game over-skärm
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // text
        ctx.fillStyle = "red";
        ctx.font = "48px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 90);

        ctx.fillStyle = "white";
        ctx.font = "16px 'Press Start 2P'";
        const feedbackY = canvasHeight / 2 - 20;
        this.wrapText(
            ctx,
            "Du överlevde inte... Fortsätt träna på, använd katalogen!",
            canvasWidth / 2,
            feedbackY,
            canvasWidth - 100,
            20
        );

        ctx.font = "18px 'Press Start 2P'";
        ctx.fillText("Tryck R för att starta om", canvasWidth / 2, feedbackY + 70);
    }

    drawWin(ctx, gameLives) {
        const canvasWidth = this.canvasWidth;
        const canvasHeight = this.canvasHeight;

        // Vinstskärm
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const lostHearts = Math.max(0, 3 - (typeof gameLives === "number" ? gameLives : 0));
        let feedback = "Bra jobbat!";
        if (lostHearts === 0) {
            feedback = "Utmärkt! Du har inte tappat en enda hjärta. Fortsätt så!";
        } else if (lostHearts === 1) {
            feedback = "Bra jobbat! Du gjorde ett misstag, träna på lite till så blir det utmärkt!";
        } else if (lostHearts === 2) {
            feedback = "Godkänt! Du överlevde knappt (i spelet), träna på för att få 100%!";
        }

        ctx.fillStyle = "lime";
        ctx.font = "26px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("Du klarade det!", canvasWidth / 2, canvasHeight / 2 - 50);

        ctx.fillStyle = "white";
        ctx.font = "16px 'Press Start 2P'";
        this.wrapText(ctx, feedback, canvasWidth / 2, canvasHeight / 2 - 10, canvasWidth - 120, 20);
        ctx.font = "18px 'Press Start 2P'";
        ctx.fillText("Tryck R för att spela igen", canvasWidth / 2, canvasHeight / 2 + 60);
    }
    // Funktion som gör automatisk radbrytning så texten håller sig i rutan
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {

        const words = text.split(" ");
        let line = "";

        for (let i = 0; i < words.length; i++) {

            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x, y);
        return y;
    }

    getWrappedLines(ctx, text, maxWidth) {
        // Returnerar radbrytning som array (används för vertikal centrering)
        const words = text.split(" ");
        const lines = [];
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && i > 0) {
                lines.push(line.trimEnd());
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }

        lines.push(line.trimEnd());
        return lines;
    }
}

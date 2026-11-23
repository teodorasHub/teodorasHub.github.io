/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
// Startfil: skapar spelet när canvas finns i DOM
import Game from "./game.js";

// Startar spelet när canvas finns i DOM
const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);
game.start();

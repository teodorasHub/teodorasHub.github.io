/* Teodora Kovacevic, teko5467; Isabella Wideman, iswi1331; Alex Klingvall, alkl3971 */
export default class Input {
    constructor() {
        this.keys = {};

        // Lyssnar på tangenttryck och lagrar status per knapp
        window.addEventListener("keydown", (e) => {
            console.log("Pressed:", e.key);
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            this.keys[key] = true;
        });

        // Släppta tangenter markeras som falska
        window.addEventListener("keyup", (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            this.keys[key] = false;
        });
    }

    isDown(key) {
        // Returnerar om en knapp hålls nere
        return this.keys[key];
    }
}

// Teodora Kovacevic, teko5467
// Uppgift 5 - Mattespelet 

let korrektSvar = null;  // Sparar rätt svar för det aktuella uttrycket
let poang = 0;           

const uttryckEl = document.getElementById("expression"); 
const feedbackEl = document.getElementById("feedback");  
const poangEl = document.getElementById("score");       
const svarInput = document.getElementById("answerInput"); 

document.getElementById("newExpressionBtn")
    .addEventListener("click", genereraUttryck);

document.getElementById("submitBtn")
    .addEventListener("click", kontrolleraSvar);

function genereraUttryck() {

    // Hämta vilket räknesätt användaren valt, radio knappar
    const valt = document.querySelector('input[name="operation"]:checked');

    // Om inget är valt
    if (!valt) { 
        alert("Välj ett räknesätt!");
        return;
    }

    const räknesatt = valt.value;

    // Skapar två slumpmässiga tal mellan 1 och 10
    let tal1 = Math.floor(Math.random() * 10) + 1;
    let tal2 = Math.floor(Math.random() * 10) + 1;

    if (räknesatt === "add") {
        korrektSvar = tal1 + tal2; // Beräkna rätt svar
        uttryckEl.textContent = `${tal1} + ${tal2}`;
    }

    if (räknesatt === "sub") {
        // Byter plats på talen om det andra är större, undvika negativt svar
        if (tal2 > tal1) {
            [tal1, tal2] = [tal2, tal1]; 
        }
        korrektSvar = tal1 - tal2;
        uttryckEl.textContent = `${tal1} - ${tal2}`;
    }

    if (räknesatt === "mul") {
        korrektSvar = tal1 * tal2;
        uttryckEl.textContent = `${tal1} × ${tal2}`;
    }

    // Rensa feedback och inputfältet så användaren kan skriva nytt svar
    feedbackEl.textContent = "";
    svarInput.value = "";
}

function kontrolleraSvar() {

    if (korrektSvar === null) { // Om man klickar "Svara" innan man genererat uttryck
        alert("Generera ett uttryck först.");
        return;
    }

    const användarSvar = Number(svarInput.value); // Konvertera input till nummer

    if (användarSvar === korrektSvar) {
        feedbackEl.textContent = "Rätt! 🎉";
        feedbackEl.style.color = "green";
        poang++;  // Öka poängen
    } else {
        feedbackEl.textContent = `Fel. Rätt svar är ${korrektSvar}.`;
        feedbackEl.style.color = "red";
        poang--;  // Minska poängen vid fel svar
    }

    poangEl.textContent = `Poäng: ${poang}`; // Uppdatera poängvisningen
}
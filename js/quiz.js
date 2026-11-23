// Teodora Kovacevic, teko5467
// Uppgift 3 - Frågesport (Big-O)

$(document).ready(function () {

    // Här definieras alla frågor i quizet
    // Varje fråga har koden som ska visas, alternativen, index på rätt svar och en förklaring
    let questions = [
        {
            code:
                `int sum = 0;
for (int i = 0; i < n; i++) {
    sum++;
}`,
            options: ["O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N²)", "O(2ⁿ)"],
            correct: 2,
            explanation:
                "Koden innehåller en enkel loop som itererar exakt n gånger. Varje iteration tar konstant tid, vilket ger tidskomplexiteten O(N)."
        },
        {
            code:
                `int left = 0, right = n - 1;
while (left <= right) {
    int mid = (left + right) / 2;
    if (arr[mid] == x) break;
    else if (arr[mid] < x) left = mid + 1;
    else right = mid - 1;
}`,
            options: ["O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N²)", "O(2ⁿ)"],
            correct: 1,
            explanation:
                "Intervallet halveras vid varje iteration i while-loopen. Detta leder till logaritmisk tidskomplexitet, O(log N)."
        },
        {
            code:
                `for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + j);
    }
}`,
            options: ["O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N²)", "O(2ⁿ)"],
            correct: 4,
            explanation:
                "Den inre loopen körs n gånger för varje iteration av den yttre loopen. Totalt utförs n × n operationer, vilket ger O(N²)."
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    // Funktion som visar en fråga på sidan
    function showQuestion() {
        let q = questions[currentQuestion];

        $("#question").html("<pre>" + q.code + "</pre>"); // visar koden
        $("#answers").empty(); // tömmer gamla svarsalternativ
        $("#feedback").empty(); // tömmer gammal feedback

        $("#submit").prop("disabled", false); // låser upp submit-knappen
        $("#next").hide(); // nästa-knappen syns inte förrän man svarat

        // Loopar igenom alternativen och lägger till dem som radio-knappar
        $.each(q.options, function (index, option) {
            $("#answers").append(
                `<label>
                    <input type="radio" name="answer" value="${index}">
                    ${option}
                </label><br>`
            );
        });
    }

    $("#submit").click(function () {
        let selected = $("input[name='answer']:checked").val();

        if (selected === undefined) {
            $("#feedback").text("Välj ett svar!");
            return;
        }

        let q = questions[currentQuestion];

        // Kolla om svaret är rätt
        if (parseInt(selected) === q.correct) {
            $("#feedback").html(
                "<strong>Rätt svar! ✅</strong><br>" + q.explanation
            );
            score++;
        } else {
            $("#feedback").html(
                "<strong>Fel svar ❌</strong><br>" + q.explanation
            );
        }

        // Lås frågan så man inte kan ändra svaret efter "svara" knapp
        $("#submit").prop("disabled", true);
        $("input[name='answer']").prop("disabled", true);

        $("#next").show();
    });

    // När användaren klickar på "Nästa fråga"-knappen
    $("#next").click(function () {
        currentQuestion++; // gå vidare till nästa fråga

        if (currentQuestion < questions.length) {
            showQuestion(); // visa nästa fråga om det finns fler
        } else {
            /* Om inga fler frågor finns visa slutmeddelande, ta bort 
            svarsalternativ och rensa feedback, gömma svara knappen och
            nästa fråga knappen, slutligen visa poängresultat*/
            $("#question").text("Quizet är klart!");
            $("#answers").empty();
            $("#feedback").empty();

            $("#submit").hide();
            $("#next").hide();

            $("#score").text(
                "Du fick " + score + " av " + questions.length + " rätt."
            );

            $("#restart").show(); // Visa starta om knappen
        }
    });
    /* När starta om knappen klickas så ska frågeindex och poängen
    nollställas, visa och låsa upp svara knapp, gömma starta om knapp,
    rensa poäng och feedback, och börja om quizet*/
    $("#restart").click(function () {
        currentQuestion = 0;
        score = 0;

        $("#submit").show().prop("disabled", false);
        $("#restart").hide();
        $("#score").empty();
        $("#feedback").empty();

        showQuestion();
    });

    // Visa första frågan när sidan laddas
    showQuestion();
});

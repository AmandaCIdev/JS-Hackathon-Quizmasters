const API_URL = "https://opentdb.com/api.php?amount=10&category=13&difficulty=medium&type=multiple";

let questionData = [];
let score = 0;

getQuestions();

async function getQuestions() {
    const response = await fetch(API_URL);
    console.log(response);
    questionData = await response.json();
    console.log(questionData);
    console.log(questionData.results[0].question);
    console.log(questionData.results[0].correct_answer);
    for (answer of questionData.results[0].incorrect_answers)
    {
        console.log(answer);
    }
    console.log(document.getElementById('question'));
    displayQuestion();
}

function displayQuestion() {
    document.getElementById('question').innerHTML = questionData.results[0].question;
    // assemble array of answers to avoid always having correct answer in same place
    let answers = [questionData.results[0].correct_answer, ...questionData.results[0].incorrect_answers];
    // shuffle the options using sort() method
    answers.sort(() => Math.random() - 0.5);
    for (let i=0; i<answers.length; i++){
        document.getElementById(`radio${i+1}Label`).innerHTML = answers[i];
    }
}

// check user response
function checkAnswer() {
    let selectedAnswer = 0;
    for (i=1; i<5; i++){
        if (document.getElementById(`radio${i}`).checked){
            selectedAnswer=i;
        }
    }
    if (document.getElementById(`radio${selectedAnswer}Label`).innerHTML == questionData.results[0].correct_answer) {
        // User was right
        console.log("correct");
        score++;
        
    } else {
        console.log("incorrect");
    }
}
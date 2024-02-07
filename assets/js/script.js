// API URL Compononents
const API_URL_ROOT = "https://opentdb.com/api.php?amount=10&category=";
const API_URL_MIDDLE = "&difficulty=";
const API_URL_TAIL = "&type=multiple";
// Initialise global variables
const categories = [10, 13, 22];
const difficulties = ["easy", "medium", "hard"];
let questionData = [];
let score = 0;

// Run any non event-triggered functions
getQuestions();

// Function definitions

// Fetch the questions from the API for the selected category & difficulty
async function getQuestions() {
    const response = await fetch(`${API_URL_ROOT}${categories[0]}${API_URL_MIDDLE}${difficulty}${API_URL_TAIL}`);
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
    if (selectedAnswer == 0){
        document.getElementById('choose').style.display = 'block';
    } else {
        document.getElementById('choose').style.display = 'none';
        if (document.getElementById(`radio${selectedAnswer}Label`).innerHTML == questionData.results[0].correct_answer) {
            // User was right
            console.log("correct");
            score++;
        } else {
            console.log("incorrect");
        }
        // Move onto the next question
        nextQuestion(selectedAnswer);
    }
}

// Display next question until end of quiz
function nextQuestion(selectedAnswer) {
    document.getElementById(`radio${selectedAnswer}`).checked = false;
    // Get rid of the previous question
    console.log(questionData.results[0]);
    questionData.results.shift();
    console.log(questionData.results[0]);
    if (questionData.results.length != 0){
        // First question in array is now the next question
        displayQuestion();
    } else {
        // Quiz finished
        document.getElementById('popOut3').style.display = 'none';
        document.getElementById('popOut4').innerHTML = `Quiz complete! You scored ${score}`
        document.getElementById('popOut4').style.display = 'block';
        console.log(`Quiz complete! You scored ${score} out of 10.`);
    }
}
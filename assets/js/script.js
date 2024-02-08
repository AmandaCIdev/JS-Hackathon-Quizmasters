// API URL Compononents
const API_URL_ROOT = "https://opentdb.com/api.php?amount=10&category=";
const API_URL_MIDDLE = "&difficulty=";
const API_URL_TAIL = "&type=multiple";
// Initialise global variables
const categories = [10, 13, 22];
const categoryNames = ["Entertainment: Books", 
"Entertainment: Musicals &amp; Theatres", "Geography"];
const difficulties = ["easy", "medium", "hard"];
let questionData = [];
let score = 0;
let currentCategory = 0;
let response;
let thisData;

// Function to move from landing page to category selection
function goToCategories() {
    document.getElementById("popOut1").style.display = 'none';
    document.getElementById("trivia-logo").style.display = "block"
    document.getElementById('popOut2').style.display = 'block';
}


// Populate HTML elements with category names
for (let i=0; i<categoryNames.length; i++){
    console.log(`Setting category name ${categoryNames[i]}`);
    document.getElementById(`category${i+1}`).innerHTML = categoryNames[i];
}

// Catch category popout button press
function runQuiz() {
    getQuestions(categories[currentCategory]);
    document.getElementById('popOut2').style.display = 'none';
    document.getElementById('popOut3').style.display = 'block';
}

// Run any non event-triggered functions

// Function definitions


// Fetch the questions from the API for the selected category & difficulty
async function getQuestions(category) {
    console.log(`Loading questions for category ID ${category}`);
    console.log(`${API_URL_ROOT}${category}${API_URL_MIDDLE}${difficulties[1]}${API_URL_TAIL}`);
    response = await fetch(`${API_URL_ROOT}${category}${API_URL_MIDDLE}${difficulties[1]}${API_URL_TAIL}`);
    console.log(response);
    thisData = await response.json();
    console.log(thisData);
    questionData.push(thisData);
    console.log(questionData[questionData.length-1]);
    console.log(questionData[questionData.length-1]);
    console.log(questionData[questionData.length-1].results[0].question);
    console.log(questionData[questionData.length-1].results[0].correct_answer);
    for (answer of questionData[questionData.length-1].results[0].incorrect_answers)
    {
        console.log(answer);
    }
    displayQuestion();
}

// Display a question to the user
function displayQuestion() {
    document.getElementById('question').innerHTML = questionData[currentCategory].results[0].question;
    // assemble array of answers to avoid always having correct answer in same place
    let answers = [questionData[currentCategory].results[0].correct_answer, ...questionData[currentCategory].results[0].incorrect_answers];
    // shuffle the options using sort() method
    answers.sort(() => Math.random() - 0.5);
    for (let i=0; i<answers.length; i++){
        document.getElementById(`radio${i+1}Label`).innerHTML = answers[i];
    }
}

// check user response
function checkAnswer() {
    let selectedAnswer = 0;
    let correctId;
    for (i=1; i<5; i++){
        if (document.getElementById(`radio${i}`).checked){
            selectedAnswer=i;
        }
        if (document.getElementById(`radio${i}Label`).innerHTML == questionData[currentCategory].results[0].correct_answer)
    }
    if (selectedAnswer == 0){
        // User has not entered a response: display prompt
        document.getElementById('choose').style.display = 'block';
    } else {
        // Hide any prompt that has been displayed
        document.getElementById('choose').style.display = 'none';
        // Check whether the user has selected the correct answer
        if (document.getElementById(`radio${selectedAnswer}Label`).innerHTML == questionData[currentCategory].results[0].correct_answer) {
            // User was right
            console.log("correct");
            // Increment score
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
    questionData[currentCategory].results.shift();
    // Either display next question or display end of quiz
    if (questionData[currentCategory].results.length != 0){
        // First question in array is now the next question
        displayQuestion();
    } else {
        // Quiz round finished
        console.log(`Round ${currentCategory} complete! You scored ${score} out of 10.`);
        currentCategory++;
        if (currentCategory<categories.length){
            getQuestions(categories[currentCategory]);
        } else {
            document.getElementById('popOut3').style.display = 'none';
            document.getElementById('popOut4').innerHTML = `Quiz complete! You scored ${score}`
            document.getElementById('popOut4').style.display = 'block';
        }
    }
}
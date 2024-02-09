// API URL Compononents
const API_URL_ROOT = "https://opentdb.com/api.php?amount=";
const API_URL_P1 = "&category=";
const API_URL_MIDDLE = "&difficulty=";
const API_URL_TAIL = "&type=multiple";
const nQuestionsPerRound = 5;
// Initialise global variables
const categories = [13, 10, 22];
const categoryNames = ["Entertainment: Books", 
"Entertainment: Musicals & Theatres", "Geography"];
const difficulties = ["easy", "medium", "hard"];
let questionData = [];
let score = 0;
let scores = [];
let currentCategory = 0;
let response;
let thisData;
let firstTime = true;
const progressBar = document.getElementById('progressBar');
progressBar.setAttribute('max', `${nQuestionsPerRound*categories.length}`);
document.getElementById('categories').innerText = `Round Categories`;
let qPerRoundHead = document.createElement('h4');
qPerRoundHead.innerText = `${nQuestionsPerRound} Questions Per Round, Multiple Choice`;
document.getElementById('popOut2').children[0].children[0].appendChild(qPerRoundHead);
let finalScore = document.createElement('h4');

// Function to move from landing page to category selection
function goToCategories() {
    document.getElementById("popOut1").style.display = 'none';
    document.getElementById("trivia-logo").style.display = "block";
    document.getElementById('popOut2').style.display = 'block';
    
}


// Populate HTML elements with category names
for (let i=0; i<categoryNames.length; i++){
    document.getElementById(`category${i+1}`).innerHTML = categoryNames[i];
}

// Catch category popout button press
function runQuiz() {
    getQuestions(categories[currentCategory]);
    document.getElementById('currentCategoryHeading').innerText = `Round ${currentCategory+1} of 3: ${categoryNames[currentCategory]}`;
    document.getElementById('popOut2').style.display = 'none';
    document.getElementById('popOut3').style.display = 'block';
    document.getElementById('progressBar').style.display ="block";
}


// Fetch the questions from the API for the selected category & difficulty
async function getQuestions(category) {
    console.log(`Loading questions for category ID ${category}`);
    response = await fetch(`${API_URL_ROOT}${nQuestionsPerRound}${API_URL_P1}${category}${API_URL_MIDDLE}${difficulties[1]}${API_URL_TAIL}`);
    thisData = await response.json();
    questionData.push(thisData);
    document.getElementById('currentCategoryHeading').innerText = `Round ${currentCategory+1} of 3: ${categoryNames[currentCategory]}`;
    displayQuestion();
}

// Display a question to the user
function displayQuestion() {
    document.getElementById('question').innerHTML = debugString(questionData[currentCategory].results[0].question);
    // assemble array of answers to avoid always having correct answer in same place
    let answers = [questionData[currentCategory].results[0].correct_answer, ...questionData[currentCategory].results[0].incorrect_answers];
    // shuffle the options using sort() method
    answers.sort(() => Math.random() - 0.5);
    for (let i=0; i<answers.length; i++){
        document.getElementById(`radio${i+1}Label`).innerText = debugString(answers[i]);
    }
}

// Find out which answer the user has selected and the position of the correct answer
function getWhichSelected(showCorrect) {
    let selectedAnswer = 0;
    let correctAnswer = 0;
    for (i=1; i<5; i++){
        if (document.getElementById(`radio${i}`).checked){
            selectedAnswer=i;
        }
        if (document.getElementById(`radio${i}Label`).innerText == debugString(questionData[currentCategory].results[0].correct_answer)){
            if (showCorrect){
                document.getElementById(`radio${i}Label`).style.backgroundColor = 'rgba(50,205,50,0.5)';
            }
            correctAnswer = i;
        } else {
            if(showCorrect){
                document.getElementById(`radio${i}Label`).style.backgroundColor = 'rgba(238, 75, 43,0.5)';
            }
        }
    }
    return {'selected': selectedAnswer, 'correct': correctAnswer};
}


// check user response
function checkAnswer() {
    let theAnswers = getWhichSelected(false);
    if (theAnswers.selected == 0){
        // User has not entered a response: display prompt
        document.getElementById('choose').style.display = 'block';
    } else {
        theAnswers = getWhichSelected(true);
        // Hide any prompt that has been displayed
        document.getElementById('choose').style.display = 'none';
        // Check whether the user has selected the correct answer
        if (document.getElementById(`radio${theAnswers.selected}Label`).innerHTML == debugString(questionData[currentCategory].results[0].correct_answer)) {
            // Increment score
            score++;
        }
        // Turn off the radio buttons
        for (button of document.getElementsByClassName('rbutton')){
            button.disabled=true;
        }
        // Change to the other button
        document.getElementById("button").style.display = 'none';
        document.getElementById("nextQbtn").style.display = 'inline-block';
    }

}

// Called on click on button #nextQbtn
function onToNext() {
    let theAnswers = getWhichSelected(false);
    nextQuestion(theAnswers.selected);
}

// Display next question until end of quiz
function nextQuestion(selectedAnswer) {
    // enable the radio buttons
    for (button of document.getElementsByClassName('rbutton')){
        button.disabled=false;
    }
    // deselect selected answer
    document.getElementById(`radio${selectedAnswer}`).checked = false;
    // change to the other button
    document.getElementById("button").style.display = 'inline-block';
    document.getElementById("nextQbtn").style.display = 'none';
    for(let i=1; i<5; i++){
        document.getElementById(`radio${i}Label`).style.backgroundColor = '';
    }
    let currentProgress = progressBar.getAttribute('value');
    currentProgress = Number.parseInt(currentProgress);
    progressBar.setAttribute('value', `${currentProgress+1}`);
    // Get rid of the previous question
    questionData[currentCategory].results.shift();
    // Either display next question or display end of quiz
   if (questionData[currentCategory].results.length != 0){
        // First question in array is now the next question
        displayQuestion();
    } else {
        // Quiz round finished
        scores.push(score);
        score=0;
        currentCategory++;
        if (currentCategory<categories.length){
            getQuestions(categories[currentCategory]);
        } else {
            displayQuizComplete();
        }
    }
}

// Display the final screen showing the scores
function displayQuizComplete() {
    document.getElementById('popOut3').style.display = 'none';
    let totalScore = 0;
    for (let i=0; i<categories.length; i++){
        document.getElementById(`results${i+1}`).innerText = `${categoryNames[i]}: ${scores[i]}/${nQuestionsPerRound}`;
        totalScore += scores[i];
    }
    finalScore.innerHTML = `Total Score: ${totalScore}/${nQuestionsPerRound*categories.length}`;
    document.getElementById(`results4`).appendChild(finalScore);
    document.getElementById('popOut4').style.display = 'block';
    progressBar.style.display='none';
}

   // Function to reset the quiz and play again
   function playAgain() {
    
    score = 0;
    currentCategory = 0;
    questionData = [];
    
    // Hide end of quiz message
    document.getElementById('popOut4').style.display = 'none';
    progressBar.setAttribute('value', '0');
    
    // Show category selection screen
    goToCategories();
}

// Function to detect HTML character codes in strings
// function getIndicesOf from https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
// user Tim Down
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

// Use getIndicesOf to remove all HTML character codes from input string
function debugString(str)
{
    let indices = getIndicesOf("&", str);
    let scIndices;
    let subStr = '';
    if (indices.length==0){
        return str;
    }
    while (indices.length>0){
        scIndices = getIndicesOf(";", str);
        subStr = str.substring(indices[0], scIndices[0]+1);
        str = str.replace(subStr,'');
        indices = getIndicesOf("&", str);
    } 
    return str;
}
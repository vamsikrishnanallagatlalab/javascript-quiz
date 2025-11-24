const questions = [
  { question: "1. Which HTML element is used to embed JavaScript?", options: ["<js>", "<script>", "<javascript>", "<code>"], correct: 1 },
  { question: "2. How do you declare a block-scoped variable in JavaScript?", options: ["var", "let", "const", "Both let and const"], correct: 3 },
  { question: "3. What does 'DOM' stand for?", options: ["Document Object Model", "Data Object Manager", "Dynamic Object Markup", "Document-Oriented Model"], correct: 0 },
  { question: "4. Which method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
  { question: "5. How do you select an element by its ID in JavaScript?", options: ["document.find('#id')", "document.select('#id')", "document.getElementById('id')", "document.queryId('id')"], correct: 2 },
  { question: "6. What is the output of: console.log(typeof [])?", options: ["array", "object", "list", "undefined"], correct: 1 },
  { question: "7. Which keyword is used to declare a constant in JavaScript?", options: ["constant", "const", "let", "var"], correct: 1 },
  { question: "8. How do you define an arrow function that returns the square of a number?", options: ["x => x * x", "function(x) => x * x", "(x) { return x * x }", "=> x * x"], correct: 0 },
  { question: "9. Which event fires when a page finishes loading?", options: ["onload", "onready", "oncomplete", "onfinish"], correct: 0 },
  { question: "10. What does 'async' before a function declaration do?", options: ["Makes the function run in a separate thread", "Ensures the function returns a Promise", "Pauses the entire program", "Optimizes the function for speed"], correct: 1 },
  { question: "11. How do you prevent the default action of an event (e.g., form submit)?", options: ["event.stop()", "event.preventDefault()", "return false", "Both event.preventDefault() and return false"], correct: 3 },
  { question: "12. Which method converts a JSON string into a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "Object.fromJSON()"], correct: 1 },
  { question: "13. What is the result of: '5' + 3 in JavaScript?", options: ["8", "'53'", "TypeError", "'8'"], correct: 1 },
  { question: "14. Which CSS property controls the space between elements?", options: ["padding", "spacing", "margin", "gap"], correct: 2 },
  { question: "15. How do you add a CSS class to an element using JavaScript?", options: ["element.addClass('my-class')", "element.className += ' my-class'", "element.classList.add('my-class')", "element.css('class', 'my-class')"], correct: 2 },
  { question: "16. What does the spread operator (...) do in: [...arr]?", options: ["Creates a shallow copy of the array", "Converts array to string", "Flattens nested arrays", "Reverses the array"], correct: 0 },
  { question: "17. Which method waits for a Promise to resolve?", options: ["then()", "await", "resolve()", "Both then() and await"], correct: 3 },
  { question: "18. What is the purpose of 'use strict' in JavaScript?", options: ["Enables experimental features", "Makes code run faster", "Enforces stricter parsing and error handling", "Imports strict mode libraries"], correct: 2 },
  { question: "19. Which HTTP method is used to send data to create a resource?", options: ["GET", "POST", "PUT", "DELETE"], correct: 1 },
  { question: "20. What does the following code log? \n setTimeout(() => console.log(1), 0); console.log(2);", options: ["1, 2", "2, 1", "1", "2"], correct: 1 }
];

const questionEl = document.getElementById('question');
const answerButtonsEl = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const questionList = document.getElementById('question-list');
const questionListMobile = document.getElementById('question-list-mobile');

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
// Track answer status: null = unanswered, true = correct, false = incorrect
let questionStatus = [];

// Shuffle questions
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  shuffledQuestions = shuffle(questions);
  currentQuestionIndex = 0;
  score = 0;
  questionStatus = new Array(shuffledQuestions.length).fill(null);
  nextButton.style.display = 'inline-block';
  renderQuestionList();
  showQuestion();
}

function renderQuestionList() {
  const renderList = (container) => {
    container.innerHTML = '';
    shuffledQuestions.forEach((q, index) => {
      const item = document.createElement('button');
      item.className = 'list-group-item d-flex align-items-center';
      if (index === currentQuestionIndex) {
        item.classList.add('active');
      }

      let statusClass = 'status-unanswered';
      if (questionStatus[index] === true) statusClass = 'status-correct';
      else if (questionStatus[index] === false) statusClass = 'status-incorrect';

      item.innerHTML = `
        <span class="q-status ${statusClass}"></span>
        ${q.question}
      `;

      item.addEventListener('click', () => {
        currentQuestionIndex = index;
        showQuestion();
        // Close offcanvas on mobile after selection
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasSidebar'));
        if (offcanvas) offcanvas.hide();
      });

      container.appendChild(item);
    });
  };

  renderList(questionList);
  renderList(questionListMobile);
}

function updateProgress() {
  const total = shuffledQuestions.length;
  const progress = ((currentQuestionIndex + 1) / total) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${currentQuestionIndex + 1} / ${total}`;
}

function showQuestion() {
  resetState();
  updateProgress();
  renderQuestionList(); // Update active item

  const q = shuffledQuestions[currentQuestionIndex];
  questionEl.textContent = q.question;

  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'btn btn-outline-secondary btn-choice w-100';
    button.textContent = option;
    button.addEventListener('click', () => selectAnswer(button, index === q.correct));
    answerButtonsEl.appendChild(button);
  });

  // Hide Next on last question
  if (currentQuestionIndex === shuffledQuestions.length - 1) {
    nextButton.textContent = 'Finish Quiz';
  } else {
    nextButton.textContent = 'Next Question';
  }
}

function resetState() {
  answerButtonsEl.innerHTML = '';
}

function selectAnswer(selectedBtn, isCorrect) {
  // Record status
  questionStatus[currentQuestionIndex] = isCorrect;
  if (isCorrect) score++;

  // Visual feedback
  selectedBtn.classList.remove('btn-outline-secondary');
  selectedBtn.classList.add(isCorrect ? 'btn-success' : 'btn-danger');
  selectedBtn.disabled = true;

  // Highlight correct if wrong
  if (!isCorrect) {
    const correctIndex = shuffledQuestions[currentQuestionIndex].correct;
    const allBtns = answerButtonsEl.querySelectorAll('button');
    allBtns[correctIndex].classList.remove('btn-outline-secondary');
    allBtns[correctIndex].classList.add('btn-success');
    allBtns[correctIndex].disabled = true;
  }

  nextButton.style.display = 'inline-block';
}

// Next/Finish button handler
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  resetState();
  questionEl.innerHTML = `
    <div class="text-center">
      <h2>🎉 Quiz Complete!</h2>
      <div class="alert alert-primary mt-3 score-alert" role="alert">
        You scored <strong>${score}</strong> out of <strong>${shuffledQuestions.length}</strong>
      </div>
      <p class="text-muted">Great job!</p>
    </div>
  `;
  nextButton.textContent = '↺ Restart Quiz';
  nextButton.onclick = startQuiz;
}

// Start!
startQuiz();

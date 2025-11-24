const questions = [
  {
    question: "1. Which HTML element is used to embed JavaScript?",
    options: ["<js>", "<script>", "<javascript>", "<code>"],
    correct: 1
  },
  {
    question: "2. How do you declare a block-scoped variable in JavaScript?",
    options: ["var", "let", "const", "Both let and const"],
    correct: 3
  },
  {
    question: "3. What does 'DOM' stand for?",
    options: ["Document Object Model", "Data Object Manager", "Dynamic Object Markup", "Document-Oriented Model"],
    correct: 0
  },
  {
    question: "4. Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0
  },
  {
    question: "5. How do you select an element by its ID in JavaScript?",
    options: ["document.find('#id')", "document.select('#id')", "document.getElementById('id')", "document.queryId('id')"],
    correct: 2
  },
  {
    question: "6. What is the output of: console.log(typeof [])?",
    options: ["array", "object", "list", "undefined"],
    correct: 1
  },
  {
    question: "7. Which keyword is used to declare a constant in JavaScript?",
    options: ["constant", "const", "let", "var"],
    correct: 1
  },
  {
    question: "8. How do you define an arrow function that returns the square of a number?",
    options: [
      "x => x * x",
      "function(x) => x * x",
      "(x) { return x * x }",
      "=> x * x"
    ],
    correct: 0
  },
  {
    question: "9. Which event fires when a page finishes loading?",
    options: ["onload", "onready", "oncomplete", "onfinish"],
    correct: 0
  },
  {
    question: "10. What does 'async' before a function declaration do?",
    options: [
      "Makes the function run in a separate thread",
      "Ensures the function returns a Promise",
      "Pauses the entire program",
      "Optimizes the function for speed"
    ],
    correct: 1
  },
  {
    question: "11. How do you prevent the default action of an event (e.g., form submit)?",
    options: [
      "event.stop()",
      "event.preventDefault()",
      "return false",
      "Both event.preventDefault() and return false"
    ],
    correct: 3
  },
  {
    question: "12. Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "Object.fromJSON()"],
    correct: 1
  },
  {
    question: "13. What is the result of: '5' + 3 in JavaScript?",
    options: ["8", "'53'", "TypeError", "'8'"],
    correct: 1
  },
  {
    question: "14. Which CSS property controls the space between elements?",
    options: ["padding", "spacing", "margin", "gap"],
    correct: 2
  },
  {
    question: "15. How do you add a CSS class to an element using JavaScript?",
    options: [
      "element.addClass('my-class')",
      "element.className += ' my-class'",
      "element.classList.add('my-class')",
      "element.css('class', 'my-class')"
    ],
    correct: 2
  },
  {
    question: "16. What does the spread operator (...) do in: [...arr]?",
    options: [
      "Creates a shallow copy of the array",
      "Converts array to string",
      "Flattens nested arrays",
      "Reverses the array"
    ],
    correct: 0
  },
  {
    question: "17. Which method waits for a Promise to resolve?",
    options: ["then()", "await", "resolve()", "Both then() and await"],
    correct: 3
  },
  {
    question: "18. What is the purpose of 'use strict' in JavaScript?",
    options: [
      "Enables experimental features",
      "Makes code run faster",
      "Enforces stricter parsing and error handling",
      "Imports strict mode libraries"
    ],
    correct: 2
  },
  {
    question: "19. Which HTTP method is used to send data to create a resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correct: 1
  },
  {
    question: "20. What does the following code log? \n setTimeout(() => console.log(1), 0); console.log(2);",
    options: ["1, 2", "2, 1", "1", "2"],
    correct: 1
  }
];

const questionEl = document.getElementById('question');
const answerButtonsEl = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Shuffle questions
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  shuffledQuestions = shuffle(questions);
  currentQuestionIndex = 0;
  score = 0;
  nextButton.style.display = 'none';
  showQuestion();
}

function showQuestion() {
  resetState();
  const q = shuffledQuestions[currentQuestionIndex];
  questionEl.textContent = q.question;

  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'btn btn-outline-secondary btn-choice w-100';
    button.textContent = option;
    button.addEventListener('click', () => selectAnswer(button, index === q.correct));
    answerButtonsEl.appendChild(button);
  });
}

function resetState() {
  answerButtonsEl.innerHTML = '';
}

function selectAnswer(selectedBtn, isCorrect) {
  // Add feedback class
  selectedBtn.classList.remove('btn-outline-secondary');
  selectedBtn.classList.add(isCorrect ? 'btn-success' : 'btn-danger');
  selectedBtn.disabled = true;

  // Highlight correct answer if wrong
  if (!isCorrect) {
    const correctIndex = shuffledQuestions[currentQuestionIndex].correct;
    const allBtns = answerButtonsEl.querySelectorAll('button');
    allBtns[correctIndex].classList.remove('btn-outline-secondary');
    allBtns[correctIndex].classList.add('btn-success');
    allBtns[correctIndex].disabled = true;
  }

  if (isCorrect) score++;

  nextButton.style.display = 'inline-block';
  nextButton.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  };
}

function showResults() {
  resetState();
  questionEl.innerHTML = `
    <div class="text-center">
      <h2> Quiz Complete!</h2>
      <div class="alert alert-primary mt-3 score-alert" role="alert">
        You scored <strong>${score}</strong> out of <strong>${shuffledQuestions.length}</strong>
      </div>
      <p class="text-muted">Great job!</p>
    </div>
  `;
  nextButton.textContent = '↺ Restart Quiz';
  nextButton.style.display = 'inline-block';
  nextButton.onclick = startQuiz;
}

// Start!
startQuiz();

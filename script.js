// ===== Dark/Light Mode Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

function setTheme(theme) {
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  setTheme('dark');
} else {
  setTheme('light');
}

// Toggle on click (safe)
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
}

// ===== Quiz Logic =====
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
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasSidebar'));
        if (offcanvas) offcanvas.hide();
      });

      container.appendChild(item);
    });
  };

  if (questionList) renderList(questionList);
  if (questionListMobile) renderList(questionListMobile);
}

function updateProgress() {
  const total = shuffledQuestions.length;
  const progress = ((currentQuestionIndex + 1) / total) * 100;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${currentQuestionIndex + 1} / ${total}`;
}

function showQuestion() {
  resetState();
  updateProgress();
  renderQuestionList();

  const q = shuffledQuestions[currentQuestionIndex];
  if (questionEl) questionEl.textContent = q.question;

  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'btn btn-outline-secondary btn-choice w-100';
    button.textContent = option;
    button.addEventListener('click', () => selectAnswer(button, index === q.correct));
    if (answerButtonsEl) answerButtonsEl.appendChild(button);
  });

  if (nextButton) {
    nextButton.textContent = currentQuestionIndex === shuffledQuestions.length - 1 
      ? 'Finish Quiz' 
      : 'Next Question';
  }
}

function resetState() {
  if (answerButtonsEl) answerButtonsEl.innerHTML = '';
}

function selectAnswer(selectedBtn, isCorrect) {
  questionStatus[currentQuestionIndex] = isCorrect;
  if (isCorrect) score++;

  selectedBtn.classList.remove('btn-outline-secondary');
  selectedBtn.classList.add(isCorrect ? 'btn-success' : 'btn-danger');
  selectedBtn.disabled = true;

  if (!isCorrect) {
    const correctIndex = shuffledQuestions[currentQuestionIndex].correct;
    const allBtns = answerButtonsEl.querySelectorAll('button');
    const correctBtn = allBtns[correctIndex];
    correctBtn.classList.remove('btn-outline-secondary');
    correctBtn.classList.add('btn-success');
    correctBtn.disabled = true;
  }

  if (nextButton) nextButton.style.display = 'inline-block';
}

// Use onclick to prevent duplicate listeners
if (nextButton) {
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
  
  // FIXED: Added missing emoji assignments
  let message, emoji, alertClass;
  
  if (score === 20) {
    message = "Congrats! You got full points ";
    alertClass = "alert-success";
  } else if (score > 15) {
    message = "Great Job! ";
    alertClass = "alert-success";
  } else if (score >= 10) {
    message = "Really Good Score but could do better ";
    alertClass = "alert-info";
  } else if (score >= 5) {
    message = "OK score — give it another try ";
    alertClass = "alert-warning";
  } else {
    message = "Bad luck — try again! ";
    alertClass = "alert-danger";
  }

  if (questionEl) {
    questionEl.innerHTML = `
      <div class="text-center">
        <div class="fs-1 mb-3">${emoji}</div>
        <h2 class="mb-4">${message}</h2>
        <div class="alert ${alertClass} score-alert" role="alert">
          You scored <strong>${score}</strong> out of <strong>20</strong>
        </div>
      </div>
    `;
  }
  
  if (nextButton) {
    nextButton.textContent = '↺ Restart Quiz';
    nextButton.onclick = startQuiz;
  }
}

// Start!
startQuiz();

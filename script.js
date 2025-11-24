const questions = [
  {
    question: "Which HTML tag is used to define an internal stylesheet?",
    options: ["<script>", "<style>", "<css>", "<link>"],
    correct: 1
  },
  {
    question: "How do you write 'Hello World' in an alert box?",
    options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"],
    correct: 2
  },
  {
    question: "Which event occurs when the user clicks on an HTML element?",
    options: ["onchange", "onclick", "onmouseclick", "onhover"],
    correct: 1
  },
  {
    question: "How do you create a function in JavaScript?",
    options: ["function:myFunction()", "function myFunction()", "function = myFunction()", "myFunction() => {}"],
    correct: 1
  },
  {
    question: "What is the correct syntax for referring to an external script called 'app.js'?",
    options: ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"],
    correct: 2
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
      <div class="alert alert-primary mt-3" role="alert">
        You scored <strong>${score}</strong> out of <strong>${shuffledQuestions.length}</strong>
      </div>
      <p class="text-muted">Great job!</p>
    </div>
  `;
  nextButton.textContent = 'Restart Quiz';
  nextButton.style.display = 'inline-block';
  nextButton.onclick = startQuiz;
}

// Start!
startQuiz();

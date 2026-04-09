/**
 * Web Accessibility Training Toolkit - Quiz System
 * Handles quiz rendering, scoring, and progress persistence.
 *
 * Quiz question data lives in quiz-data.js.
 * Load it BEFORE this file:
 *   <script src="../scripts/quiz-data.js"></script>
 *   <script src="../scripts/quiz.js"></script>
 */

// QUIZ_DATA is defined in quiz-data.js
// Fail fast with a clear message if the data file was not loaded.
if (typeof QUIZ_DATA === 'undefined') {
  throw new Error('[quiz.js] QUIZ_DATA is not defined. Make sure quiz-data.js is loaded before quiz.js.');
}

// ── Quiz data is in quiz-data.js ─────────────────────────────────────────────

/**
 * Render a quiz into the given container element.
 * @param {string} moduleId  e.g. 'module1'
 * @param {HTMLElement} container
 */
function renderQuiz(moduleId, container) {
  const quiz = QUIZ_DATA[moduleId];
  if (!quiz) return;

  const saved = loadQuizState(moduleId);

  container.innerHTML = '';
  container.setAttribute('role', 'form');
  container.setAttribute('aria-label', quiz.title + ' Knowledge Check');

  const form = document.createElement('form');
  form.id = 'quiz-form-' + moduleId;
  form.noValidate = true;

  quiz.questions.forEach(function (q, idx) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'quiz-question';
    fieldset.dataset.questionId = q.id;

    const legend = document.createElement('legend');
    legend.className = 'quiz-question-text';
    legend.textContent = (idx + 1) + '. ' + q.text;
    fieldset.appendChild(legend);

    const optionsList = document.createElement('ul');
    optionsList.className = 'quiz-options';

    q.options.forEach(function (opt, optIdx) {
      const li = document.createElement('li');
      const label = document.createElement('label');
      label.className = 'quiz-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = moduleId + '-' + q.id;
      radio.value = optIdx;
      radio.id = moduleId + '-' + q.id + '-' + optIdx;

      if (saved && saved.answers && saved.answers[q.id] !== undefined) {
        if (saved.answers[q.id] === optIdx) radio.checked = true;
      }

      label.htmlFor = radio.id;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(' ' + opt));
      li.appendChild(label);
      optionsList.appendChild(li);
    });

    fieldset.appendChild(optionsList);

    const explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    explanation.setAttribute('aria-live', 'polite');
    explanation.hidden = true;
    fieldset.appendChild(explanation);

    form.appendChild(fieldset);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'button primary quiz-submit';
  submitBtn.textContent = 'Submit Quiz';

  const resultsDiv = document.createElement('div');
  resultsDiv.className = 'quiz-results';
  resultsDiv.setAttribute('aria-live', 'polite');
  resultsDiv.hidden = true;

  form.appendChild(submitBtn);
  form.appendChild(resultsDiv);
  container.appendChild(form);

  if (saved && saved.submitted) {
    showResults(moduleId, quiz, form, saved.answers, resultsDiv, submitBtn);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const answers = collectAnswers(moduleId, quiz);
    saveQuizState(moduleId, { answers: answers, submitted: true });
    showResults(moduleId, quiz, form, answers, resultsDiv, submitBtn);
  });
}

function collectAnswers(moduleId, quiz) {
  const answers = {};
  quiz.questions.forEach(function (q) {
    const selected = document.querySelector(
      'input[name="' + moduleId + '-' + q.id + '"]:checked'
    );
    answers[q.id] = selected ? parseInt(selected.value, 10) : null;
  });
  return answers;
}

function showResults(moduleId, quiz, form, answers, resultsDiv, submitBtn) {
  let correct = 0;

  quiz.questions.forEach(function (q) {
    const fieldset = form.querySelector('[data-question-id="' + q.id + '"]');
    const explanation = fieldset.querySelector('.quiz-explanation');
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct;
    if (isCorrect) correct++;

    fieldset.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.disabled = true;
    });

    fieldset.querySelectorAll('.quiz-option').forEach(function (label, idx) {
      label.classList.remove('correct', 'incorrect');
      if (idx === q.correct) {
        label.classList.add('correct');
      } else if (idx === userAnswer && userAnswer !== q.correct) {
        label.classList.add('incorrect');
      }
    });

    explanation.hidden = false;
    explanation.textContent = q.explanation;
    explanation.className = 'quiz-explanation ' + (isCorrect ? 'explanation-correct' : 'explanation-incorrect');
  });

  const total = quiz.questions.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= quiz.passingScore;

  resultsDiv.hidden = false;
  resultsDiv.className = 'quiz-results ' + (passed ? 'quiz-passed' : 'quiz-failed');
  resultsDiv.textContent = '';

  var title = document.createElement('h3');
  title.className = 'quiz-result-title';
  title.textContent = passed ? '\u2713 Passed!' : '\u2717 Not quite';
  resultsDiv.appendChild(title);

  var scorePara = document.createElement('p');
  var scoreStrong = document.createElement('strong');
  scoreStrong.textContent = correct + ' / ' + total;
  scorePara.appendChild(scoreStrong);
  scorePara.insertAdjacentText('beforeend', ' (' + pct + '%)');
  scorePara.insertAdjacentText('afterbegin', 'You scored ');
  resultsDiv.appendChild(scorePara);

  var msgPara = document.createElement('p');
  msgPara.textContent = passed
    ? 'Well done! You have demonstrated a solid understanding of this module.'
    : 'You need ' + quiz.passingScore + '% to pass. Review the explanations above and try again.';
  resultsDiv.appendChild(msgPara);

  var retakeBtn = document.createElement('button');
  retakeBtn.type = 'button';
  retakeBtn.className = 'button ' + (passed ? 'secondary' : 'primary') + ' quiz-retake';
  retakeBtn.textContent = 'Retake Quiz';
  resultsDiv.appendChild(retakeBtn);

  submitBtn.hidden = true;

  if (passed) markModuleComplete(moduleId);

  retakeBtn.addEventListener('click', function () {
    clearQuizState(moduleId);
    renderQuiz(moduleId, form.parentElement);
  });
}

function loadQuizState(moduleId) {
  try {
    const raw = localStorage.getItem('toolkit-quiz-' + moduleId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('[Quiz] Could not load saved state for ' + moduleId + ':', e);
    return null;
  }
}

function saveQuizState(moduleId, state) {
  try {
    localStorage.setItem('toolkit-quiz-' + moduleId, JSON.stringify(state));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('[Quiz] localStorage quota exceeded — quiz progress not saved.');
    } else {
      console.warn('[Quiz] Could not save state for ' + moduleId + ':', e);
    }
  }
}

function clearQuizState(moduleId) {
  try {
    localStorage.removeItem('toolkit-quiz-' + moduleId);
  } catch (e) {
    console.warn('[Quiz] Could not clear state for ' + moduleId + ':', e);
  }
}

function markModuleComplete(moduleId) {
  try {
    const completed = JSON.parse(localStorage.getItem('toolkit-completed-modules') || '[]');
    if (!completed.includes(moduleId)) {
      completed.push(moduleId);
      localStorage.setItem('toolkit-completed-modules', JSON.stringify(completed));
    }
  } catch (e) {
    console.warn('[Quiz] Could not mark module complete for ' + moduleId + ':', e);
  }
}

// ── Auto-init ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  const moduleId = container.dataset.module;
  if (!moduleId || !QUIZ_DATA[moduleId]) return;
  renderQuiz(moduleId, container);
});

/**
 * Web Accessibility Training Toolkit - Quiz System
 * Handles quiz rendering, scoring, and progress persistence.
 */

const QUIZ_DATA = {
  module1: {
    title: 'Introduction to Web Accessibility',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        text: 'Approximately what percentage of the world population lives with some form of disability?',
        options: ['5%', '10%', '15%', '25%'],
        correct: 2,
        explanation: 'According to the World Health Organization, over 1 billion people — roughly 15% of the global population — live with some form of disability.'
      },
      {
        id: 'q2',
        text: 'What does WCAG stand for?',
        options: [
          'Web Content Accessibility Guidelines',
          'World Content Accessibility Guide',
          'Web Compatibility and Accessibility Goals',
          'Website Compliance and Accessibility Governance'
        ],
        correct: 0,
        explanation: 'WCAG stands for Web Content Accessibility Guidelines, published by the W3C to define how to make web content more accessible.'
      },
      {
        id: 'q3',
        text: 'Which of the following is NOT one of the four WCAG principles (POUR)?',
        options: ['Perceivable', 'Operable', 'Usable', 'Robust'],
        correct: 2,
        explanation: 'The four WCAG principles are Perceivable, Operable, Understandable, and Robust — forming the acronym POUR. "Usable" is not one of them.'
      },
      {
        id: 'q4',
        text: 'Which HTML attribute provides a text alternative for images?',
        options: ['title', 'aria-label', 'alt', 'description'],
        correct: 2,
        explanation: 'The alt attribute on <img> elements provides a text alternative that screen readers announce to users who cannot see the image.'
      },
      {
        id: 'q5',
        text: 'Which US law requires federal agencies to make their electronic and information technology accessible?',
        options: ['ADA Title II', 'Section 508', 'AODA', 'CVAA'],
        correct: 1,
        explanation: 'Section 508 of the Rehabilitation Act requires federal agencies to make their electronic and information technology accessible to people with disabilities.'
      },
      {
        id: 'q6',
        text: 'For a purely decorative image, which alt attribute value is correct?',
        options: ['alt="decorative"', 'alt="image"', 'alt="" (empty)', 'Omit the alt attribute entirely'],
        correct: 2,
        explanation: 'Decorative images should have an empty alt attribute (alt="") so screen readers skip over them rather than announcing unhelpful filler text.'
      },
      {
        id: 'q7',
        text: 'Which of the following groups benefits from web accessibility improvements?',
        options: [
          'Only people with permanent disabilities',
          'Only blind users',
          'People with disabilities, older adults, mobile users, and users with slow connections',
          'Only keyboard-only users'
        ],
        correct: 2,
        explanation: 'Accessible design benefits everyone: people with permanent or temporary disabilities, older adults, mobile device users, and people on slow internet connections.'
      }
    ]
  },
  module2: {
    title: 'WCAG 2.1 Guidelines Explained',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        text: 'What is the minimum WCAG conformance level recommended for most websites?',
        options: ['Level A', 'Level AA', 'Level AAA', 'Level B'],
        correct: 1,
        explanation: 'Level AA is the widely accepted standard for most public-facing websites and is required by many accessibility laws and policies.'
      },
      {
        id: 'q2',
        text: 'What is the minimum color contrast ratio required by WCAG 2.1 Level AA for normal text?',
        options: ['3:1', '4.5:1', '7:1', '2:1'],
        correct: 1,
        explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text (smaller than 18pt or 14pt bold).'
      },
      {
        id: 'q3',
        text: 'Which WCAG success criterion requires that all functionality is available via keyboard?',
        options: ['1.3.1', '2.1.1', '3.1.1', '4.1.2'],
        correct: 1,
        explanation: 'Success Criterion 2.1.1 (Keyboard) requires all functionality to be operable through a keyboard interface, under WCAG principle "Operable".'
      },
      {
        id: 'q4',
        text: 'What is the purpose of a "skip navigation" link?',
        options: [
          'To skip the entire page for screen readers',
          'To allow keyboard users to bypass repetitive navigation blocks',
          'To hide navigation on mobile devices',
          'To speed up page loading'
        ],
        correct: 1,
        explanation: 'Skip navigation links allow keyboard and screen reader users to jump directly to the main content, bypassing repetitive navigation menus on every page.'
      },
      {
        id: 'q5',
        text: 'Under WCAG, text that is part of a logo or brand name is:',
        options: [
          'Required to meet contrast requirements',
          'Exempt from contrast requirements',
          'Required to be replaced with text',
          'Not allowed on accessible websites'
        ],
        correct: 1,
        explanation: 'WCAG 2.1 Success Criterion 1.4.3 notes that text that is part of a logo or brand name has no contrast requirement.'
      },
      {
        id: 'q6',
        text: 'Which WCAG principle focuses on making content readable and understandable?',
        options: ['Perceivable', 'Operable', 'Understandable', 'Robust'],
        correct: 2,
        explanation: 'The "Understandable" principle (U in POUR) focuses on making text readable, predictable, and providing input assistance to help users avoid and correct mistakes.'
      }
    ]
  },
  module3: {
    title: 'Content Creation Best Practices',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        text: 'What is the recommended maximum line length for body text to aid readability?',
        options: ['40 characters', '60–80 characters', '100–120 characters', 'No limit'],
        correct: 1,
        explanation: 'Lines of 60–80 characters are generally recommended for optimal readability, preventing eye fatigue from tracking very long lines.'
      },
      {
        id: 'q2',
        text: 'When writing alt text for a complex chart, you should:',
        options: [
          'Write "chart" as the alt text',
          'Leave alt blank because the chart is visual',
          'Provide a brief description plus a longer text alternative or data table',
          'Use the file name as alt text'
        ],
        correct: 2,
        explanation: 'Complex images like charts need a brief alt description in the attribute and a longer text alternative (or data table) elsewhere on the page so all users get the full information.'
      },
      {
        id: 'q3',
        text: 'Which heading structure is correct for an accessible document?',
        options: [
          'H1 → H3 → H4 (skipping H2)',
          'H1 → H2 → H3 (sequential)',
          'H2 → H1 → H3 (any order)',
          'Multiple H1s with no H2 or H3'
        ],
        correct: 1,
        explanation: 'Headings should be used in sequential order (H1 → H2 → H3) without skipping levels. This creates a logical outline that helps screen reader users navigate the page.'
      },
      {
        id: 'q4',
        text: 'Which of these is an example of accessible link text?',
        options: [
          '"Click here"',
          '"Read more"',
          '"Download the 2024 Accessibility Report (PDF)"',
          '"Here"'
        ],
        correct: 2,
        explanation: 'Link text should be descriptive and meaningful out of context. Screen reader users often navigate by a list of links, so each link must clearly describe its destination or action.'
      },
      {
        id: 'q5',
        text: 'What should you include when inserting a data table into content?',
        options: [
          'Only data cells, no headers needed',
          'A caption, proper header cells (<th>) with scope, and a summary if complex',
          'Just a title above the table in a paragraph',
          'An image screenshot of the table'
        ],
        correct: 1,
        explanation: 'Accessible tables need a <caption>, proper <th> elements with scope attributes, and for complex tables a summary. This allows screen readers to associate data cells with their headers.'
      },
      {
        id: 'q6',
        text: 'When using color to convey information (e.g., red = error), you should also:',
        options: [
          'Use only red and green as they are universally understood',
          'Rely on color alone since it is fast and clear',
          'Provide another visual indicator such as an icon or text label',
          'Use bold text in the same color'
        ],
        correct: 2,
        explanation: 'Color should never be the only way information is conveyed (WCAG 1.4.1). Always pair color with another visual indicator like an icon, pattern, or text label for users with color blindness.'
      }
    ]
  }
};

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
  resultsDiv.innerHTML =
    '<h3 class="quiz-result-title">' + (passed ? '&#10003; Passed!' : '&#10007; Not quite') + '</h3>' +
    '<p>You scored <strong>' + correct + ' / ' + total + '</strong> (' + pct + '%).</p>' +
    (passed
      ? '<p>Well done! You have demonstrated a solid understanding of this module.</p>'
      : '<p>You need ' + quiz.passingScore + '% to pass. Review the explanations above and try again.</p>') +
    '<button type="button" class="button ' + (passed ? 'secondary' : 'primary') + ' quiz-retake">Retake Quiz</button>';

  submitBtn.hidden = true;

  if (passed) markModuleComplete(moduleId);

  resultsDiv.querySelector('.quiz-retake').addEventListener('click', function () {
    clearQuizState(moduleId);
    renderQuiz(moduleId, form.parentElement);
  });
}

function loadQuizState(moduleId) {
  try {
    const raw = localStorage.getItem('toolkit-quiz-' + moduleId);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function saveQuizState(moduleId, state) {
  try {
    localStorage.setItem('toolkit-quiz-' + moduleId, JSON.stringify(state));
  } catch (_) {}
}

function clearQuizState(moduleId) {
  try {
    localStorage.removeItem('toolkit-quiz-' + moduleId);
  } catch (_) {}
}

function markModuleComplete(moduleId) {
  try {
    const completed = JSON.parse(localStorage.getItem('toolkit-completed-modules') || '[]');
    if (!completed.includes(moduleId)) {
      completed.push(moduleId);
      localStorage.setItem('toolkit-completed-modules', JSON.stringify(completed));
    }
  } catch (_) {}
}

// ── Auto-init ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  const moduleId = container.dataset.module;
  if (!moduleId || !QUIZ_DATA[moduleId]) return;
  renderQuiz(moduleId, container);
});

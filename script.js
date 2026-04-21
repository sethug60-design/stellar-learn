// ============================================================
// ConceptLab – script.js
// All interactive behaviour lives here.
// Sections:
//   1. Get references to HTML elements
//   2. Tab switching
//   3. Generate button click handler
//   4. Mock data (placeholder until real AI is connected)
//   5. Render functions (explanation, notes, flashcards, quiz)
//   6. Chat basic behaviour
// ============================================================


// ---- 1. GRAB HTML ELEMENTS ----
// document.getElementById lets us "grab" an element from the HTML by its id
// so we can read from it or change it with JavaScript.

const levelSelect   = document.getElementById('level-select');
const conceptInput  = document.getElementById('concept-input');
const generateBtn   = document.getElementById('generate-btn');
const btnText       = document.getElementById('btn-text');
const btnSpinner    = document.getElementById('btn-spinner');
const errorMsg      = document.getElementById('error-msg');
const outputSection = document.getElementById('output-section');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-btn');   // grabs ALL tab buttons at once
const tabPanels  = document.querySelectorAll('.tab-panel'); // grabs ALL panels at once

// Output text elements (inside Explanation tab)
const outExplanation = document.getElementById('out-explanation');
const outSteps       = document.getElementById('out-steps');
const outAnalogy     = document.getElementById('out-analogy');
const outWhy         = document.getElementById('out-why');
const outNotes       = document.getElementById('out-notes');

// Flashcards & quiz containers
const flashcardContainer = document.getElementById('flashcard-container');
const quizContainer      = document.getElementById('quiz-container');
const quizSubmitBtn      = document.getElementById('quiz-submit-btn');
const quizResult         = document.getElementById('quiz-result');

// Chat elements
const chatWindow  = document.getElementById('chat-window');
const chatInput   = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');


// ---- 2. TAB SWITCHING ----
// When a tab button is clicked:
//   a) Remove "active" from all tab buttons
//   b) Add "active" to the clicked one
//   c) Hide all panels
//   d) Show the panel that matches the clicked tab

tabButtons.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Which tab was clicked? Read its data-tab attribute
    const targetTab = btn.getAttribute('data-tab');

    // Step a & b: update active button
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Step c & d: update active panel
    tabPanels.forEach(function(panel) {
      // panel id is like "panel-explanation", "panel-notes", etc.
      if (panel.id === 'panel-' + targetTab) {
        panel.classList.remove('hidden');
        panel.classList.add('active');
      } else {
        panel.classList.add('hidden');
        panel.classList.remove('active');
      }
    });
  });
});


// ---- 3. GENERATE BUTTON ----

generateBtn.addEventListener('click', function() {
  const level   = levelSelect.value;
  const concept = conceptInput.value.trim();   // .trim() removes extra spaces

  // Validate: both fields must be filled
  if (!level || !concept) {
    errorMsg.classList.remove('hidden');
    return;   // stop here, don't continue
  }

  // Hide error if it was showing
  errorMsg.classList.add('hidden');

  // Show loading state on button
  setLoading(true);

  // ---------------------------------------------------------
  // RIGHT NOW we use fake/mock data.
  // In Version 2 you will replace this with a real API call.
  // We use setTimeout to simulate a 1.5-second "loading" delay.
  // ---------------------------------------------------------
  setTimeout(function() {
    const mockData = getMockData(level, concept);

    // Fill in all the output sections
    renderExplanation(mockData);
    renderNotes(mockData.notes);
    renderFlashcards(mockData.flashcards);
    renderQuiz(mockData.quiz);

    // Show the output section (it was hidden before)
    outputSection.classList.remove('hidden');

    // Scroll smoothly down to the output
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset button back to normal
    setLoading(false);

    // Switch to first tab (Explanation) to show fresh results
    tabButtons[0].click();

  }, 1500);

});


// ---- 4. MOCK DATA FUNCTION ----
// Returns a fake object that mimics what a real AI would send back.
// The level and concept are used to personalise the placeholder text.

function getMockData(level, concept) {
  return {
    explanation: `Great question! Here is a ${level}-level explanation of "${concept}".\n\nThis is placeholder text. In Version 2, a real AI (like Claude or GPT) will fill this with an actual explanation suited exactly to your level and question.`,

    steps: `Step 1: Understand the basic idea.\nStep 2: Look at a simple example.\nStep 3: Try it yourself.\n\n(Real steps will be generated by the AI in Version 2.)`,

    analogy: `Think of "${concept}" like ordering food at a restaurant. You place an order (input), the kitchen processes it (logic), and you get your meal (output). 🍽️\n\n(Real analogies will be generated by the AI in Version 2.)`,

    why: `Understanding "${concept}" is important because it builds a foundation for more advanced topics. Many real-world technologies and discoveries rely on this concept.\n\n(The AI will explain exactly why it matters for your level in Version 2.)`,

    notes: `📌 Key Points about "${concept}" (${level} level)\n\n• Point 1: This is the first important idea to remember.\n• Point 2: This is the second important idea.\n• Point 3: Always connect this to what you already know.\n• Point 4: Practice with examples to strengthen understanding.\n\n🔑 Keywords: placeholder, concept, learning, AI\n\n(Notes will be generated by the AI in Version 2.)`,

    flashcards: [
      { front: 'What is ' + concept + '?',               back: 'It is an important concept at the ' + level + ' level. (AI will fill this.)' },
      { front: 'Give one real-world example.',           back: 'Example: A practical application of this concept. (AI will fill this.)' },
      { front: 'Why does this concept matter?',          back: 'It matters because it connects to many other ideas. (AI will fill this.)' },
      { front: 'Name one related concept.',              back: 'Related idea: Another connected topic. (AI will fill this.)' },
    ],

    quiz: [
      {
        question: 'What best describes the main idea of "' + concept + '"?',
        options: ['Option A – Placeholder answer', 'Option B – Another answer', 'Option C – The correct one (AI picks)', 'Option D – Distractor'],
        correct: 2   // index of the correct option (0-based)
      },
      {
        question: 'Which of the following is a real-world application?',
        options: ['Technology use', 'Daily life example', 'Scientific field', 'All of the above'],
        correct: 3
      },
      {
        question: 'What level is this explanation targeted at?',
        options: ['Middle School', 'Advanced', level.charAt(0).toUpperCase() + level.slice(1), 'Postgraduate'],
        correct: 2
      }
    ]
  };
}


// ---- 5. RENDER FUNCTIONS ----
// Each function takes data and puts it into the right HTML element.

// 5a. Render the Explanation tab
function renderExplanation(data) {
  outExplanation.textContent = data.explanation;
  outSteps.textContent       = data.steps;
  outAnalogy.textContent     = data.analogy;
  outWhy.textContent         = data.why;

  // Remove placeholder styling now that there is real content
  [outExplanation, outSteps, outAnalogy, outWhy].forEach(function(el) {
    el.classList.remove('placeholder-text');
  });
}

// 5b. Render the Notes tab
function renderNotes(notesText) {
  outNotes.textContent = notesText;
  outNotes.classList.remove('placeholder-text');
}

// 5c. Render Flashcards
// Each card gets a front (question) and back (answer).
// Clicking flips it using CSS 3D transform.
function renderFlashcards(cards) {
  // Clear old content
  flashcardContainer.innerHTML = '';

  cards.forEach(function(card, index) {
    // Build the flashcard HTML structure
    const cardEl = document.createElement('div');
    cardEl.classList.add('flashcard');
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('aria-label', 'Flashcard ' + (index + 1) + '. Click to flip.');

    cardEl.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">${card.front}</div>
        <div class="flashcard-back">${card.back}</div>
      </div>
    `;

    // Clicking the card toggles the "flipped" class
    // CSS takes care of the actual visual flip
    cardEl.addEventListener('click', function() {
      cardEl.classList.toggle('flipped');
    });

    flashcardContainer.appendChild(cardEl);
  });
}

// 5d. Render Quiz
// For each question: show the question text + radio button options.
function renderQuiz(questions) {
  // Clear old content and reset result
  quizContainer.innerHTML = '';
  quizResult.classList.add('hidden');
  quizResult.textContent = '';
  quizSubmitBtn.classList.remove('hidden');

  questions.forEach(function(q, qIndex) {
    const qEl = document.createElement('div');
    qEl.classList.add('quiz-question');

    // Question text
    qEl.innerHTML = `<p>Q${qIndex + 1}: ${q.question}</p>`;

    // Create a radio option for each answer
    q.options.forEach(function(option, oIndex) {
      const label = document.createElement('label');
      label.classList.add('quiz-option');

      label.innerHTML = `
        <input type="radio" name="q${qIndex}" value="${oIndex}" />
        ${option}
      `;

      qEl.appendChild(label);
    });

    quizContainer.appendChild(qEl);
  });

  // Store questions on the button so we can access them when grading
  quizSubmitBtn._questions = questions;
}


// ---- CHECK QUIZ ANSWERS ----
quizSubmitBtn.addEventListener('click', function() {
  const questions = quizSubmitBtn._questions;
  if (!questions) return;

  let score = 0;

  questions.forEach(function(q, qIndex) {
    // Find all options for this question
    const options = quizContainer.querySelectorAll(`[name="q${qIndex}"]`);
    let selectedValue = null;

    options.forEach(function(radio) {
      if (radio.checked) selectedValue = parseInt(radio.value);
      // Remove old colour classes
      radio.parentElement.classList.remove('correct', 'wrong');
    });

    // Colour the options: green = correct, red = selected wrong
    options.forEach(function(radio, i) {
      if (i === q.correct) {
        radio.parentElement.classList.add('correct');   // always show correct
      } else if (parseInt(radio.value) === selectedValue && selectedValue !== q.correct) {
        radio.parentElement.classList.add('wrong');     // show user's wrong pick
      }
    });

    if (selectedValue === q.correct) score++;
  });

  // Show result message
  quizResult.classList.remove('hidden');
  quizResult.textContent = `You got ${score} out of ${questions.length} correct! ${score === questions.length ? '🎉 Perfect!' : '📚 Keep going!'}`;

  // Disable submit after checking
  quizSubmitBtn.disabled = true;
  quizSubmitBtn.style.opacity = '0.5';
});


// ---- 6. CHAT BASIC BEHAVIOUR ----
// For now, the bot always replies with a fixed message.
// In Version 2, this will be connected to a real AI.

chatSendBtn.addEventListener('click', sendChatMessage);

// Allow pressing Enter key to send
chatInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendChatMessage();
});

function sendChatMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;   // do nothing if empty

  // Add the user's bubble
  addChatBubble(msg, 'user');
  chatInput.value = '';   // clear the input

  // Fake AI reply after a short delay
  setTimeout(function() {
    addChatBubble(
      "Great question! 🤖 In Version 2, I'll give you a real AI answer. For now, keep exploring the other tabs!",
      'ai'
    );
  }, 800);
}

function addChatBubble(text, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble');
  bubble.classList.add(sender === 'ai' ? 'ai-bubble' : 'user-bubble');
  bubble.textContent = text;
  chatWindow.appendChild(bubble);

  // Auto-scroll to bottom so the latest message is visible
  chatWindow.scrollTop = chatWindow.scrollHeight;
}


// ---- HELPER: Loading State ----
// Swaps button text and shows/hides the spinner

function setLoading(isLoading) {
  if (isLoading) {
    btnText.textContent = 'Generating...';
    btnSpinner.classList.remove('hidden');
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.8';
  } else {
    btnText.textContent = '✨ Generate';
    btnSpinner.classList.add('hidden');
    generateBtn.disabled = false;
    generateBtn.style.opacity = '1';
  }
}

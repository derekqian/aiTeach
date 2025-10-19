// Presentation state
let currentSlideIndex = 0;
let slides = [];
let presenterNotes = {};

// DOM Elements (will be set after DOM loads)
let slidesContainer;
let presenterNotesContainer;
let slideCounter;
let prevButton;
let nextButton;
let toggleNotesButton;

// Initialize presentation
document.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements after DOM is loaded
    slidesContainer = document.querySelector('.slides');
    presenterNotesContainer = document.querySelector('.presenter-notes');
    slideCounter = document.getElementById('slideCounter');
    prevButton = document.getElementById('prevSlide');
    nextButton = document.getElementById('nextSlide');
    toggleNotesButton = document.getElementById('toggleNotes');

    await loadPresentation();
    setupEventListeners();
    showSlide(currentSlideIndex);
});

// Load presentation content
async function loadPresentation() {
    try {
        // Simple test slides first
        const presentationSlides = [
            {
                title: 'GitHub Tutorial for Students',
                content: '<div class="title-slide"><div class="title-icon animate-bounce">🚀</div><h1>Learn GitHub with VS Code</h1><h2>An Interactive Tutorial for Students</h2><div class="floating-icons"><span class="icon-git animate-float-1">🔧</span><span class="icon-code animate-float-2">💻</span><span class="icon-team animate-float-3">👥</span></div></div>',
                notes: 'Welcome students and introduce the course objectives.'
            },
            {
                title: 'What is Version Control?',
                content: '<h1>What is Version Control?</h1><div class="concept-examples"><div class="example-item animate-slide-in-1"><div class="example-icon">📝</div><span>Google Docs revision history</span></div><div class="example-item animate-slide-in-2"><div class="example-icon">🎮</div><span>Save files in video games</span></div><div class="example-item animate-slide-in-3"><div class="example-icon">📱</div><span>App updates on your phone</span></div></div>',
                notes: 'Start with relatable examples students understand.'
            },
            {
                title: 'Why Do We Need Version Control?',
                content: '<h1>Why Do We Need Version Control?</h1><div class="problems-solutions"><div class="problems animate-slide-left"><div class="problem-icon">😵</div><h2>Without Version Control:</h2><ul><li><span class="bullet-icon">📁</span>Messy file naming</li><li><span class="bullet-icon">💥</span>Lost work</li><li><span class="bullet-icon">🤯</span>Difficult collaboration</li></ul></div><div class="solutions animate-slide-right"><div class="solution-icon">😊</div><h2>With Version Control:</h2><ul><li><span class="bullet-icon">📚</span>Organized history</li><li><span class="bullet-icon">🛡️</span>Safe changes</li><li><span class="bullet-icon">🤝</span>Smooth teamwork</li></ul></div></div>',
                notes: 'Relate to student experiences with messy file naming.'
            },
            {
                title: 'Key Concepts',
                content: '<h1>Key Concepts</h1><div class="concepts-visual"><div class="concept-item animate-zoom-in-1"><div class="concept-visual">📂</div><div class="concept-text"><strong>Repository:</strong> A folder Git watches</div></div><div class="concept-item animate-zoom-in-2"><div class="concept-visual">📸</div><div class="concept-text"><strong>Commit:</strong> A snapshot of your project</div></div><div class="concept-item animate-zoom-in-3"><div class="concept-visual">🌿</div><div class="concept-text"><strong>Branch:</strong> A separate timeline</div></div><div class="concept-item animate-zoom-in-4"><div class="concept-visual">☁️</div><div class="concept-text"><strong>Remote:</strong> Online copy (like GitHub)</div></div></div>',
                notes: 'Focus on the big picture with simple analogies.'
            },
            {
                title: 'Setting Up Your Environment',
                content: '<h1>Getting Started: Setup</h1><h2>What we need:</h2><ul><li>Git - The version control system</li><li>VS Code - Our code editor</li></ul>',
                notes: 'Walk through installation on the platform most students use.'
            },
            {
                title: 'Configuring Git',
                content: '<h1>Configuring Git</h1><div class="config-steps"><div class="command-block"><h2>Essential Setup Commands:</h2><pre>git config --global user.name "Your Name"<br>git config --global user.email "your.email@example.com"</pre></div><div class="verification"><h2>Verify Your Configuration:</h2><pre>git config --list<br>git config user.name<br>git config user.email</pre></div></div>',
                notes: 'Demonstrate this live. Emphasize this is one-time setup.'
            },
            {
                title: 'Integrated Terminal',
                content: '<h1>Integrated Terminal Essentials</h1><h2>Why learn terminal commands?</h2><ul><li>Precision and control</li><li>Speed and efficiency</li><li>Professional skills</li></ul>',
                notes: 'Address student concerns about command line being scary.'
            },
            {
                title: 'Essential Git Commands',
                content: '<h1>Essential Git Commands</h1><div class="git-workflow"><h2>Daily workflow:</h2><div class="workflow-steps"><div class="workflow-step animate-step-1"><div class="step-icon">🔍</div><div class="step-info"><code>git status</code><br><span>Check what changed</span></div></div><div class="workflow-arrow">→</div><div class="workflow-step animate-step-2"><div class="step-icon">📋</div><div class="step-info"><code>git add .</code><br><span>Stage changes</span></div></div><div class="workflow-arrow">→</div><div class="workflow-step animate-step-3"><div class="step-icon">💾</div><div class="step-info"><code>git commit -m "message"</code><br><span>Save snapshot</span></div></div><div class="workflow-arrow">→</div><div class="workflow-step animate-step-4"><div class="step-icon">☁️</div><div class="step-info"><code>git push</code><br><span>Upload to GitHub</span></div></div></div></div>',
                notes: 'This is the core workflow students will use daily.'
            },
            {
                title: 'Source Control Tab',
                content: '<h1>VS Code Source Control Tab</h1><div class="gui-features"><h2>Visual Git Interface:</h2><div class="feature-grid"><div class="feature-item animate-fade-in-1"><div class="feature-icon">🎨</div><div class="feature-text">See changes in color</div></div><div class="feature-item animate-fade-in-2"><div class="feature-icon">🖱️</div><div class="feature-text">Click-friendly interface</div></div><div class="feature-item animate-fade-in-3"><div class="feature-icon">👁️</div><div class="feature-text">Quick project overview</div></div></div><div class="vs-code-mockup animate-slide-up"><div class="mockup-header">Source Control</div><div class="mockup-content">📝 Changes (3)<br/>📄 README.md M<br/>📄 style.css M<br/>📄 script.js A</div></div></div>',
                notes: 'Show how GUI and terminal complement each other.'
            },
            {
                title: 'Practice Time',
                content: '<h1>Let\'s Practice! <span class="practice-emoji animate-wiggle">🎯</span></h1><div class="practice-goals"><h2>Today\'s Goals:</h2><div class="goals-grid"><div class="goal-item animate-bounce-in-1"><div class="goal-icon">🎁</div><div class="goal-text">Create your first repository</div></div><div class="goal-item animate-bounce-in-2"><div class="goal-icon">✏️</div><div class="goal-text">Make changes to files</div></div><div class="goal-item animate-bounce-in-3"><div class="goal-icon">🔄</div><div class="goal-text">Practice the Git workflow</div></div><div class="goal-item animate-bounce-in-4"><div class="goal-icon">🖥️</div><div class="goal-text">Try both terminal and GUI</div></div></div><div class="encouragement animate-pulse">Ready to become a Git master? Let\'s do this! 💪</div></div>',
                notes: 'Transition to hands-on time. Help students individually.'
            }
        ];

        // Create slide elements
        presentationSlides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.innerHTML = slide.content;
            slidesContainer.appendChild(slideElement);
            presenterNotes[index] = slide.notes;
        });

        slides = document.querySelectorAll('.slide');
        updateSlideCounter();
    } catch (error) {
        console.error('Error loading presentation:', error);
    }
}

// Event listeners
function setupEventListeners() {
    prevButton.addEventListener('click', previousSlide);
    nextButton.addEventListener('click', nextSlide);
    toggleNotesButton.addEventListener('click', toggleNotes);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                previousSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
            case 'n':
                toggleNotes();
                break;
        }
    });
}

// Navigation functions
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    updateSlideCounter();
    updatePresenterNotes();
}

function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }
}

function previousSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }
}

function updateSlideCounter() {
    slideCounter.textContent = `Slide ${currentSlideIndex + 1} / ${slides.length}`;
}

function updatePresenterNotes() {
    presenterNotesContainer.innerHTML = `
        <h3>Presenter Notes</h3>
        <p>${presenterNotes[currentSlideIndex] || 'No notes for this slide.'}</p>
    `;
}

function toggleNotes() {
    presenterNotesContainer.hidden = !presenterNotesContainer.hidden;
}
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
                content: '<div class="title-slide"><h1>Learn GitHub with VS Code</h1><h2>An Interactive Tutorial for Students</h2></div>',
                notes: 'Welcome students and introduce the course objectives.'
            },
            {
                title: 'What is Version Control?',
                content: '<h1>What is Version Control?</h1><ul><li>Google Docs revision history</li><li>Save files in video games</li><li>App updates on your phone</li></ul>',
                notes: 'Start with relatable examples students understand.'
            },
            {
                title: 'Why Do We Need Version Control?',
                content: '<h1>Why Do We Need Version Control?</h1><div class="problems-solutions"><div class="problems"><h2>Without Version Control:</h2><ul><li>Messy file naming</li><li>Lost work</li><li>Difficult collaboration</li></ul></div><div class="solutions"><h2>With Version Control:</h2><ul><li>Organized history</li><li>Safe changes</li><li>Smooth teamwork</li></ul></div></div>',
                notes: 'Relate to student experiences with messy file naming.'
            },
            {
                title: 'Key Concepts',
                content: '<h1>Key Concepts</h1><ul><li><strong>Repository:</strong> A folder Git watches</li><li><strong>Commit:</strong> A snapshot of your project</li><li><strong>Branch:</strong> A separate timeline</li><li><strong>Remote:</strong> Online copy (like GitHub)</li></ul>',
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
                content: '<h1>Essential Git Commands</h1><h2>Daily workflow:</h2><ol><li><code>git status</code> - Check what changed</li><li><code>git add .</code> - Stage changes</li><li><code>git commit -m "message"</code> - Save snapshot</li><li><code>git push</code> - Upload to GitHub</li></ol>',
                notes: 'This is the core workflow students will use daily.'
            },
            {
                title: 'Source Control Tab',
                content: '<h1>VS Code Source Control Tab</h1><h2>Visual Git Interface:</h2><ul><li>See changes in color</li><li>Click-friendly interface</li><li>Quick project overview</li></ul>',
                notes: 'Show how GUI and terminal complement each other.'
            },
            {
                title: 'Practice Time',
                content: '<h1>Let\'s Practice!</h1><h2>Today\'s Goals:</h2><ul><li>Create your first repository</li><li>Make changes to files</li><li>Practice the Git workflow</li><li>Try both terminal and GUI</li></ul>',
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
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
                content: '<h1>What is Version Control?</h1><div class="concept-examples-with-images"><div class="example-row animate-slide-in-1"><div class="example-content"><div class="example-icon">🌿</div><span>Loki timeline branches</span></div><div class="example-image-small"><img src="assets/1-Loki-timeline-branch.gif" alt="Loki timeline branches showing different realities"></div></div><div class="example-row animate-slide-in-2"><div class="example-content"><div class="example-icon">📝</div><span>Google Docs revision history</span></div><div class="example-image-small"><img src="assets/1-google-docs-revision-historyimage.png" alt="Google Docs revision history"></div></div><div class="example-row animate-slide-in-3"><div class="example-content"><div class="example-icon">🎮</div><span>Save files in video games</span></div><div class="example-image-small"><img src="assets/1-video-game-history.jpeg" alt="Video game save files"></div></div></div>',
                notes: 'Start with relatable examples students understand.'
            },
            {
                title: 'What is Version Control?',
                content: '<h1>What is Version Control?</h1><div class="hierarchy-comparison"><div class="hierarchy-side animate-slide-left"><div class="hierarchy-header"><h2>📁 Folder Hierarchy</h2><p>Traditional file organization</p></div><div class="hierarchy-image"><img src="assets/2-folder-hierachy.png" alt="Folder hierarchy showing nested folders"></div></div><div class="hierarchy-side animate-slide-right"><div class="hierarchy-header"><h2>🌿 Git Branch Hierarchy</h2><p>Version control organization</p></div><div class="hierarchy-image"><img src="assets/2-git-branch.png" alt="Git branch hierarchy showing branching structure"></div></div></div>',
                notes: 'Compare traditional file organization with Git\'s branching approach.'
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
                title: 'Viewing Changes with Git Diff',
                content: '<h1>Viewing Changes with Git Diff 🔍</h1><div class="diff-concept"><div class="diff-commands"><h2>📋 Essential Diff Commands</h2><div class="diff-commands-grid"><div class="diff-command animate-slide-in-1"><div class="command-header"><code>git diff</code></div><div class="command-desc">See unstaged changes in your files</div></div><div class="diff-command animate-slide-in-2"><div class="command-header"><code>git diff --staged</code></div><div class="command-desc">See staged changes ready to commit</div></div><div class="diff-command animate-slide-in-3"><div class="command-header"><code>git diff HEAD~1</code></div><div class="command-desc">Compare with previous commit</div></div><div class="diff-command animate-slide-in-4"><div class="command-header"><code>git diff branch-name</code></div><div class="command-desc">Compare with another branch</div></div></div></div><div class="diff-visual"><h2>🎨 Reading Diff Output</h2><div class="diff-example animate-fade-in"><div class="diff-output"><div class="diff-header">@@ -1,3 +1,4 @@</div><div class="diff-line unchanged"> function greet(name) {</div><div class="diff-line removed">-   console.log("Hello " + name);</div><div class="diff-line added">+   console.log("Hello, " + name + "!");</div><div class="diff-line added">+   return `Welcome ${name}`;</div><div class="diff-line unchanged"> }</div></div><div class="diff-legend"><div class="legend-item"><span class="legend-color removed"></span>Removed lines (-)</div><div class="legend-item"><span class="legend-color added"></span>Added lines (+)</div><div class="legend-item"><span class="legend-color unchanged"></span>Unchanged lines</div></div></div></div></div>',
                notes: 'Show students how to see exactly what changed in their code before committing.'
            },
            {
                title: 'Branching and Merging',
                content: '<h1>Branching and Merging</h1><div class="branching-concept"><div class="branch-visualization"><h2>🌿 Why Use Branches?</h2><div class="branch-reasons"><div class="reason-item animate-slide-in-1"><div class="reason-icon">🧪</div><div class="reason-text">Experiment safely without breaking main code</div></div><div class="reason-item animate-slide-in-2"><div class="reason-icon">👥</div><div class="reason-text">Work on features while others code too</div></div><div class="reason-item animate-slide-in-3"><div class="reason-icon">🔄</div><div class="reason-text">Merge completed work back together</div></div></div></div><div class="branch-commands"><h2>Essential Branch Commands:</h2><div class="command-grid"><div class="command-item animate-fade-in-1"><code>git branch feature-name</code><br><span>Create new branch</span></div><div class="command-item animate-fade-in-2"><code>git checkout feature-name</code><br><span>Switch to branch</span></div><div class="command-item animate-fade-in-3"><code>git merge feature-name</code><br><span>Merge branch back</span></div><div class="command-item animate-fade-in-4"><code>git branch -d feature-name</code><br><span>Delete finished branch</span></div></div></div></div>',
                notes: 'Explain branching as parallel development streams that can be merged back.'
            },
            {
                title: 'Pull Requests',
                content: '<h1>Pull Requests 🔄</h1><div class="pull-request-concept"><div class="pr-workflow"><h2>📋 The Pull Request Workflow</h2><div class="workflow-steps-pr"><div class="pr-step animate-slide-in-1"><div class="step-number">1</div><div class="step-content"><strong>Create branch</strong><br><span>Work on your feature</span></div></div><div class="pr-step animate-slide-in-2"><div class="step-number">2</div><div class="step-content"><strong>Push to GitHub</strong><br><span>Upload your branch</span></div></div><div class="pr-step animate-slide-in-3"><div class="step-number">3</div><div class="step-content"><strong>Open Pull Request</strong><br><span>Request to merge your work</span></div></div><div class="pr-step animate-slide-in-4"><div class="step-number">4</div><div class="step-content"><strong>Review & Merge</strong><br><span>Team reviews and approves</span></div></div></div></div><div class="pr-benefits"><h2>✨ Why Use Pull Requests?</h2><div class="benefits-list"><div class="benefit-item animate-fade-in-1"><div class="benefit-icon">👀</div><div class="benefit-text">Code review before merging</div></div><div class="benefit-item animate-fade-in-2"><div class="benefit-icon">💬</div><div class="benefit-text">Discuss changes with team</div></div><div class="benefit-item animate-fade-in-3"><div class="benefit-icon">📝</div><div class="benefit-text">Document what changed and why</div></div><div class="benefit-item animate-fade-in-4"><div class="benefit-icon">🛡️</div><div class="benefit-text">Protect main branch from bugs</div></div></div></div></div>',
                notes: 'Emphasize pull requests as collaborative tool for safe code integration.'
            },
            {
                title: 'Source Control Tab',
                content: '<h1>VS Code Source Control Tab</h1><div class="gui-features"><h2>Visual Git Interface:</h2><div class="feature-grid"><div class="feature-item animate-fade-in-1"><div class="feature-icon">🎨</div><div class="feature-text">See changes in color</div></div><div class="feature-item animate-fade-in-2"><div class="feature-icon">🖱️</div><div class="feature-text">Click-friendly interface</div></div><div class="feature-item animate-fade-in-3"><div class="feature-icon">👁️</div><div class="feature-text">Quick project overview</div></div></div><div class="vs-code-mockup animate-slide-up"><div class="mockup-header">Source Control</div><div class="mockup-content">📝 Changes (3)<br/>📄 README.md M<br/>📄 style.css M<br/>📄 script.js A</div></div></div>',
                notes: 'Show how GUI and terminal complement each other.'
            },
            {
                title: 'AI-Powered Version Control',
                content: '<h1>AI-Powered Version Control 🤖</h1><div class="ai-git-concept"><div class="ai-tools"><h2>🚀 AI Tools for Git</h2><div class="ai-tools-grid"><div class="ai-tool animate-slide-in-1"><div class="tool-icon">✍️</div><div class="tool-content"><strong>Smart Commit Messages</strong><br><span>AI generates meaningful commit descriptions</span></div></div><div class="ai-tool animate-slide-in-2"><div class="tool-icon">🔍</div><div class="tool-content"><strong>Code Review Assistant</strong><br><span>AI suggests improvements and catches bugs</span></div></div><div class="ai-tool animate-slide-in-3"><div class="tool-icon">🔄</div><div class="tool-content"><strong>Merge Conflict Resolution</strong><br><span>AI helps resolve complex conflicts</span></div></div><div class="ai-tool animate-slide-in-4"><div class="tool-icon">📊</div><div class="tool-content"><strong>Project Analysis</strong><br><span>AI provides insights on code patterns</span></div></div></div></div><div class="ai-examples"><h2>💡 Popular AI Git Tools</h2><div class="tools-showcase"><div class="showcase-item animate-fade-in-1"><div class="showcase-icon">🤖</div><div class="showcase-text"><strong>GitHub Copilot</strong><br>Suggests code and commits</div></div><div class="showcase-item animate-fade-in-2"><div class="showcase-icon">🧠</div><div class="showcase-text"><strong>GitKraken Glo</strong><br>AI-powered project insights</div></div><div class="showcase-item animate-fade-in-3"><div class="showcase-icon">⚡</div><div class="showcase-text"><strong>Claude Code</strong><br>AI assistant for Git workflows</div></div><div class="showcase-item animate-fade-in-4"><div class="showcase-icon">🎯</div><div class="showcase-text"><strong>AI Code Review</strong><br>Automated quality checks</div></div></div><div class="ai-future"><div class="future-note animate-pulse">🔮 The future of coding: AI + Human collaboration!</div></div></div></div>',
                notes: 'Show how AI is transforming development workflows and making Git more accessible.'
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

    // Click navigation on slides
    slidesContainer.addEventListener('click', (e) => {
        const rect = slidesContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const containerWidth = rect.width;

        // If click is on left half, go to previous slide
        if (clickX < containerWidth / 2) {
            previousSlide();
        }
        // If click is on right half, go to next slide
        else {
            nextSlide();
        }
    });

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
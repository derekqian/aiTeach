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
                title: 'Version Control Tutorial for Students',
                content: '<div class="title-slide"><div class="title-icon animate-bounce">🚀</div><h1>Learn Version Control with VS Code</h1><h2>using git and github</h2><div class="floating-icons"><span class="icon-git animate-float-1">🔧</span><span class="icon-code animate-float-2">💻</span><span class="icon-team animate-float-3">👥</span></div></div>',
                notes: 'Welcome students and introduce the course objectives.'
            },
            {
                title: 'The Problem',
                content: '<h1>The Problem</h1><div style="display: flex; align-items: center; justify-content: center; gap: 40px; margin-top: 40px;"><div style="flex: 0 0 auto; max-width: 50%; margin-right: 20px;"><pre style="text-align: left; font-size: 2.2em; line-height: 1.5;">Project/\n├── report.docx\n├── report_v1.docx\n├── report_v2.docx\n├── report_final.docx\n├── report_final_final.docx\n├── report_final_final_Janes_edits.docx\n├── report_final_with_comments.docx\n└── report_final_with_comments_FINAL_2025-10-25.docx</pre></div><div style="flex: 0 0 auto; max-width: 32%; margin-left: 20px; margin-top: -30px;"><img src="assets/1_manual_rename.png" alt="Comic showing messy file naming without version control" style="max-width: 100%; height: auto;"></div></div>',
                notes: 'This comic illustrates the chaos of manual file versioning. Students will relate to the frustration of messy file names.'
            },
            {
                title: 'What is Version Control?',
                content: '<h1>What is Version Control?</h1><div class="concept-examples-with-images"><div class="example-row animate-slide-in-1"><div class="example-content"><div class="example-icon">📝</div><span>Google Docs revision history</span></div><div class="example-image-small"><img src="assets/1-google-docs-revision-historyimage.png" alt="Google Docs revision history"></div></div><div class="example-row animate-slide-in-2"><div class="example-content"><div class="example-icon">🎮</div><span>Save files in video games</span></div><div class="example-image-small"><img src="assets/1-video-game-history.jpeg" alt="Video game save files"></div></div><div class="example-row animate-slide-in-3"><div class="example-content"><div class="example-icon">🌿</div><span>Loki timeline branches</span></div><div class="example-image-small"><img src="assets/1-Loki-timeline-branch.gif" alt="Loki timeline branches showing different realities"></div></div></div>',
                notes: 'Start with relatable examples students understand.'
            },
            {
                title: 'What is Version Control?',
                content: '<h1>What is Version Control?</h1><div class="hierarchy-comparison" style="margin-top: -40px;"><div class="hierarchy-side animate-slide-left"><div class="hierarchy-image"><img src="assets/2-folder-hierachy.png" alt="Folder hierarchy showing nested folders" style="max-width: 200%; transform: scale(2.0);"></div></div><div class="hierarchy-side animate-slide-right"><div class="hierarchy-image"><img src="assets/2-version-graph.png" alt="Git version graph showing commits, branches, and tags" style="max-width: 200%; transform: scale(2.0);"></div></div></div>',
                notes: 'Compare traditional file organization with Git\'s branching approach.'
            },
            {
                title: 'Why Do We Need Version Control?',
                content: '<h1>Why Do We Need Version Control?</h1><div class="problems-solutions"><div class="problems animate-slide-left"><div class="problem-icon">😵</div><h2>Without Version Control:</h2><ul><li><span class="bullet-icon">📁</span>Messy file naming</li><li><span class="bullet-icon">💥</span>Lost work</li><li><span class="bullet-icon">🤯</span>Difficult collaboration</li></ul></div><div class="solutions animate-slide-right"><div class="solution-icon">😊</div><h2>With Version Control:</h2><ul><li><span class="bullet-icon">📚</span>Organized history</li><li><span class="bullet-icon">🛡️</span>Safe changes</li><li><span class="bullet-icon">🤝</span>Smooth teamwork</li></ul></div></div>',
                notes: 'Relate to student experiences with messy file naming.'
            },
            {
                title: 'What is Git?',
                content: '<h1>What is Git?</h1><div class="git-description animate-fade-in-1" style="margin: 20px 0;"><p style="font-size: 1.3em; line-height: 1.6;">Git is a <strong>distributed version control system</strong> that tracks changes in your code over time.</p></div><div class="concepts-visual"><div class="concept-item animate-zoom-in-1"><div class="concept-visual">📂</div><div class="concept-text"><strong>Repository:</strong> A folder Git watches</div></div><div class="concept-item animate-zoom-in-2"><div class="concept-visual">📸</div><div class="concept-text"><strong>Commit:</strong> A snapshot of your project</div></div><div class="concept-item animate-zoom-in-3"><div class="concept-visual">🌿</div><div class="concept-text"><strong>Branch:</strong> A separate timeline</div></div><div class="concept-item animate-zoom-in-4"><div class="concept-visual">☁️</div><div class="concept-text"><strong>Remote:</strong> Online copy (like GitHub)</div></div></div>',
                notes: 'Introduce Git as the industry-standard version control tool. Focus on the big picture with simple analogies.'
            },
            {
                title: 'Git Repository Setup',
                content: '<h1>Git Repository Setup</h1><div class="setup-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;"><div class="setup-option animate-slide-in-1"><div style="font-size: 3em; text-align: center; margin-bottom: 20px;">🆕</div><h2 style="text-align: center;">Create New Repository</h2><div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;"><code style="font-size: 1.2em;">git init</code><p style="margin-top: 15px; color: #666;">Start tracking a new project</p></div></div><div class="setup-option animate-slide-in-2"><div style="font-size: 3em; text-align: center; margin-bottom: 20px;">📥</div><h2 style="text-align: center;">Clone Existing Repository</h2><div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;"><code style="font-size: 1.2em;">git clone &lt;url&gt;</code><p style="margin-top: 15px; color: #666;">Copy an existing project from GitHub</p></div></div></div>',
                notes: 'Explain the two main ways to start working with Git: creating a new repository or cloning an existing one.'
            },
            {
                title: 'Essential Git Operations',
                content: '<h1>Essential Git Operations</h1><div class="git-operations" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px;"><div class="operation animate-fade-in-1" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🔍</div><h3>Check Status</h3><code style="font-size: 1.1em;">git status</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">See what files have changed</p></div><div class="operation animate-fade-in-2" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">📋</div><h3>Stage Changes</h3><code style="font-size: 1.1em;">git add &lt;file&gt;</code><br><code style="font-size: 1.1em;">git add .</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Prepare files for commit</p></div><div class="operation animate-fade-in-3" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">💾</div><h3>Save Snapshot</h3><code style="font-size: 1.1em;">git commit -m "message"</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Create a save point</p></div><div class="operation animate-fade-in-4" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">☁️</div><h3>Sync with GitHub</h3><code style="font-size: 1.1em;">git push</code><br><code style="font-size: 1.1em;">git pull</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Upload/download changes</p></div></div>',
                notes: 'Cover the fundamental Git operations students will use most frequently. Emphasize that these are the building blocks of version control.'
            },
            {
                title: 'Branch Management',
                content: '<h1>Branch Management</h1><div class="branch-management" style="margin-top: 40px;"><div class="branch-intro animate-fade-in-1" style="margin-bottom: 40px;"><p style="font-size: 1.2em; line-height: 1.6;">Branches let you work on different versions of your project simultaneously without affecting the main code.</p></div><div class="branch-commands" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px;"><div class="branch-cmd animate-slide-in-1" style="background: #f5f5f5; padding: 20px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🌿</div><h3>Create Branch</h3><code style="font-size: 1.1em;">git branch &lt;name&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Make a new branch</p></div><div class="branch-cmd animate-slide-in-2" style="background: #f5f5f5; padding: 20px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🔄</div><h3>Switch Branch</h3><code style="font-size: 1.1em;">git checkout &lt;name&gt;</code><br><code style="font-size: 1.1em;">git switch &lt;name&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Move to another branch</p></div><div class="branch-cmd animate-slide-in-3" style="background: #f5f5f5; padding: 20px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">📋</div><h3>List Branches</h3><code style="font-size: 1.1em;">git branch</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">See all branches</p></div><div class="branch-cmd animate-slide-in-4" style="background: #f5f5f5; padding: 20px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🔀</div><h3>Merge Branch</h3><code style="font-size: 1.1em;">git merge &lt;name&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Combine branches</p></div><div class="branch-cmd animate-slide-in-5" style="background: #f5f5f5; padding: 20px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🗑️</div><h3>Delete Branch</h3><code style="font-size: 1.1em;">git branch -d &lt;name&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Remove a branch</p></div></div></div>',
                notes: 'Introduce branch management commands. Emphasize that branches are lightweight and easy to create. Show how to merge branches to combine work.'
            },
            {
                title: 'Working with Remote Repositories',
                content: '<h1>Working with Remote Repositories ☁️</h1><div class="remote-concept" style="margin-top: 40px;"><div class="remote-intro animate-fade-in-1" style="margin-bottom: 40px;"><p style="font-size: 1.2em; line-height: 1.6;">Remote repositories are online copies of your project hosted on platforms like GitHub, allowing collaboration and backup.</p></div><div class="remote-operations" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;"><div class="remote-op animate-slide-in-1" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">📤</div><h3>Push Changes</h3><code style="font-size: 1.1em;">git push origin &lt;branch&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Upload your commits to GitHub</p></div><div class="remote-op animate-slide-in-2" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">📥</div><h3>Pull Changes</h3><code style="font-size: 1.1em;">git pull origin &lt;branch&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Download latest changes from GitHub</p></div><div class="remote-op animate-slide-in-3" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🔗</div><h3>Add Remote</h3><code style="font-size: 1.1em;">git remote add origin &lt;url&gt;</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">Connect to a GitHub repository</p></div><div class="remote-op animate-slide-in-4" style="background: #f5f5f5; padding: 25px; border-radius: 8px;"><div style="font-size: 2.5em; margin-bottom: 15px;">🔍</div><h3>View Remotes</h3><code style="font-size: 1.1em;">git remote -v</code><p style="margin-top: 10px; color: #666; font-size: 0.9em;">List all remote connections</p></div></div></div>',
                notes: 'Explain how to work with remote repositories on GitHub. Emphasize that remotes enable collaboration and serve as backup. Show the push/pull workflow.'
            },
            {
                title: 'Pull Requests',
                content: '<h1>Pull Requests 🔄</h1><div class="pull-request-concept"><div class="pr-workflow"><h2>📋 The Pull Request Workflow</h2><div class="workflow-steps-pr"><div class="pr-step animate-slide-in-1"><div class="step-number">1</div><div class="step-content"><strong>Create branch</strong><br><span>Work on your feature</span></div></div><div class="pr-step animate-slide-in-2"><div class="step-number">2</div><div class="step-content"><strong>Push to GitHub</strong><br><span>Upload your branch</span></div></div><div class="pr-step animate-slide-in-3"><div class="step-number">3</div><div class="step-content"><strong>Open Pull Request</strong><br><span>Request to merge your work</span></div></div><div class="pr-step animate-slide-in-4"><div class="step-number">4</div><div class="step-content"><strong>Review & Merge</strong><br><span>Team reviews and approves</span></div></div></div></div><div class="pr-benefits"><h2>✨ Why Use Pull Requests?</h2><div class="benefits-list"><div class="benefit-item animate-fade-in-1"><div class="benefit-icon">👀</div><div class="benefit-text">Code review before merging</div></div><div class="benefit-item animate-fade-in-2"><div class="benefit-icon">💬</div><div class="benefit-text">Discuss changes with team</div></div><div class="benefit-item animate-fade-in-3"><div class="benefit-icon">📝</div><div class="benefit-text">Document what changed and why</div></div><div class="benefit-item animate-fade-in-4"><div class="benefit-icon">🛡️</div><div class="benefit-text">Protect main branch from bugs</div></div></div></div></div>',
                notes: 'Emphasize pull requests as collaborative tool for safe code integration.'
            },
            {
                title: 'Viewing Changes with Git Diff',
                content: '<h1>Viewing Changes with Git Diff 🔍</h1><div class="diff-concept"><div class="diff-commands"><h2>📋 Essential Diff Commands</h2><div class="diff-commands-grid"><div class="diff-command animate-slide-in-1"><div class="command-header"><code>git diff</code></div><div class="command-desc">See unstaged changes in your files</div></div><div class="diff-command animate-slide-in-2"><div class="command-header"><code>git diff --staged</code></div><div class="command-desc">See staged changes ready to commit</div></div><div class="diff-command animate-slide-in-3"><div class="command-header"><code>git diff HEAD~1</code></div><div class="command-desc">Compare with previous commit</div></div><div class="diff-command animate-slide-in-4"><div class="command-header"><code>git diff branch-name</code></div><div class="command-desc">Compare with another branch</div></div></div></div><div class="diff-visual"><h2>🎨 Reading Diff Output</h2><div class="diff-example animate-fade-in"><div class="diff-output"><div class="diff-header">@@ -1,3 +1,4 @@</div><div class="diff-line unchanged"> function greet(name) {</div><div class="diff-line removed">-   console.log("Hello " + name);</div><div class="diff-line added">+   console.log("Hello, " + name + "!");</div><div class="diff-line added">+   return `Welcome ${name}`;</div><div class="diff-line unchanged"> }</div></div><div class="diff-legend"><div class="legend-item"><span class="legend-color removed"></span>Removed lines (-)</div><div class="legend-item"><span class="legend-color added"></span>Added lines (+)</div><div class="legend-item"><span class="legend-color unchanged"></span>Unchanged lines</div></div></div></div></div>',
                notes: 'Show students how to see exactly what changed in their code before committing.'
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
            },
            {
                title: 'Configuring Git',
                content: '<h1>Configuring Git</h1><div class="config-steps"><div class="command-block"><h2>Essential Setup Commands:</h2><pre>git config --global user.name "Your Name"<br>git config --global user.email "your.email@example.com"</pre></div><div class="verification"><h2>Verify Your Configuration:</h2><pre>git config --list<br>git config user.name<br>git config user.email</pre></div></div>',
                notes: 'Demonstrate this live. Emphasize this is one-time setup.'
            },
            {
                title: 'GitHub SSH Key Setup',
                content: '<h1>GitHub SSH Key Setup 🔐</h1><div class="ssh-setup" style="margin-top: 20px;"><div class="ssh-intro animate-fade-in-1" style="margin-bottom: 20px;"><p style="font-size: 1.1em; line-height: 1.5;">SSH keys provide secure authentication between your computer and GitHub without entering passwords.</p></div><div class="ssh-steps" style="display: flex; flex-direction: column; gap: 15px;"><div class="ssh-step animate-slide-in-1" style="background: #f5f5f5; padding: 15px; border-radius: 8px;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;"><div style="font-size: 2em;">🔑</div><h3 style="margin: 0; font-size: 1.1em;">Generate SSH Key</h3></div><code style="font-size: 1em; display: block; background: #fff; padding: 12px; border-radius: 4px; margin-top: 8px;">ssh-keygen -t ed25519 -C "your_email@example.com"</code><p style="margin-top: 10px; color: #666; font-size: 0.85em;">Press Enter to accept default location and set a passphrase (optional)</p></div><div class="ssh-step animate-slide-in-2" style="background: #f5f5f5; padding: 15px; border-radius: 8px;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;"><div style="font-size: 2em;">📋</div><h3 style="margin: 0; font-size: 1.1em;">Copy SSH Key</h3></div><code style="font-size: 1em; display: block; background: #fff; padding: 12px; border-radius: 4px; margin-top: 8px;">cat ~/.ssh/id_ed25519.pub</code><p style="margin-top: 10px; color: #666; font-size: 0.85em;">Copy the entire output</p></div><div class="ssh-step animate-slide-in-3" style="background: #f5f5f5; padding: 15px; border-radius: 8px;"><div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;"><div style="font-size: 2em;">⚙️</div><h3 style="margin: 0; font-size: 1.1em;">Add to GitHub</h3></div><p style="margin-top: 8px; color: #666; font-size: 0.85em;">Go to GitHub → Settings → SSH and GPG keys → New SSH key → Paste your key</p></div></div></div>',
                notes: 'Walk students through setting up SSH keys for GitHub. Emphasize this is a one-time setup that makes working with GitHub more secure and convenient.'
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
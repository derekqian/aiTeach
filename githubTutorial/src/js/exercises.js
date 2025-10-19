// Exercise System
class ExerciseSystem {
    constructor() {
        this.exercises = null;
        this.currentExercise = null;
        this.progress = {};
    }

    async initialize() {
        try {
            const response = await fetch('exercises/exercises.json');
            const data = await response.json();
            this.exercises = data.exercises;
            this.loadProgress();
            this.setupEventListeners();
            this.populateExerciseGrids(); // Add this line to populate grids
        } catch (error) {
            console.error('Error loading exercises:', error);
        }
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('exerciseProgress');
        this.progress = savedProgress ? JSON.parse(savedProgress) : {};
    }

    saveProgress() {
        localStorage.setItem('exerciseProgress', JSON.stringify(this.progress));
    }

    setupEventListeners() {
        // Terminal exercise handler
        document.addEventListener('terminalExercise', (e) => {
            const { command, exerciseId, taskId } = e.detail;
            this.validateTerminalCommand(command, exerciseId, taskId);
        });

        // GUI exercise handler
        document.addEventListener('guiExercise', (e) => {
            const { action, exerciseId, stepId } = e.detail;
            this.validateGuiAction(action, exerciseId, stepId);
        });

        // Quiz handler
        document.addEventListener('quizSubmit', (e) => {
            const { quizId, answers } = e.detail;
            this.gradeQuiz(quizId, answers);
        });
    }

    async startTerminalExercise(exerciseId) {
        const exercise = this.exercises.terminal.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        const container = document.getElementById('exerciseContent');
        container.innerHTML = this.generateTerminalExerciseHTML(exercise);
        
        // Initialize terminal simulator
        this.initializeTerminalSimulator(exercise);
    }

    generateTerminalExerciseHTML(exercise) {
        return `
            <div class="exercise-container terminal-exercise">
                <div class="exercise-header">
                    <h2>${exercise.title}</h2>
                    <p>${exercise.description}</p>
                </div>

                <div class="exercise-workspace">
                    <div class="terminal-section">
                        <div class="terminal-simulator">
                            <div class="terminal-header">
                                <span class="terminal-title">Terminal</span>
                                <button class="clear-terminal">Clear</button>
                            </div>
                            <div class="terminal-output"></div>
                            <div class="terminal-input">
                                <span class="prompt">$</span>
                                <input type="text" class="command-input" placeholder="Type your command here...">
                            </div>
                        </div>
                    </div>

                    <div class="tasks-section">
                        <div class="current-task">
                            <h3>Current Task</h3>
                            <div class="current-task-content">
                                <!-- Current task will be populated here -->
                            </div>
                        </div>

                        <div class="task-progress">
                            <h4>Progress</h4>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <span class="progress-text">0 of ${exercise.tasks.length} completed</span>
                        </div>

                        <div class="task-list">
                            <h4>All Tasks</h4>
                            ${exercise.tasks.map((task, index) => `
                                <div class="task ${index === 0 ? 'active' : ''}" data-task-id="${task.id}" data-task-index="${index}">
                                    <div class="task-number">${index + 1}</div>
                                    <div class="task-content">
                                        <div class="task-instruction">${task.instruction}</div>
                                        <button class="hint-button">💡 Hint</button>
                                        <div class="hint" hidden>${task.hint}</div>
                                        <div class="validation-message"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeTerminalSimulator(exercise) {
        const input = document.querySelector('.command-input');
        const output = document.querySelector('.terminal-output');
        const currentTaskContent = document.querySelector('.current-task-content');
        const clearButton = document.querySelector('.clear-terminal');

        // Initialize current task display
        this.updateCurrentTaskDisplay(exercise);

        // Handle command input
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    // Display command in output
                    this.addToTerminalOutput(`$ ${command}`);
                    this.processTerminalCommand(command, exercise);
                    input.value = '';
                }
            }
        });

        // Handle clear terminal
        clearButton.addEventListener('click', () => {
            output.innerHTML = '';
        });

        // Handle hint buttons
        document.querySelectorAll('.hint-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const task = e.target.closest('.task');
                const hint = task.querySelector('.hint');
                hint.hidden = !hint.hidden;
                e.target.textContent = hint.hidden ? '💡 Hint' : '🙈 Hide Hint';
            });
        });

        // Handle task clicking for navigation
        document.querySelectorAll('.task').forEach(task => {
            task.addEventListener('click', () => {
                const taskId = task.getAttribute('data-task-id');
                this.setCurrentTask(exercise, taskId);
            });
        });

        // Focus the input
        input.focus();
    }

    updateCurrentTaskDisplay(exercise) {
        const currentTaskId = this.getCurrentTaskId(exercise);
        const currentTask = exercise.tasks.find(t => t.id === currentTaskId);
        const currentTaskContent = document.querySelector('.current-task-content');

        if (currentTask && currentTaskContent) {
            currentTaskContent.innerHTML = `
                <div class="current-task-instruction">${currentTask.instruction}</div>
                <div class="current-task-hint">
                    <button class="current-hint-button">💡 Need a hint?</button>
                    <div class="current-hint" hidden>${currentTask.hint}</div>
                </div>
            `;

            // Handle current task hint
            const hintButton = currentTaskContent.querySelector('.current-hint-button');
            const hint = currentTaskContent.querySelector('.current-hint');
            hintButton.addEventListener('click', () => {
                hint.hidden = !hint.hidden;
                hintButton.textContent = hint.hidden ? '💡 Need a hint?' : '🙈 Hide hint';
            });
        }

        // Update task list active state with animation
        document.querySelectorAll('.task').forEach(task => {
            const wasActive = task.classList.contains('active');
            const shouldBeActive = task.getAttribute('data-task-id') === currentTaskId;

            task.classList.toggle('active', shouldBeActive);

            // Add new active animation if this task just became active
            if (!wasActive && shouldBeActive) {
                task.classList.add('new-active');
                setTimeout(() => {
                    task.classList.remove('new-active');
                }, 600); // Match animation duration
            }
        });

        // Auto-scroll to current active task
        this.scrollToActiveTask();

        // Update progress
        this.updateProgressDisplay(exercise);
    }

    scrollToActiveTask() {
        // Small delay to ensure DOM updates are complete
        setTimeout(() => {
            const activeTask = document.querySelector('.task.active');
            const tasksSection = document.querySelector('.tasks-section');

            if (activeTask && tasksSection) {
                // Calculate the position to center the active task in the scrollable area
                const taskOffset = activeTask.offsetTop;
                const taskHeight = activeTask.offsetHeight;
                const sectionHeight = tasksSection.clientHeight;
                const scrollPosition = taskOffset - (sectionHeight / 2) + (taskHeight / 2);

                // Smooth scroll to the calculated position
                tasksSection.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }
        }, 100); // Small delay for DOM updates
    }

    updateProgressDisplay(exercise) {
        const progress = this.progress[exercise.id] || {};
        const completedTasks = exercise.tasks.filter(task => progress[task.id]).length;
        const totalTasks = exercise.tasks.length;
        const percentage = (completedTasks / totalTasks) * 100;

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${completedTasks} of ${totalTasks} completed`;
    }

    setCurrentTask(exercise, taskId) {
        // Update internal state if needed
        this.currentTaskId = taskId;
        this.updateCurrentTaskDisplay(exercise);
    }

    addToTerminalOutput(text) {
        const output = document.querySelector('.terminal-output');
        if (output) {
            output.innerHTML += text + '\n';
            output.scrollTop = output.scrollHeight;
        }
    }

    processTerminalCommand(command, exercise) {
        const event = new CustomEvent('terminalExercise', {
            detail: {
                command,
                exerciseId: exercise.id,
                taskId: this.getCurrentTaskId(exercise)
            }
        });
        document.dispatchEvent(event);
    }

    validateTerminalCommand(command, exerciseId, taskId) {
        const exercise = this.exercises.terminal.find(ex => ex.id === exerciseId);
        const task = exercise.tasks.find(t => t.id === taskId);

        if (!task) return;

        const isValid = new RegExp(task.validation).test(command);
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const validationMessage = taskElement?.querySelector('.validation-message');

        if (isValid) {
            // Add success output to terminal
            this.addToTerminalOutput('✅ Correct! Task completed.');

            // Update task visual state with animation
            if (taskElement) {
                // Add completion animation
                taskElement.classList.add('just-completed');

                // After animation, add completed class
                setTimeout(() => {
                    taskElement.classList.remove('just-completed');
                    taskElement.classList.add('completed');
                }, 800);

                if (validationMessage) {
                    validationMessage.textContent = '✅ Completed!';
                    validationMessage.className = 'validation-message success';
                }
            }

            // Update progress
            this.updateProgress(exerciseId, taskId, true);

            // Move to next task
            this.moveToNextTask(exercise);

        } else {
            // Add error output to terminal
            this.addToTerminalOutput('❌ That\'s not quite right. Try again!');

            if (validationMessage) {
                validationMessage.textContent = '❌ Try again';
                validationMessage.className = 'validation-message error';
            }
        }
    }

    moveToNextTask(exercise) {
        const progress = this.progress[exercise.id] || {};
        const nextTask = exercise.tasks.find(task => !progress[task.id]);

        if (nextTask) {
            // Small delay to allow completion animation to finish before moving to next task
            setTimeout(() => {
                // Move to next incomplete task
                this.setCurrentTask(exercise, nextTask.id);

                // Add a celebration message for completing the previous task
                this.addToTerminalOutput('🎉 Great job! Moving to the next task...\n');
            }, 800); // 800ms delay for smooth transition
        } else {
            // All tasks completed!
            this.addToTerminalOutput('\n🎉 Congratulations! You\'ve completed all tasks in this exercise!');
            const currentTaskContent = document.querySelector('.current-task-content');
            if (currentTaskContent) {
                currentTaskContent.innerHTML = `
                    <div class="exercise-complete">
                        <h3>🎉 Exercise Complete!</h3>
                        <p>Great job! You've mastered all the tasks in this exercise.</p>
                        <button class="back-to-exercises" onclick="window.location.reload()">Choose Another Exercise</button>
                    </div>
                `;
            }
        }
    }

    startQuiz(quizId) {
        const quiz = this.exercises.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        const container = document.getElementById('exerciseContent');
        container.innerHTML = this.generateQuizHTML(quiz);

        // Set up quiz event listeners
        const form = container.querySelector('.quiz-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const answers = Array.from(form.querySelectorAll('input:checked')).map(input => parseInt(input.value));
            this.gradeQuiz(quizId, answers);
        });
    }

    generateQuizHTML(quiz) {
        return `
            <div class="quiz-container">
                <h2>${quiz.title}</h2>
                <p>${quiz.description}</p>

                <form class="quiz-form">
                    ${quiz.questions.map((q, index) => `
                        <div class="quiz-question" data-question-id="${q.id}">
                            <p class="question-text">${index + 1}. ${q.question}</p>
                            <div class="options">
                                ${q.options.map((option, optIndex) => `
                                    <label class="option">
                                        <input type="radio" name="q${index}" value="${optIndex}">
                                        ${option}
                                    </label>
                                `).join('')}
                            </div>
                            <div class="question-feedback"></div>
                        </div>
                    `).join('')}
                    <button type="submit" class="submit-quiz">Submit Answers</button>
                </form>
            </div>
        `;
    }

    gradeQuiz(quizId, answers) {
        const quiz = this.exercises.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        let score = 0;
        answers.forEach((answer, index) => {
            const question = quiz.questions[index];
            const questionElement = document.querySelector(`[data-question-id="${question.id}"]`);
            const feedback = questionElement.querySelector('.question-feedback');

            if (answer === question.correctAnswer) {
                score++;
                feedback.textContent = '✅ Correct!';
                feedback.className = 'question-feedback correct';
            } else {
                feedback.textContent = '❌ Incorrect';
                feedback.className = 'question-feedback incorrect';
            }
        });

        this.updateProgress(quizId, 'score', (score / quiz.questions.length) * 100);
    }

    getCurrentTaskId(exercise) {
        const progress = this.progress[exercise.id] || {};
        const incompleteTasks = exercise.tasks.filter(task => !progress[task.id]);
        return incompleteTasks[0]?.id || exercise.tasks[0].id;
    }

    updateProgress(exerciseId, itemId, value) {
        if (!this.progress[exerciseId]) {
            this.progress[exerciseId] = {};
        }
        this.progress[exerciseId][itemId] = value;
        this.saveProgress();
    }

    populateExerciseGrids() {
        // Populate terminal exercises
        this.populateGrid('terminal', this.exercises.terminal);

        // Populate GUI exercises
        this.populateGrid('gui', this.exercises.gui);

        // Populate quizzes
        this.populateGrid('quizzes', this.exercises.quizzes);
    }

    populateGrid(type, exercises) {
        const grid = document.querySelector(`#${type} .exercise-grid`);
        if (!grid || !exercises) return;

        exercises.forEach(exercise => {
            const card = this.createExerciseCard(exercise, type);
            grid.appendChild(card);
        });
    }

    createExerciseCard(exercise, type) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <h3>${exercise.title}</h3>
            <p>${exercise.description}</p>
            <div class="exercise-meta">
                ${type === 'terminal' ? `<span>${exercise.tasks?.length || 0} tasks</span>` : ''}
                ${type === 'gui' ? `<span>${exercise.steps?.length || 0} steps</span>` : ''}
                ${type === 'quizzes' ? `<span>${exercise.questions?.length || 0} questions</span>` : ''}
            </div>
            <button class="start-exercise" data-exercise-id="${exercise.id}" data-type="${type}">
                Start ${type === 'quizzes' ? 'Quiz' : 'Exercise'}
            </button>
        `;

        // Add click handler
        const button = card.querySelector('.start-exercise');
        button.addEventListener('click', () => {
            if (type === 'terminal') {
                this.startTerminalExercise(exercise.id);
            } else if (type === 'gui') {
                this.startGuiExercise(exercise.id);
            } else if (type === 'quizzes') {
                this.startQuiz(exercise.id);
            }
        });

        return card;
    }

    startGuiExercise(exerciseId) {
        const exercise = this.exercises.gui.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        const container = document.getElementById('exerciseContent');
        container.innerHTML = this.generateGuiExerciseHTML(exercise);

        // Initialize GUI exercise interactions
        this.initializeGuiExercise(exercise);
    }

    generateGuiExerciseHTML(exercise) {
        return `
            <div class="exercise-container gui-exercise">
                <h2>${exercise.title}</h2>
                <p>${exercise.description}</p>

                <div class="vs-code-simulator">
                    <div class="vs-code-interface">
                        <div class="activity-bar">
                            <div class="activity-icon source-control-icon" data-target="source-control-icon">
                                <span>⚡</span>
                            </div>
                        </div>
                        <div class="sidebar">
                            <div class="source-control-panel">
                                <h3>Source Control</h3>
                                <div class="changes-list">
                                    <div class="change-item">
                                        <span class="file-name">README.md</span>
                                        <button class="stage-change-button" data-target="stage-change-button">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-list">
                    ${exercise.steps.map(step => `
                        <div class="step" data-step-id="${step.id}">
                            <div class="step-instruction">${step.instruction}</div>
                            <div class="validation-message"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    initializeGuiExercise(exercise) {
        // Add click handlers for GUI elements
        document.querySelectorAll('[data-target]').forEach(element => {
            element.addEventListener('click', () => {
                const target = element.getAttribute('data-target');
                const event = new CustomEvent('guiExercise', {
                    detail: {
                        action: 'click',
                        target: target,
                        exerciseId: exercise.id,
                        stepId: this.getCurrentStepId(exercise)
                    }
                });
                document.dispatchEvent(event);
            });
        });
    }

    getCurrentStepId(exercise) {
        const progress = this.progress[exercise.id] || {};
        const incompleteSteps = exercise.steps.filter(step => !progress[step.id]);
        return incompleteSteps[0]?.id || exercise.steps[0].id;
    }

    validateGuiAction(action, exerciseId, stepId) {
        const exercise = this.exercises.gui.find(ex => ex.id === exerciseId);
        const step = exercise.steps.find(s => s.id === stepId);

        if (!step) return;

        const stepElement = document.querySelector(`[data-step-id="${stepId}"]`);
        const validationMessage = stepElement.querySelector('.validation-message');

        // Simple validation - in a real app, this would be more sophisticated
        validationMessage.textContent = '✅ Step completed!';
        validationMessage.className = 'validation-message success';
        this.updateProgress(exerciseId, stepId, true);
    }
}

// Initialize the exercise system
document.addEventListener('DOMContentLoaded', () => {
    const exerciseSystem = new ExerciseSystem();
    exerciseSystem.initialize();
});
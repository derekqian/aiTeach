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
                <h2>${exercise.title}</h2>
                <p>${exercise.description}</p>
                
                <div class="terminal-simulator">
                    <div class="terminal-output"></div>
                    <div class="terminal-input">
                        <span class="prompt">$</span>
                        <input type="text" class="command-input" placeholder="Type your command here...">
                    </div>
                </div>

                <div class="task-list">
                    ${exercise.tasks.map(task => `
                        <div class="task" data-task-id="${task.id}">
                            <div class="task-instruction">${task.instruction}</div>
                            <button class="hint-button">Show Hint</button>
                            <div class="hint" hidden>${task.hint}</div>
                            <div class="validation-message"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    initializeTerminalSimulator(exercise) {
        const input = document.querySelector('.command-input');
        const output = document.querySelector('.terminal-output');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                this.processTerminalCommand(command, exercise);
                input.value = '';
            }
        });
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
        const validationMessage = taskElement.querySelector('.validation-message');

        if (isValid) {
            validationMessage.textContent = '✅ Correct!';
            validationMessage.className = 'validation-message success';
            this.updateProgress(exerciseId, taskId, true);
        } else {
            validationMessage.textContent = '❌ Try again';
            validationMessage.className = 'validation-message error';
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
}

// Initialize the exercise system
document.addEventListener('DOMContentLoaded', () => {
    const exerciseSystem = new ExerciseSystem();
    exerciseSystem.initialize();
});
// Presentation state
let currentSlideIndex = 0;
let slides = [];
let presenterNotes = {};

// DOM Elements
const slidesContainer = document.querySelector('.slides');
const presenterNotesContainer = document.querySelector('.presenter-notes');
const slideCounter = document.getElementById('slideCounter');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
const toggleNotesButton = document.getElementById('toggleNotes');

// Initialize presentation
document.addEventListener('DOMContentLoaded', async () => {
    await loadPresentation();
    setupEventListeners();
    showSlide(currentSlideIndex);
});

// Load presentation content
async function loadPresentation() {
    try {
        // This will be replaced with actual module content loading
        const demoSlides = [
            {
                title: 'Introduction to Version Control',
                content: `
                    <h1>Introduction to Version Control</h1>
                    <ul>
                        <li>What is version control?</li>
                        <li>Why do we need it?</li>
                        <li>Basic concepts and terminology</li>
                    </ul>
                `,
                notes: 'Begin by explaining the concept of version control using familiar examples like Google Docs revision history.'
            },
            {
                title: 'Getting Started with Git',
                content: `
                    <h1>Getting Started with Git</h1>
                    <ul>
                        <li>Installing Git</li>
                        <li>Basic configuration</li>
                        <li>Your first repository</li>
                    </ul>
                `,
                notes: 'Demonstrate the installation process and basic git config commands. Address common installation issues.'
            }
        ];

        // Create slide elements
        demoSlides.forEach((slide, index) => {
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
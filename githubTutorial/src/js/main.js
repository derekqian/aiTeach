// Module data structure
const modules = [
    {
        id: 'intro',
        title: 'Introduction to Version Control',
        description: 'Learn the basics of version control and why it matters',
        level: 'Beginner'
    },
    {
        id: 'setup',
        title: 'VS Code and Git Setup',
        description: 'Set up your development environment with VS Code and Git',
        level: 'Beginner'
    },
    {
        id: 'basics',
        title: 'Basic Git Operations',
        description: 'Learn essential Git commands and operations in VS Code',
        level: 'Beginner'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeModules();
});

// Render module cards
function initializeModules() {
    const moduleGrid = document.querySelector('.module-grid');
    
    modules.forEach(module => {
        const moduleCard = createModuleCard(module);
        moduleGrid.appendChild(moduleCard);
    });
}

// Create a module card element
function createModuleCard(module) {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.innerHTML = `
        <h3>${module.title}</h3>
        <p>${module.description}</p>
        <span class="level">${module.level}</span>
        <button onclick="startModule('${module.id}')">Start Learning</button>
    `;
    return card;
}

// Handle module navigation
function startModule(moduleId) {
    // TODO: Implement module navigation
    console.log(`Starting module: ${moduleId}`);
}